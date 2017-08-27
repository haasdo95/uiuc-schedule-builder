import { TestBed, inject } from '@angular/core/testing';

import { SchedulingToolkitService } from './scheduling-toolkit.service';

import { Range, Class, Section, Meeting } from './class-section'
import * as moment from 'moment';
import { Moment } from 'moment'
import * as _ from "lodash";

fdescribe('range overlap should work', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchedulingToolkitService]
    });
  });

  it('should be created', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
    expect(service).toBeTruthy();
  }));

  it('range overlap should work 1', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
    expect(
        service.rangeOverlap(
            {
                from: moment('09:00 AM', 'hh:mm A'),
                to: moment('09:50 AM', 'hh:mm A')
            } as Range,
            {
                from: moment('09:30 AM', 'hh:mm A'),
                to: moment('09:40 AM', 'hh:mm A')
            } as Range
        )
    ).toBeTruthy();
  }));

  it('range overlap should work 2', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
    expect(
        service.rangeOverlap(
            {
                from: moment('09:00 AM', 'hh:mm A'),
                to: moment('09:50 AM', 'hh:mm A')
            } as Range,
            {
                from: moment('09:40 AM', 'hh:mm A'),
                to: moment('10:30 AM', 'hh:mm A')
            } as Range
        )
    ).toBeTruthy();
  }));

  it('range overlap should work 3', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
    expect(
        service.rangeOverlap(
            {
                from: moment('09:00 AM', 'hh:mm A'),
                to: moment('09:50 AM', 'hh:mm A')
            } as Range,
            {
                from: moment('08:30 AM', 'hh:mm A'),
                to: moment('09:30 AM', 'hh:mm A')
            } as Range
        )
    ).toBeTruthy();
  }));

  it('range overlap should work 4', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
    expect(
        service.rangeOverlap(
            {
                from: moment('09:00 AM', 'hh:mm A'),
                to: moment('09:50 AM', 'hh:mm A')
            } as Range,
            {
                from: moment('08:30 AM', 'hh:mm A'),
                to: moment('10:00 AM', 'hh:mm A')
            } as Range
        )
    ).toBeTruthy();
  }));

  it('range overlap should work 5', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
    expect(
        service.rangeOverlap(
            {
                from: moment('09:00 AM', 'hh:mm A'),
                to: moment('09:50 AM', 'hh:mm A')
            } as Range,
            {
                from: moment('09:00 AM', 'hh:mm A'),
                to: moment('09:50 AM', 'hh:mm A')
            } as Range
        )
    ).toBeTruthy();
  }));

  it('range overlap should work 6', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
    expect(
        service.rangeOverlap(
            {
                from: moment('09:00 AM', 'hh:mm A'),
                to: moment('09:50 AM', 'hh:mm A')
            } as Range,
            {
                from: moment('09:50 AM', 'hh:mm A'),
                to: moment('10:30 AM', 'hh:mm A')
            } as Range
        )
    ).toBeTruthy();
  }));

  it('range overlap should work 7', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
    expect(
        service.rangeOverlap(
            {
                from: moment('09:00 AM', 'hh:mm A'),
                to: moment('09:50 AM', 'hh:mm A')
            } as Range,
            {
                from: moment('10:00 AM', 'hh:mm A'),
                to: moment('10:30 AM', 'hh:mm A')
            } as Range
        )
    ).toBeFalsy();
  }));
});


import { pseudo_db } from './pseudo-db'

const cs125Secs = pseudo_db[0].sections;
const cs125al1 = cs125Secs[0];
const cs125aya = cs125Secs[1];
const cs173al1 = pseudo_db[2].sections[0];

fdescribe('meeting/section overlap should work', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SchedulingToolkitService]
        });
    });
  
    it('should be created', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        expect(service).toBeTruthy();
    }));

    it('meeting/section overlap should work 1', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        expect(
            service.sectionOverlap(cs125al1, cs125aya)
        ).toBeFalsy();
    }));

    it('meeting/section overlap should work 2', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        expect(
            service.sectionOverlap(cs173al1, cs125aya)
        ).toBeTruthy();
    }));

});


fdescribe('create big section generator should work', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SchedulingToolkitService]
        });
    });
  
    it('should be created', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        expect(service).toBeTruthy();
    }));

    it('create big section generator should work 1', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        const cs173SecA = service.groupClassSectionByBigSection(pseudo_db[2])[0];
        const cs173SecATyped = service.groupClassSectionBySectionType(cs173SecA);
        expect(Array.from(service.createBigSectionGenerator(cs173SecATyped)).length)
            .toBe(2);
    }));

    it('create big section generator should work 2', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        const cs173SecB = service.groupClassSectionByBigSection(pseudo_db[2])[1];
        const cs173SecBTyped = service.groupClassSectionBySectionType(cs173SecB);
        expect(Array.from(service.createBigSectionGenerator(cs173SecBTyped)).length)
            .toBe(1);
    }));

    it('create big section generator should work 3', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        const cs173SecA = service.groupClassSectionByBigSection(pseudo_db[2])[0];
        const cs173SecATyped = service.groupClassSectionBySectionType(cs173SecA);
        cs173SecATyped[0] = []; // prune all LEC sections
        expect(Array.from(service.createBigSectionGenerator(cs173SecATyped)).length)
            .toBe(0);
    }));

});


