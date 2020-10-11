import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableDetailPage } from './timetable-detail.page';

describe('TimetableDetailPage', () => {
  let component: TimetableDetailPage;
  let fixture: ComponentFixture<TimetableDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimetableDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
