import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeAndDisputeIdComponent } from './add-fe-and-dispute.component';

describe('AddFeAndDispute', () => {
  let component: AddFeAndDisputeIdComponent;
  let fixture: ComponentFixture<AddFeAndDisputeIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFeAndDisputeIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeAndDisputeIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
