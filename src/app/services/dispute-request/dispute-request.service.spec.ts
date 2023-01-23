import { TestBed } from '@angular/core/testing';

import { DisputeRequestService } from './dispute-request.service';

describe('DisputeRequestService', () => {
  let service: DisputeRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisputeRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
