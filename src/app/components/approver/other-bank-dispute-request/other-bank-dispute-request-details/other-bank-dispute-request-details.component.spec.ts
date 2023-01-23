import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectRequestDetailsComponent } from './other-bank-dispute-request-details.component';

describe('DirecRequestDetailsComponent', () => {
  let component: DirectRequestDetailsComponent;
  let fixture: ComponentFixture<DirectRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
