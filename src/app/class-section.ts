const weekMap = {
    'M': 'Monday',
    'T': 'Tuesday',
    'W': 'Wednesday',
    'R': 'Thursday',
    'F': 'Friday'
}

import * as moment from 'moment';
import { Moment } from 'moment'

export interface Range {
    from: Moment;
    to: Moment;
}

export class Meeting {
    date: string;
    time: {
        from: string;
        to: string
    }

    ranges: Range[];

    constructor(args) {
        this.date = args.date;
        this.time = args.time;
        this.ranges = this.getMeetings();
    }

    // method used to decode the date data stored in string format
    private getMeetings(): Range[] { // preproc
        let ranges: Range[] = [];
        for (const d of this.date) {
            const day = weekMap[d];
            const dateStr_1 = day + ' ' + this.time.from
            const dateStr_2 = day + ' ' + this.time.to
            ranges.push({
                from: moment(dateStr_1, 'dddd hh:mm a'),
                to: moment(dateStr_2, 'dddd hh:mm a')
            } as Range)
        }
        return ranges;
    }
}

export class Section {
    section: string;
    crn: string;
    type: string;
    meetings: Meeting;
}

export class Class {
    name: string;
    sections: Section[];
}
