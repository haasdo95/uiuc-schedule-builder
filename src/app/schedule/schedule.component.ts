import { Component, OnInit, Input } from '@angular/core';
import { Section } from '../class-section'

/**
 * this component is only responsible for displaying the sections scheduled 
 * by the scheduling toolkit (stk) in AppComponent
 */

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

    @Input() sections: Section[];

    @Input() events: any[];

    options: any = {
        columnFormat: 'ddd',
    }

    constructor() { }

    ngOnInit() {
        
    }

}
