import { TestBed } from '@angular/core/testing';

import { EjService } from './ej-service';

describe('EjServiceService', () => {
  let service: EjService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EjService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
