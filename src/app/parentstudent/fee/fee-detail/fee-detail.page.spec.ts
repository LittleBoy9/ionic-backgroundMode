import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDetailPage } from './fee-detail.page';

describe('FeeDetailPage', () => {
  let component: FeeDetailPage;
  let fixture: ComponentFixture<FeeDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
