import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { Trie } from './trie'

import { Class } from './class-section'

import { pseudo_db, pseudo_course_list } from './pseudo-db'

@Injectable()
export class CourseInfoService {

    constructor(private http: Http) { }

    getCourseList(): Trie {
        return new Trie(pseudo_course_list);
    }

    getCoursesInfoByName(names: string[]) {
        this.http.get('api/courses')
                 .map(res => res.json().courses)
    }
}
