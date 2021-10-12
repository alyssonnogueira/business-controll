import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResponsavelComponent } from './responsavel.component';

describe('ResponsavelComponent', () => {
  let component: ResponsavelComponent;
  let fixture: ComponentFixture<ResponsavelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsavelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
