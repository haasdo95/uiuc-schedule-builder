import { TestBed, inject } from '@angular/core/testing';

import { SchedulingToolkitService } from './scheduling-toolkit.service';

describe('SchedulingToolkitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchedulingToolkitService]
    });
  });

  it('should be created', inject([SchedulingToolkitService], (service: SchedulingToolkitService) => {
    expect(service).toBeTruthy();
  }));
});
