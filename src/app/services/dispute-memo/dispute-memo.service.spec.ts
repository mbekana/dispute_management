import { TestBed } from '@angular/core/testing';

import { DisputeMemoService } from './dispute-memo.service';

describe('DisputeMemoService', () => {
  let service: DisputeMemoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisputeMemoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
