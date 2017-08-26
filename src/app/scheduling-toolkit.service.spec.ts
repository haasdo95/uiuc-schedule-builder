import { TestBed, inject } from '@angular/core/testing';

import { SchedulingToolkitService } from './scheduling-toolkit.service';

import { Range, Class, Section, Meeting } from './class-section'
import * as moment from 'moment';
import { Moment } from 'moment'

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