import { TestBed } from '@angular/core/testing';

import { CategoryClassService } from './category-class.service';

describe('ClassService', () => {
  let service: CategoryClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
