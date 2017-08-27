import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { Trie } from './trie'
import { Observable } from 'rxjs/Observable';

import { Class } from './class-section'

import { pseudo_db, pseudo_course_list } from './pseudo-db'

@Injectable()
export class CourseInfoService {

    constructor(private http: Http) { }

    getCourseList(): Trie {
        return new Trie(pseudo_course_list);
    }

    getCoursesInfoByName(names: string[]): Observable<Class[]> {
        return this.http.post('api/courses', {courseNames: names})
                 .map(res => {
                        return res.json().courses
                    }
                )
    }
}
