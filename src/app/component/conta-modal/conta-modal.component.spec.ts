import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContaModalComponent } from './conta-modal.component';

describe('ContaModalComponent', () => {
  let component: ContaModalComponent;
  let fixture: ComponentFixture<ContaModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
