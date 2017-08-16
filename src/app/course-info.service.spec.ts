import { TestBed, inject } from '@angular/core/testing';

import { CourseInfoService } from './course-info.service';

describe('CourseInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseInfoService]
    });
  });

  it('should be created', inject([CourseInfoService], (service: CourseInfoService) => {
    expect(service).toBeTruthy();
  }));
});
