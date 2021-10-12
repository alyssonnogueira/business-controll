import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContaComponent } from './conta.component';

describe('ContaComponent', () => {
  let component: ContaComponent;
  let fixture: ComponentFixture<ContaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
