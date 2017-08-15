import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms'
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

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
        console.log("GENERATING");
    }

    constructor() { }

    ngOnInit() {
    }

}
