import { Class } from './class-section'

export const pseudo_course_list: string[] = [
    'CS 125', 'CS 225', 'CS 173',
    'CSE 125', 'CSE 173',
    'THEA 173',
    'PHYS 211', 'PHYS 225'
]

export const pseudo_db: Class[] = [
    // course
    {
        name: 'CS 125',
        sections: [
            // section
            {
                section: 'AL1',
                crn: '35876',
                type: 'LEC',
                meetings: {
                    date: 'MWF',
                    time: {
                        from : '08:00 am',
                        to: '08:50 am'
                    }
                }
            }, 
            // section
            {
                section: 'AYA',
                crn: '35881',
                type: 'LBD',
                meetings: {
                    date: 'T',
                    time: {
                        from : '09:00 am',
                        to: '10:50 am'
                    }
                }
            },
        ]
    } as Class, 
    // course
    {
        name: 'CS 225',
        sections: [
            // section
            {
                section: 'AL1',
                crn: '35917',
                type: 'LEC',
                meetings: {
                    date: 'MWF',
                    time: {
                        from : '11:00 am',
                        to: '11:50 am'
                    }
                }
            }, 
            // section
            {
                section: 'AYE',
                crn: '35950',
                type: 'LBD',
                meetings: {
                    date: 'R',
                    time: {
                        from : '01:00 pm',
                        to: '02:50 pm'
                    }
                }
            },
        ]
    } as Class, 
    // course
    {
        name: 'CS 173',
        sections: [
            // section
            {
                section: 'AL1',
                crn: '30102',
                type: 'LEC',
                meetings: {
                    date: 'TR',
                    time: {
                        from : '9:30 am',
                        to: '10:45 am'
                    }
                }
            }, 
            // section
            {
                section: 'ADJ',
                crn: '63146',
                type: 'DIS',
                meetings: {
                    date: 'F',
                    time: {
                        from : '2:00 pm',
                        to: '2:50 pm'
                    }
                }
            }, 
            // section
            {
                section: 'BL2',
                crn: '40083',
                type: 'LEC',
                meetings: {
                    date: 'TR',
                    time: {
                        from : '11:00 am',
                        to: '12:15 pm'
                    }
                }
            }, 
            // section
            {
                section: 'BDF',
                crn: '60279',
                type: 'DIS',
                meetings: {
                    date: 'F',
                    time: {
                        from : '04:00 pm',
                        to: '04:50 pm'
                    }
                }
            },
        ]
    } as Class, 
]
