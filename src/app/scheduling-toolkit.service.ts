import { Injectable } from '@angular/core';
import { Class, Section, Meeting, Range } from './class-section'
import * as _ from "lodash";
import * as moment from 'moment';
import { Moment } from 'moment'

import { EXCEPTIONS } from './exceptions'

@Injectable()
export class SchedulingToolkitService {

    constructor() { }

    /**
     * return true if two ranges overlap.
     * @param r1 
     * @param r2 
     */
    rangeOverlap(r1: Range, r2: Range): boolean {
        return r1.from <= r2.to && r1.to >= r2.from;
    }

    /**
     * compare the weekday strings, (e.g. MWF, TR), first
     * an overlap is impossible if they don't have intersection.
     * 
     * if they do have intersection of weekday strings, check their time slots with rangeOverlap
     * @param m1 
     * @param m2 
     */
    meetingOverlap(m1: Meeting, m2: Meeting) {
        const dateIntersect = _.intersection(m1.date.split(''), m2.date.split(''));
        if (dateIntersect.length == 0) {
            return false;
        }
        else {
            return this.rangeOverlap(m1.range, m2.range);
        }
    }

    /**
     * return true if two sections overlap.
     * kind of a trivial wrapper of meetingOverlap
     * @param s1 
     * @param s2 
     */
    sectionOverlap(s1: Section, s2: Section) {
        const m1 = s1.meetings;
        const m2 = s2.meetings;
        return this.meetingOverlap(m1, m2);
    }

    /**
     * Methods to preproc the course data
     * (1) group by "big section"(A section, B section)
     * (2) group by type(lecture, discussion)
     */

    /**
     * method to handle classes that do not follow our assumptions on 
     * section code (e.g. ADB, AL1)
     * @param course 
     * @param exceptionType type of the exception. e.g PHYSlike 
     */
    groupClassSectionByBigSectionException(course: Class, exceptionType: string): Section[][] {
        switch (exceptionType) {
            case "PHYSlike":
                // looks like these PHYS guys are pretty liberal in sections.
                // you can attend both A1 and L4U and D2V
                return [course.sections]; // have only one big section
            default:
                return null;
        }
    }

    /**
     * BASIC ASSUMPTION:
     *      the first letter of the section code (e.g. ADB, AL1)
     *      indicate the "big section" of this section
     * 
     * e.g. CS 173 has A section and B section.
     * both A and B section has the set of classes needed (a lecture and a discussion)
     * you cannot sign up for the lecture of A section and the discussion of B section
     * 
     * this is a method to group sections of a class by "big sections"
     * (dude I know the terminology sucks)
     * 
     * @param course 
     */
    groupClassSectionByBigSection(course: Class): Section[][] {
        // special cases handling
        const deptName: string = course.name.split(" ")[0];
        for (const exceptionType in EXCEPTIONS) {
            if (deptName in EXCEPTIONS[exceptionType]) { // 
                const except = this.groupClassSectionByBigSectionException(course, exceptionType);
                if (except) {
                    return except;
                }
            }
        }
        // "normal case"
        const sections =  _.groupBy(course.sections, sec => sec.section[0]);
        return _.values(sections);
    }

    /**
     * group the sections based on their "type". i.e. "LEC", "DIS", "LCD", "LBD"......
     * @param sections 
     */
    groupClassSectionBySectionType(sections: Section[]): Section[][] {
        const sectionGroups = _.groupBy(sections, sec => sec.type);
        return _.values(sectionGroups);
    }

    /**
     * given an already "type-grouped" set of big sections,
     * returns a generator that could keep generating
     * all possibilities within a "big section"
     * e.g. returns many (LEC, LBD) tuples
     * @param section
     */
    createBigSectionGenerator(bigSectionAlreadyTyped: Section[][]): IterableIterator<Section[]> {
        const gen = function* () {
            const doCartesian = (function * (i, prod: Section[]) {
                if (i == bigSectionAlreadyTyped.length) {
                    let shouldYield = true;
                    // e.g won't yield if a lecture has time conflict with its own discussion
                    for (let i=0; i<prod.length-1; ++i) {
                        for (let j=i+1; j<prod.length; ++j) {
                            if (this.sectionOverlap(prod[i], prod[j])) {
                                shouldYield = false;
                            }
                        }
                    }
                    if (shouldYield) {
                        yield prod;
                    }
                } else {
                    for (let j = 0; j < bigSectionAlreadyTyped[i].length; j++) {
                        yield* doCartesian(i + 1, prod.concat([bigSectionAlreadyTyped[i][j]]));
                    }
                }
            }).bind(this)
            yield* doCartesian(0, []);
        }
        return (gen.bind(this))();
    }

