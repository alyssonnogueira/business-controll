import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SorteioComponent } from './sorteio.component';

describe('SorteioComponent', () => {
  let component: SorteioComponent;
  let fixture: ComponentFixture<SorteioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SorteioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SorteioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
