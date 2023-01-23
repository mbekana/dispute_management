import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedRequestsComponent } from './assigned-requests.component';

describe('AssignedRequestsComponent', () => {
  let component: AssignedRequestsComponent;
  let fixture: ComponentFixture<AssignedRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
