import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRequestDetailsComponent } from './shared-request-details.component';

describe('SharedRequestDetailsComponent', () => {
  let component: SharedRequestDetailsComponent;
  let fixture: ComponentFixture<SharedRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedRequestDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
