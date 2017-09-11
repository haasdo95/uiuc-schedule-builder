import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CourseInfoService } from './course-info.service'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/partition';
import 'rxjs/add/operator/switchMap';

import * as MyWorker from "worker-loader!./worker/worker";

import * as moment from 'moment';
import { Moment } from 'moment';

import * as _ from "lodash";

import { Class, Section, Meeting, Range } from './class-section';
import { ScheduleMode } from './schedule-mode';

import { primaryColors, secondaryColors } from './color-choice';

interface IPayload {
    courses: string[],
    filterInfo: number[]
}

/**
 * this component is responsible for 
 *      (1) taking course names from FormComponent
 *      (2) asking the server for course info if needed.
 *      (3) scheduling the courses with the help of scheduling toolkit (stk)
 *      (4) channeling the schedule to ScheduleComponent to display.
 * 
BELOW is a graphic representation of what is going on.
      Server
        ⇅
course info service <=> AppComponent <=> scheduling toolkit service
                        ↗         ↘
       (course names) ↗             ↘ (scheduled sections)
                    ↗                 ↘
            FormComponent           ScheduleComponent
 */

/**
 * map weekday acronym used to course info API to weekdays to be parsable
 */
const weekDict = {
    'M': 'Mon',
    'T': 'Tue',
    'W': 'Wed',
    'R': 'Thu',
    'F': 'Fri'
}

/**
 * IMPORTANT: To avoid further confusion, we call sections
 * like the A, B section of CS 173 "big sections"
 * 
 * And the sections of a class, like its lab, lecture, discussion, "sections"
 */

