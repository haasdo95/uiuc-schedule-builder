import { Component } from '@angular/core';
import { CourseInfoService } from './course-info.service'

import { Class } from './class-section'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ CourseInfoService ]
})
export class AppComponent {

    constructor(private cis: CourseInfoService) {}

    /**
     * to keep the previous classes to "remember the state" 
     */
    prevCourses: string[] = [];
    fetchedCourses: Promise<Class[]> = Promise.resolve([]);
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
        if (this.isChanged(this.prevCourses, courses)) { // the user changed sth
            this.prevCourses = courses;
            console.log("NEW STUFF!");
            // will probably need to fetch class info from server
            this.fetchedCourses = this.cis.getCoursesInfoByNameMock(courses);
        } else {
            console.log("NO NEW STUFF!");
            // could keep using the old fetchedCourses
        }
    }
}
