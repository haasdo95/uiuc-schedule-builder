import { Injectable } from '@angular/core';
import { Http } from '@angular/http'

import 'rxjs/add/operator/toPromise';

import * as moment from 'moment';
import { Class } from './class-section'

import { pseudo_db, pseudo_course_list } from './pseudo-db'

const currYear = 2017;
const currTerm = 'fall';

@Injectable()
export class CourseInfoService {

    constructor(private http: Http) { }

    getCourseListMock() {
        return pseudo_course_list;
    }

    getCoursesInfoByNameMock(names: string[]): Promise<Class[]> {
        return Promise.resolve(
            pseudo_db.filter(
                (c) => names.indexOf(c.name) > -1
            )
        )
    }
}
