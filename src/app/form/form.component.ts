import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms'
import { CourseInfoService } from '../course-info.service'
import { Class } from '../class-section'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [CourseInfoService]
})
export class FormComponent implements OnInit {

    @Output() courses: EventEmitter<Class[]> = new EventEmitter();

    classesFormArray = new FormArray([
        new FormControl(),
        new FormControl(),
        new FormControl()
    ])

    formModel: FormGroup = new FormGroup({
        classes: this.classesFormArray
    })

    oneMoreLess(val: number) {
        if (val == -1) {
            this.classesFormArray.push(new FormControl());
        } else {
            this.classesFormArray.removeAt(val);
        }
        
    }

    generate() {
        // Data sanitizing could also happen here.
        var courses: string[] = [];
        for (const ctrl of this.classesFormArray.controls) {
            if (ctrl.value) {
                courses.push(ctrl.value);
            }
        }
        this.handleCourses(courses);
    }

    handleCourses(courses: string[]) {
        this.cis.getCoursesInfoByNameMock(courses).then(classes => {
            this.courses.emit(classes);
        })
    }

    constructor(private cis: CourseInfoService) { }

    ngOnInit() {
    }

}