/**
 * Algorithm to do exhaustive searching
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
 * 
 *  Due to the exponential nature of the problem at hand, I don't think a full loop through 
 *  all possibilities is feasible. It will almost certainly turn any modern web browser into a 
 *  horrifying halt, destroying user experience.
 *  
 *  The current architecture would report to the user the first feasible schedule it finds, 
 *  and generate next only if the user explicitly does so.
 *  This could significantly reduce the time needed to "see things popping up"
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ CourseInfoService ]
})
export class AppComponent implements OnInit {

    /**
     * false if user has never submitted any course name
     * 
     * a variable used to pad an initial [] in courseNamesObservable
     * given the way pairwise works
     */
    private dirty: boolean = false;

    /**
     * used to freeze up "Generate" button in form component
     */
    freezeGenerateButton: boolean = false;
    
    /**
     * used to switch mode in schedule-component
     * display tutorial initially
     */
    scheduleMode: ScheduleMode = ScheduleMode.TUTORIAL;

    /**
     * Refactored to use Observable
     * 
     * create a stream of user input, which contains an array of course names that
     * the user selects.
     */
    private payloadSubject: Subject<IPayload>;
    private payloadObservable: Observable<IPayload>;

    /**
     * should contain the optimized schedule.
     * will become the input of ScheduleComponent 
     * 
     * events is a formatted version of _sections that conforms to the full-calendar API.
     */
    _sections: Section[] = null;
    events: any[] = [];

    /**
     * getter and setter for _sections
     * 
     * will also do the necessary formatting and fill events array
     * when _sections is set to a newValue.
     */
    get sections () {
        return this._sections;
    }
    set sections (newValue: Section[]) {
        this._sections = newValue;
        if (!newValue) {
            this.events = [];
            return;
        }
        this.events = [];
        const groupedByCourseName = _.groupBy(newValue, (sec) => sec.courseName);
        let count = 0;
        let courseName2Color: any = {};
        for (let courseName in groupedByCourseName) {
            courseName2Color[courseName] = [primaryColors[count % primaryColors.length], secondaryColors[count % primaryColors.length]];
            count += 1;
        }
        for (const sec of newValue) {
            for (const wkDay of sec.meetings.date) {
                const weekday = weekDict[wkDay] as string;
                this.events.push({
                    title: sec.crn + ' - ' + sec.courseName
                            + '\n' + sec.type + 
                           ' - ' + sec.section,
                    start: moment(weekday + ' ' + sec.meetings.time.from, 'ddd hh:mm A').format(),
                    end: moment(weekday + ' ' + sec.meetings.time.to, 'ddd hh:mm A').format(),
                    color: courseName2Color[sec.courseName][1],
                    textColor: courseName2Color[sec.courseName][0]
                })
            }
        }
    }

    constructor(
        private cis: CourseInfoService,
        private ref: ChangeDetectorRef
    ) {}

    /**
     * this is actually just a generator
     * which generates a new schedule every time the user hits the GENERATE button
     */
    private worker: Worker = new MyWorker();

    ngOnInit() {
        // initialize the stream of course names
        this.payloadSubject = new Subject();
        this.payloadObservable = this.payloadSubject.asObservable();

        // fired when the worker finished scheduling and sent back result
        this.worker.onmessage = (e) => {
            this.sections = <Section[]> e.data;
            this.freezeGenerateButton = false; // unfreeze generate button
            this.scheduleMode = ScheduleMode.CALENDAR; // let schedule component display
            /**
             * looks like the change detection mechanism won't detect change made in 
             * a worker callback.
             * doing that manually is embarrassingly awkward but it works anyways
             */
            this.ref.detectChanges();
        }

        /**
         * (1)  used pairwise operator to find out if the user has submitted a new 
         *      set of course names.
         * (2)  used partition operator to create two separate streams. one, named "changed",
         *      represents the case where the user has submitted a new set of course names.
         *      and the stream "unchanged" should be self-explanatory enough.
         */
        const obs = this.payloadObservable.pairwise()
                .partition(twoPayloads => this.isChanged(twoPayloads[0], twoPayloads[1]));
        const changed = obs[0];
        const unchanged = obs[1];

        /**
         * (1)  whenever the user changed the set of course names, we issue a query to the server
         *      for the corresponding course info.
         * (2)  also, the state machine is reset.
         */
        changed.map(twoPayloads => twoPayloads[1])
               .map(payload => {
                   this.rangeFilter = this.createFilter(payload.filterInfo[0], payload.filterInfo[1]);
                   return <string[]>payload.courses;
               })
               .switchMap(courses =>
                    this.cis.getCoursesInfoByName(courses)
               )
               .map(courses => { // prune by morning and evening
                   courses.forEach(course => {
                       course.sections = course.sections.filter(this.rangeFilter);
                   })
                   return courses;
               })
               .subscribe(fetchedCourses => {
                //    this.stateMachine = this.stk.createStateMachine(fetchedCourses);
                //    this.sections = this.stateMachine.next().value;
                    this.worker.postMessage({
                        reset: true,
                        courses: fetchedCourses
                    })
               })
        /**
         * if the user goes on with the current set of course names, we just keep generating.
         * no server communication needed here.
         */
        unchanged.map(twoPayloads => twoPayloads[1])
                 .subscribe(courses => {
                    //  this.sections = this.stateMachine.next().value;
                    this.worker.postMessage({
                        next: true
                    })
                 })
    }

    /**
     * A trivial method to compare two string[]
     * @param prev the array of course names that the user submitted previously
     * @param curr the array of course names that the user submitted this time
     */
    private isChanged(prevPayload: IPayload, currPayload: IPayload): boolean {
        if (!prevPayload) return true;
        const prev = prevPayload.courses;
        const curr = currPayload.courses;
        if (prev.length != curr.length) return true;
        for (let i = 0; i < prev.length; i++) {
            if (prev[i] != curr[i]) {
                return true;
            }
        }
        const prevFilter = prevPayload.filterInfo;
        const currFilter = currPayload.filterInfo;
        if (prevFilter[0] != currFilter[0] || prevFilter[1] != currFilter[1]) {
            return true
        }
        return false;
    }

    /**
     * supposed to be the driver of the scheduling algorithm
     * fired when user hits "generate schedule"
     * @param courses payload (an array of course names and filter info) 
     *                  that the user just filled in FormComponent.
     */
    resetCourses(payload: any) {
        this.freezeGenerateButton = true; // freeze up "Generate" button
        this.scheduleMode = ScheduleMode.WAITING; // let schedule component show the "waiting" message
        if (!this.dirty) {
            // A padding made necessary because of the way pairwise works
            this.payloadSubject.next(null);
            this.dirty = true;
        }
        
        this.payloadSubject.next(payload);
    }

    private rangeFilter: (section: Section)=>boolean;

    private createFilter(morning: any, evening: any): (section: Section)=>boolean {
        let f1: Function;
        let f2: Function;
        if (morning == 0 || morning == "MORNING OK")
            f1 = (sec) => true;
        else {
            const morningTime = moment(morning.slice(1), "hh a");
            f1 = (sec: Section) => sec.meetings.range.from > morningTime;
        }
        if (evening == 7 || evening == "EVENING OK")
            f2 = (sec) => true;
        else {
            const eveningTime = moment(evening.slice(1), "hh a");
            f2 = (sec: Section) => sec.meetings.range.to < eveningTime;
        }
        return (section: Section) => f1(section) && f2 (section);
    }

}
