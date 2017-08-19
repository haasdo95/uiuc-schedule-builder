import { Injectable } from '@angular/core';
import { Class, Section, Meeting, Range } from './class-section'

@Injectable()
export class SchedulingToolkitService {

    constructor() { }

    rangeOverlap(r1: Range, r2: Range): boolean {
        return r1.from <= r2.to && r1.to >= r2.from;
    }

    meetingsOverlap(m1: Meeting, m2: Meeting) {
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

    sectionOverlap(s1: Section, s2: Section) {
        const m1 = s1.meetings;
        const m2 = s2.meetings;
        return this.meetingsOverlap(m1, m2);
    }

}
