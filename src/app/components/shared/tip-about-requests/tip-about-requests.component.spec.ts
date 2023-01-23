import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipAboutRequestsComponent } from './tip-about-requests.component';

describe('TipAboutRequestsComponent', () => {
  let component: TipAboutRequestsComponent;
  let fixture: ComponentFixture<TipAboutRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipAboutRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipAboutRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
