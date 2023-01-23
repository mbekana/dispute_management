import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveDocumentComponent } from './archive-document.component';

describe('ArchiveDucomentComponent', () => {
  let component: ArchiveDocumentComponent;
  let fixture: ComponentFixture<ArchiveDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
