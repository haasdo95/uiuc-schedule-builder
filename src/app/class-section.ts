export class Meeting {
    date: string;
    time: {
        from: string;
        to: string
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
