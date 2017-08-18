import { Component, OnInit } from '@angular/core';
import { CourseInfoService } from './course-info.service'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/pairwise';

import { Class } from './class-section'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ CourseInfoService ]
})
export class AppComponent implements OnInit {

    private dirty: boolean = false;

    constructor(private cis: CourseInfoService) {}

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
     * Refactored to use Observable
     */
    courseNamesSubject: Subject<string[]>;
    courseNamesObservable: Observable<string[]>;

    /**
     * should contain the optimized schedule.
     * will become the Input of ScheduleComponent 
     */
    schedule = [];

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
            this.courseNamesSubject.next([]);
            this.dirty = true;
        }
        this.courseNamesSubject.next(courses);
    }
}
