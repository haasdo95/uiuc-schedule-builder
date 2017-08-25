import { Injectable } from '@angular/core';
import { Class, Section, Meeting, Range } from './class-section'
import * as _ from "lodash";

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
     * the meeting of a section consist of many ranges
     * e.g. MW 2:00-3:00 => ['M 2:00-3:00', 'W 2:00-3:00']
     * check all the ranges in two Meetings to detect overlap
     * @param m1 
     * @param m2 
     */
    meetingOverlap(m1: Meeting, m2: Meeting) {
        const ranges_1 = m1.ranges;
        const ranges_2 = m2.ranges;
        for (const r1 of ranges_1) {
            for (const r2 of ranges_2) {
                if (this.rangeOverlap(r1, r2)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * a trivial wrapper of meetingOverlap
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
     * e.g. CS 173 has A section and B section.
     * both A and B section has the set of classes needed(a lecture and a discussion)
     * 
     * this is a method to group sections of a class by "big sections"
     * (dude I know the terminology sucks)
     * 
     * @param course 
     */
    groupClassSectionByBigSection(course: Class): Section[][] {
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
     * returns a generator that could keep generating
     * all possibilities within a "big section"
     * e.g. returns many (LEC, LBD) tuples
     * @param section
     */
    createBigSectionGenerator(bigSectionAlreadyTyped: Section[][]): IterableIterator<Section[]> {
        const gen = function* () {
            function* doCartesian(i, prod) {
                if (i == bigSectionAlreadyTyped.length) {
                    yield prod;
                } else {
                    for (let j = 0; j < bigSectionAlreadyTyped[i].length; j++) {
                        yield* doCartesian(i + 1, prod.concat([bigSectionAlreadyTyped[i][j]]));
                    }
                }
            }
            yield* doCartesian(0, []);
        }
        return gen();
    }

    /**
     * Filter out sections that has overlap with already chosen sections
     * @param bigSectionAlreadyTyped 
     * @param sectionsChosen 
     */
    private pruneBigSection(bigSectionAlreadyTyped: Section[][], sectionsChosen: Section[]): Section[][] {
        return bigSectionAlreadyTyped.map(
            bsat => bsat.filter(
                sec => !sectionsChosen.some(
                    csec => this.sectionOverlap(sec, csec)
                )
            )
        )
    }

    /**
     * the true business of the WHOLE project
     * @param courses 
     */
    createStateMachine(courses: Class[]) {

        const scheduleCourses = function * (
            bigSectionsAlreadyTyped: Section[][][],
            index: number,
            chosenSections: Section[],
            pruneBigSection: (bsat: Section[][], csec: Section[]) => Section[][],
            createBigSectionGenerator: (bsat: Section[][]) => IterableIterator<Section[]>
        )
        {
            // base case
            if (index == bigSectionsAlreadyTyped.length) { // you made it!
                yield chosenSections;
            } else {
                // get big section for current course
                let bigSectionAlreadyTyped = bigSectionsAlreadyTyped[index];
                const pruned = pruneBigSection(bigSectionAlreadyTyped, chosenSections);
                /**
                 * Commented out since Cartesian product can handle this case
                 */
                // if (pruned.some(
                //     p => p.length == 0
                // )) // if all "LEC" are pruned! -> a failure
                // {
                //     return;
                // }
                const iter = createBigSectionGenerator(pruned);
                for (let courseCombination of iter) {
                    yield * scheduleCourses(
                        bigSectionsAlreadyTyped,
                        index + 1,
                        chosenSections.concat(courseCombination),
                        pruneBigSection,
                        createBigSectionGenerator
                    )
                }
            }
        }

        const bigSectionIndices = new Array(courses.length).fill(0);

        const bigSectionsOfCourses: Section[][][] = [];
        for (const course of courses) {
            // TODO: Take care of exceptions like PHYS!!!
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

                yield * scheduleCourses(
                    chosenBigSectionsAlreadyTyped,
                    0,
                    [],
                    this.pruneBigSection,
                    this.createBigSectionGenerator
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
        gen = gen.bind({this: this});
        const retVal = gen();
        return retVal;
    }

}
