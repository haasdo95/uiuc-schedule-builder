import { Component, OnInit } from '@angular/core';
import { CourseInfoService } from './course-info.service'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/pairwise';

import { Class, Section, Meeting, Range } from './class-section'
import { SchedulingToolkitService } from './scheduling-toolkit.service'

/**
 * IMPORTANT: To avoid further confusion, we call sections 
 * like the A, B section of CS 173 "big sections"
 * 
 * And the sections of a class, like its lab, lecture, discussion, "sections"
 */

/**
 * Algorithm to do exhaustive scheduling
 * 
 * e.g. We have CS 173 and MATH 241 to put into our schedule.
 * CS 173 has 2 big sections
 * MATH 241 has 5 big sections
 * 
 *  // put this chunk into a generator
 *  for bigsec173 in CS173.bigsections:
 *      for bigsec241 in CS241.bigsections:
 *          for lec173 in bigsec173.lectures:
 *              for dis173 in bigsec173.discussions:
 *                  for lec241 in bigsec241.lectures:
 *                      for dis241 in bigsec241.discussions:
 *                          tryPutIntoSchedule(lec173, lec241, dis173, dis241) // yield something
 * 
 *  PROBLEM: writing nested for loop of a variable amount 
 *           of iterables is possible but notoriously hard
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ CourseInfoService, SchedulingToolkitService ]
})
export class AppComponent implements OnInit {

    /**
     * False if user has never submitted any course name
     */
    private dirty: boolean = false;
    
    /**
     * Refactored to use Observable
     */
    private courseNamesSubject: Subject<string[]>;
    private courseNamesObservable: Observable<string[]>;

    /**
     * should contain the optimized schedule.
     * will become the Input of ScheduleComponent 
     */
    schedule = [];

    constructor(
        private cis: CourseInfoService,
        private stk: SchedulingToolkitService
    ) {}

    ngOnInit() {
        this.courseNamesSubject = new Subject();
        // Necessary because of the way pairwise works
        this.courseNamesObservable = this.courseNamesSubject.asObservable();

        this.courseNamesObservable.pairwise()
                .subscribe(twoCourses => {
                    if (this.isChanged(twoCourses[0], twoCourses[1])) {
                        this.resetStateMachine();
                    } else {
                        this.goOnWithCurrFSM();
                    }
                })
    }

    resetStateMachine() {
        console.log("NEW STUFF");
    }

    goOnWithCurrFSM() {
        console.log("OLD STUFF");
    }

    /**
     * A trivial method to compare string[]
     * @param prev 
     * @param curr 
     */
    private isChanged(prev: string[], curr: string[]): boolean {
        if (prev.length != curr.length) return true;
        for (let i = 0; i < prev.length; i++) {
            if (prev[i] != curr[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Supposed to be the driver of the scheduling algorithm
     * Fired when user hits "generate schedule"
     * @param courses
     */
    resetCourses(courses: string[]) {
        console.log(courses);
        if (!this.dirty) {
            // A padding made necessary because of the way pairwise works
            this.courseNamesSubject.next([]);
            this.dirty = true;
        }
        this.courseNamesSubject.next(courses);
    }
}
