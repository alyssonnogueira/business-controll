import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LancamentoModalComponent } from './lancamento-modal.component';

describe('LancamentoModalComponent', () => {
  let component: LancamentoModalComponent;
  let fixture: ComponentFixture<LancamentoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LancamentoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LancamentoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
