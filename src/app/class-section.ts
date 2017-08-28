import * as moment from 'moment';
import { Moment } from 'moment';

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

    range: Range;

    constructor(args) {
        this.date = args.date;
        this.time = args.time;
        this.range = this.getMeetingTime();
    }

    // method used to decode the date string (10:00 AM) stored in string format
    private getMeetingTime(): Range { // preproc
        return {
            from: moment(this.time.from, 'hh:mm A'),
            to: moment(this.time.to, 'hh:mm A')
        } as Range;
    }
}

export class Section {
    courseName: string;
    section: string;
    crn: string;
    type: string;
    meetings: Meeting;
}

export class Class {
    name: string;
    sections: Section[];
}
