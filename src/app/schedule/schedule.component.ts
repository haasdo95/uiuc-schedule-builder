import { Component, OnInit, Input } from '@angular/core';
import { Section } from '../class-section'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

    @Input() sections: Section[];

    events = [];

    options: any = {
        columnFormat: 'ddd'
    }

    constructor() { }

    ngOnInit() {
        
    }

}
