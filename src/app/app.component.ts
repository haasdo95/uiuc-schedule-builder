import { Component } from '@angular/core';
import { Class } from './class-section'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent {

    prevCourses: Class[] = [];

    private isChanged(prev: Class[], curr: Class[]): boolean {
        if (prev.length != curr.length) return true;
        for (let i = 0; i < prev.length; i++) {
            if (prev[i].name != curr[i].name) {
                return true;
            }
        }
        return false;
    } 

    resetCourses(courses: Class[]) {
        console.log(courses);
        if (this.isChanged(this.prevCourses, courses)) {
            this.prevCourses = courses;
            console.log("NEW STUFF!");

        } else {
            console.log("NO NEW STUFF!");
            
        }
    }
}
