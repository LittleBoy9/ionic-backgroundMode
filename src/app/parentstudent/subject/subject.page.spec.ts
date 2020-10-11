import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectPage } from './subject.page';

describe('SubjectPage', () => {
  let component: SubjectPage;
  let fixture: ComponentFixture<SubjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
