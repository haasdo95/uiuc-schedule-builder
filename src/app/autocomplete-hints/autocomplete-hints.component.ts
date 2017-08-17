import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-autocomplete-hints',
  templateUrl: './autocomplete-hints.component.html',
  styleUrls: ['./autocomplete-hints.component.css']
})
export class AutocompleteHintsComponent implements OnInit {
    
    @Input() index: number;
    @Input() hints: string[];
    @Input() ctrl: FormControl;
    @Output() chosen: EventEmitter<number> = new EventEmitter();

    fillOut(hint: string) {
        this.ctrl.setValue(hint);
        this.chosen.emit(this.index);
    }

    constructor() { }

    ngOnInit() {
    }

}
