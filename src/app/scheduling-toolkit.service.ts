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
    groupClassSectionBySectionAB(course: Class): Section[][] {
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

}
