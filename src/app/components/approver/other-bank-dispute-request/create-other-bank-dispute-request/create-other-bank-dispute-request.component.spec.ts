import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOtherBankDisputeRequest } from './create-other-bank-dispute-request.component';

describe('CreateOtherBankDisputeRequest', () => {
  let component: CreateOtherBankDisputeRequest;
  let fixture: ComponentFixture<CreateOtherBankDisputeRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOtherBankDisputeRequest ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOtherBankDisputeRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