    /**
     * Filter out sections that has overlap with already chosen sections
     * @param bigSectionAlreadyTyped
     * @param sectionsChosen
     */
    pruneBigSection(bigSectionAlreadyTyped: Section[][], sectionsChosen: Section[]): Section[][] {
        return bigSectionAlreadyTyped.map(
            bsat => bsat.filter(
                sec => !sectionsChosen.some(
                    csec => this.sectionOverlap(sec, csec)
                )
            )
        )
    }

    /**
     * the helper method for creating state machine.
     * should schedule sections given big sections that are already type-grouped of courses
     */
    scheduleCourses: (bsat: Section[][][], index: number, chosenSections: Section[]) => IterableIterator<Section[]> =
        (function * (
            bigSectionsAlreadyTyped: Section[][][],
            index: number,
            chosenSections: Section[]
        )
        {
            // base case
            if (index == bigSectionsAlreadyTyped.length) { // you made it!
                yield chosenSections;
            } else {
                // prune and recurse. that's it.
                let bigSectionAlreadyTyped = bigSectionsAlreadyTyped[index];
                const pruned = this.pruneBigSection(bigSectionAlreadyTyped, chosenSections);
                const iter = this.createBigSectionGenerator(pruned);
                for (let courseCombination of iter) {
                    yield * this.scheduleCourses(
                        bigSectionsAlreadyTyped,
                        index + 1,
                        chosenSections.concat(courseCombination),
                    )
                }
            }
        }).bind(this)

    /**
     * returns a generator that could only generate the "optimal" schedule
     * @param courses
     */
    createStateMachineOnlyOptimal(courses: Class[]): IterableIterator<Section[]> {

        const bigSectionIndices = new Array(courses.length).fill(0);

        const bigSectionsOfCourses: Section[][][] = [];
        for (const course of courses) {
            bigSectionsOfCourses.push(this.groupClassSectionByBigSection(course));
        }

        const bigSectionLengths = new Array(courses.length);
        for (let i = 0; i < courses.length; ++i) {
            bigSectionLengths[i] = bigSectionsOfCourses[i].length;
        }

        var gen = function * () {
            while (true) {
                // try to schedule classes given current big section combination
                const chosenBigSectionsAlreadyTyped: Section[][][] = bigSectionsOfCourses.map(
                    (bsoc, index) => this.groupClassSectionBySectionType(bsoc[bigSectionIndices[index]])
                )

                // generate optimal schedule given current set of type-grouped big sections
                yield * this.scheduleCourses(
                    chosenBigSectionsAlreadyTyped,
                    0,
                    []
                )

                // get exhaustive on big section combinations
                ++bigSectionIndices[courses.length-1];
                for (let j = courses.length; 
                    --j >= 0 && bigSectionIndices[j] == bigSectionLengths[j]; ) 
                {
                    if (j == 0) {
                        // done searching for all big section combinations
                        return;
                    }
                    bigSectionIndices[j] = 0;
                    ++bigSectionIndices[j-1]; // carry
                }
            }
        }
        gen = gen.bind(this);
        const retVal = gen();
        return retVal;
    }

    /**
     * the true business of the WHOLE project
     * @param courses
     */
    createStateMachine(courses: Class[]): IterableIterator<Section[]> {
        console.log("COURSES: ", courses.map(c => c.name));
        
        var gen = function * () {
            while (courses.length) {
                // TODO: Notify the user before showing suboptimal scheduling
                yield * this.createStateMachineOnlyOptimal(courses);
                // will pop off least-prioritized course every time
                // we exhausted an optimal generator
                courses.pop(); 
            }
        }
        gen = gen.bind(this);
        return gen();
    }
}


