import { TestBed } from '@angular/core/testing';

import { OtherBankDisputeService } from './other-bank-dispute.service';

describe('OtherBankDisputeService', () => {
  let service: OtherBankDisputeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherBankDisputeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
