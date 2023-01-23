import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeMemoComponent } from './dispute-memo.component';

describe('MiscellaneousComponent', () => {
  let component: DisputeMemoComponent;
  let fixture: ComponentFixture<DisputeMemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisputeMemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisputeMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
