import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { Trie } from './trie'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';

import * as _ from "lodash";

import { Class } from './class-section'

@Injectable()
export class CourseInfoService {

    constructor(private http: Http) { }

    /**
     * the Trie data structure to optimize auto-completion
     */
    private courseNames: Trie = null;

    /**
     * ask the server for the whole list of course names and form a Trie
     * and, to prevent further server query, cache it.
     * 
     */
    getCourseList(): Promise<Trie> {
        if (!this.courseNames) {
            return this.http.get('api/courselist')
                            .map(res => res.json().list as string[])
                            .map(courseNames => this.courseNames = new Trie(courseNames))
                            .toPromise()
        } else {
            return Promise.resolve(this.courseNames);
        }
        
    }

    /**
     * given an array of course names, ask the server for the course info
     * @param names an array of course names
     */
    getCoursesInfoByName(names: string[]): Observable<Class[]> {
        return this.http.post('api/courses', {courseNames: names})
                 .map(res => {
                        const courses = <Class[]>res.json().courses;
                        courses.forEach(course => {
                            course.sections = _.shuffle(course.sections);
                        })
                        return courses;
                    }
                )
    }
}
