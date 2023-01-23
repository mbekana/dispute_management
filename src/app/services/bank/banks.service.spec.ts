import { TestBed } from '@angular/core/testing';

import { BanksService } from './banks.service';

describe('BanksService', () => {
  let service: BanksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BanksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