fdescribe('prune big section should work', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SchedulingToolkitService]
        });
    });

    it('prune big section should work 1', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        const cs173SecA = service.groupClassSectionByBigSection(pseudo_db[2])[0];
        const cs173SecATyped = service.groupClassSectionBySectionType(cs173SecA);
        const pruned = service.pruneBigSection(cs173SecATyped, [cs125aya]);
        expect(Array.from(service.createBigSectionGenerator(pruned)).length)
            .toBe(0)
    }));

    it('prune big section should work 2', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        const cs173SecA = service.groupClassSectionByBigSection(pseudo_db[2])[0];
        const cs173SecATyped = service.groupClassSectionBySectionType(cs173SecA);
        const pruned = service.pruneBigSection(cs173SecATyped, [cs125al1]);
        expect(Array.from(service.createBigSectionGenerator(pruned)).length)
            .toBe(2)
    }));
});


fdescribe('schedule sections should work', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SchedulingToolkitService]
        });
    });

    it('schedule sections should work 1', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        const cs225 = pseudo_db[1];
        const cs173 = pseudo_db[2];
        const cs225ASec = service.groupClassSectionByBigSection(cs225)[0];
        const cs225ASecTyped = service.groupClassSectionBySectionType(cs225ASec);
        const cs173ASec = service.groupClassSectionByBigSection(cs173)[0];
        const cs173ASecTyped = service.groupClassSectionBySectionType(cs173ASec);

        const fits = Array.from(service.scheduleCourses([cs225ASecTyped, cs173ASecTyped], 0, []));
        const crns = fits.map(
            secs => secs.map(
                sec => sec.crn
            )
        )
        expect(crns[0].sort()).toEqual(['35917', '35950', '30102', '63146'].sort());        
        expect(crns[1].sort()).toEqual(['35917', '35950', '30102', '51496'].sort());        
        
    }));

    it('schedule sections should work 2', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        const cs125 = pseudo_db[0];
        const cs173 = pseudo_db[2];
        const cs125ASec = service.groupClassSectionByBigSection(cs125)[0];
        const cs125ASecTyped = service.groupClassSectionBySectionType(cs125ASec);
        const cs173ASec = service.groupClassSectionByBigSection(cs173)[0];
        const cs173ASecTyped = service.groupClassSectionBySectionType(cs173ASec);

        const fits = Array.from(service.scheduleCourses([cs125ASecTyped, cs173ASecTyped], 0, []));
        expect(fits.length).toBe(0);
        
    }));

    it('schedule sections should work 3', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        const cs125 = pseudo_db[0];
        const cs173 = pseudo_db[2];
        const cs125ASec = service.groupClassSectionByBigSection(cs125)[0];
        const cs125ASecTyped = service.groupClassSectionBySectionType(cs125ASec);
        const cs173BSec = service.groupClassSectionByBigSection(cs173)[1];
        const cs173BSecTyped = service.groupClassSectionBySectionType(cs173BSec);

        const fits = Array.from(service.scheduleCourses([cs125ASecTyped, cs173BSecTyped], 0, []));
        expect(fits.length).toBe(1);
        
    }));

    it('schedule sections should work 4', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        const cs225 = pseudo_db[1];
        const cs173 = pseudo_db[2];
        const cs440 = pseudo_db[3];
        const cs225ASec = service.groupClassSectionByBigSection(cs225)[0];
        const cs225ASecTyped = service.groupClassSectionBySectionType(cs225ASec);
        const cs173ASec = service.groupClassSectionByBigSection(cs173)[0];
        const cs173ASecTyped = service.groupClassSectionBySectionType(cs173ASec);
        const cs440ASec = service.groupClassSectionByBigSection(cs440)[0];
        const cs440ASecTyped = service.groupClassSectionBySectionType(cs440ASec);

        const fits = Array.from(service.scheduleCourses([cs225ASecTyped, cs173ASecTyped, cs440ASecTyped], 0, []));
        const crns = fits.map(
            secs => secs.map(
                sec => sec.crn
            )
        )
        
        expect(crns.length).toBe(2);
        
    }));

});

fdescribe('create state machine should work', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SchedulingToolkitService]
        });
    });

    it('create state machine should work 1', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        const cs125 = pseudo_db[0];
        const cs173 = pseudo_db[2];

        const fits = Array.from(service.createStateMachine([cs125, cs173]));
        console.log(fits);
        expect(fits.length).toBe(1);
    }));

    it('create state machine should work 2', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
        const cs225 = pseudo_db[1];
        const cs173 = pseudo_db[2];

        const fits = Array.from(service.createStateMachine([cs225, cs173]));
        console.log(fits);
        expect(fits.length).toBe(3);
    }));

});