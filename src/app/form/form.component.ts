import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms'
import { CourseInfoService } from '../course-info.service'
import { Class } from '../class-section'
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [CourseInfoService]
})
export class FormComponent implements OnInit, OnDestroy {

    @Output() courses: EventEmitter<Class[]> = new EventEmitter();

    /**
     * The input array where users input their courses
     */
    classesFormArray = new FormArray([
        new FormControl(),
        new FormControl(),
        new FormControl()
    ])

    formModel: FormGroup = new FormGroup({
        classes: this.classesFormArray
    })

    /**
     * A trivial method to remove or add input boxes
     */
    oneMoreLess(val: number) {
        this.reinitSubscriptions();
        if (val == -1) {
            this.classesFormArray.push(new FormControl());
        } else {
            this.classesFormArray.removeAt(val);
        }
        this.handleAutocomplete();
    }

    /**
     * This method gets called when the "GENERATE" button is hit.
     * 
     * TODO: Data sanitizing should also happen here.
     */
    generate() {
        var courses: string[] = [];
        for (const ctrl of this.classesFormArray.controls) {
            if (ctrl.value) {
                courses.push(ctrl.value);
            }
        }
        this.emitCourses(courses);
    }

    /**
     * The method used to emit courses to AppComponent
     * @param courses 
     */
    emitCourses(courses: string[]) {
        this.cis.getCoursesInfoByNameMock(courses).then(classes => {
            this.courses.emit(classes);
        })
    }

    subscriptions: Subscription[] = [];

    reinitSubscriptions() {
        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }
        this.subscriptions = [];
    }

    /**
     * A method to handle autocomplete
     */
    handleAutocomplete() {
        for (const ctrl of this.classesFormArray.controls) {
            const fc = ctrl as FormControl;
            this.subscriptions.push(
                fc.valueChanges
                    .map(txt => txt.toUpperCase())
                    .subscribe((prefix) => {
                        console.log(this.cis.getCourseListMock()
                                            .filter((course) => course.startsWith(prefix)));
                    }
                )
            );
        }
    }

    constructor(private cis: CourseInfoService) { }

    ngOnInit() {
        this.handleAutocomplete();
    }

    ngOnDestroy() {
        this.reinitSubscriptions();
    }

}
