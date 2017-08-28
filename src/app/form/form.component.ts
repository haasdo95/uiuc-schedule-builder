import { Component, OnInit, OnDestroy, EventEmitter, Output, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms'
import { CourseInfoService } from '../course-info.service'
import { Class } from '../class-section'
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: []
})
export class FormComponent implements OnInit, OnDestroy {

    @Output() courses: EventEmitter<string[]> = new EventEmitter();

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
    oneMoreLess(idx: number) {
        this.reinitSubscriptions();
        if (idx == -1) {
            this.classesFormArray.push(new FormControl());
        } else {
            this.classesFormArray.removeAt(idx);
        }
        this.handleAutocomplete();
    }

    /**
     * A method to insert an input box
     * @param idx 
     */
    insertCourse(idx: number) {
        this.reinitSubscriptions();
        this.classesFormArray.insert(idx+1, new FormControl());
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
        this.courses.emit(courses);
    }

    /**
     * Subscriptions used to listen on the input boxes
     * Unsubscribed when the user makes changes to prevent mem leak
     */
    subscriptions: Subscription[] = [];

    /**
     * The structure used to contain auto-completion hints
     */
    hints: string[][] = [[], [], []];

    /**
     * Method to unsubscribe all.
     */
    private reinitSubscriptions() {
        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }
        this.subscriptions = [];
    }

    /**
     * A method to handle autocomplete by subcribing to all.
     * TODO: implement the whole thing
     */
    private handleAutocomplete() {
        for (let index = 0; index < this.classesFormArray.controls.length; ++index) {
            const fc = this.classesFormArray.controls[index] as FormControl;
            this.subscriptions.push(
                fc.valueChanges
                    .debounceTime(300)
                    .map(txt => txt.toUpperCase() as string)
                    .map(txt => {
                            const match = txt.match(/([A-Z]+)([0-9]+)/);
                            if (!match) return txt;
                            return match.slice(1).join(" ");
                        }
                    )
                    .subscribe((prefix) => {
                        this.showHints(prefix, index);
                    }
                )
            );
        }
    }

    /**
     * Method used to fill the corresponding entry 
     * in this.hints with the help of cis service
     * @param prefix 
     * @param idx 
     */
    showHints(prefix: string, idx: number) {
        if (!prefix) {
            this.hints[idx] = [];
        } else {
            this.cis.getCourseList()
                .subscribe(t => {
                    this.hints[idx] = t.getWordsWithPrefix(prefix.toUpperCase());
                })
        }
    }

    /**
     * Method used to hide hints by flushing 
     * the corresponding entry in this.hints
     * @param event 
     * @param idx 
     */
    hideHints(event, idx: number) {
        if (!event) {
            this.hints[idx] = [];
            return;
        }
        // edge case to prevent hitting hint button from flushing the hints
        const t = (event.relatedTarget as HTMLElement);
        if (t && t.classList.contains('dontBlur')) {
            return;
        }
        this.hints[idx] = [];
    }

    /**
     * Method used to handle keyDown.enter and keyDown.tab event
     * by filling the input box with the first value in hints
     * @param fc 
     * @param idx 
     * @param event 
     */
    fillWithFirst(fc: FormControl, idx: number, event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (!this.hints[idx] || !this.hints[idx].length) {
            return;
        }
        fc.setValue(this.hints[idx][0]);
    }

    constructor(private cis: CourseInfoService) { }

    ngOnInit() {
        this.handleAutocomplete();
    }

    ngOnDestroy() {
        this.reinitSubscriptions();
    }

}
