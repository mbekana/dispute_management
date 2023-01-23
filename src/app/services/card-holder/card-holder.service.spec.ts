import { TestBed } from '@angular/core/testing';

import { CardHolderService } from './card-holder.service';

describe('CardHolderService', () => {
  let service: CardHolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardHolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
