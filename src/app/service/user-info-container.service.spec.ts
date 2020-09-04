import { TestBed } from '@angular/core/testing';

import { UserInfoContainerService } from './user-info-container.service';

describe('UserInfoContainerService', () => {
  let service: UserInfoContainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInfoContainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
