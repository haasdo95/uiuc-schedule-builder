import { Component, OnInit, OnDestroy, EventEmitter, Output, ElementRef } from '@angular/core';
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
    hints: string[][] = [[], [], []];

    reinitSubscriptions() {
        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }
        this.subscriptions = [];
    }

    showHints(prefix: string, idx: number) {
        if (!prefix) {
            this.hints[idx] = [];
        } else {
            this.hints[idx] = this.cis.getCourseListMock()
                                .getWordsWithPrefix(prefix.toUpperCase());
        }
    }

    hideHints(event, idx: number) {
        if (!event) {
            this.hints[idx] = [];
            return;
        }
        const t = (event.relatedTarget as HTMLElement);
        if (t && t.classList.contains('dontBlur')) {
            return;
        }
        this.hints[idx] = [];
    }

    fillWithFirst(fc: FormControl, idx: number, event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (!this.hints[idx] || !this.hints[idx].length) {
            return;
        }
        fc.setValue(this.hints[idx][0]);
    }

    /**
     * A method to handle autocomplete
     * TODO: implement the whole thing
     */
    handleAutocomplete() {
        for (let index = 0; index < this.classesFormArray.controls.length; ++index) {
            const fc = this.classesFormArray.controls[index] as FormControl;
            this.subscriptions.push(
                fc.valueChanges
                    .map(txt => txt.toUpperCase())
                    .subscribe((prefix) => {
                        this.showHints(prefix, index);
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
