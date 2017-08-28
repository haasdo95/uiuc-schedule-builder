import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { Trie } from './trie'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Class } from './class-section'

@Injectable()
export class CourseInfoService {

    constructor(private http: Http) { }

    private courseNames: Trie = null;

    getCourseList(): Observable<Trie> {
        // return new Trie(pseudo_course_list);
        if (!this.courseNames) {
            return this.http.get('api/courselist')
                            .map(res => res.json().list as string[])
                            .map(courseNames => this.courseNames = new Trie(courseNames))
        } else {
            return Observable.of(this.courseNames);
        }
        
    }

    getCoursesInfoByName(names: string[]): Observable<Class[]> {
        return this.http.post('api/courses', {courseNames: names})
                 .map(res => {
                        return res.json().courses
                    }
                )
    }
}
