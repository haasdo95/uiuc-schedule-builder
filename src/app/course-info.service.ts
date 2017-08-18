import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { Trie } from './trie'

import 'rxjs/add/operator/toPromise';

import { Class } from './class-section'

import { pseudo_db, pseudo_course_list } from './pseudo-db'

@Injectable()
export class CourseInfoService {

    constructor(private http: Http) { }

    getCourseListMock(): Trie {
        return new Trie(pseudo_course_list);
    }

    getCoursesInfoByNameMock(names: string[]): Promise<Class[]> {
        return Promise.resolve(
            pseudo_db.filter(
                (c) => names.indexOf(c.name) > -1
            )
        )
    }
}
