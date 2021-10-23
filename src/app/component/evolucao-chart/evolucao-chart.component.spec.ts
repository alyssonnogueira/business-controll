import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EvolucaoChartComponent } from './evolucao-chart.component';

describe('EvolucaoChartComponent', () => {
  let component: EvolucaoChartComponent;
  let fixture: ComponentFixture<EvolucaoChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvolucaoChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolucaoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
