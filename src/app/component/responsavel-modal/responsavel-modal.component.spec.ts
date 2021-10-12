import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResponsavelModalComponent } from './responsavel-modal.component';

describe('ResponsavelModalComponent', () => {
  let component: ResponsavelModalComponent;
  let fixture: ComponentFixture<ResponsavelModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsavelModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsavelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
