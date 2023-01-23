import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherBankDiputeRequest } from './other-bank-dispute-request.component';

describe('OtherBankDiputeRequest', () => {
  let component: OtherBankDiputeRequest;
  let fixture: ComponentFixture<OtherBankDiputeRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherBankDiputeRequest ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherBankDiputeRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
