import { Component, OnInit, Input } from '@angular/core';
import { MultiDataSet, Label } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})
export class DoughnutChartComponent implements OnInit {

  @Input() labels: Label[] = [];
  @Input() dados: MultiDataSet = [];
  doughnutChartType: ChartType = 'doughnut';
  options = {
    legend: {
      display: false
    }
  };

  constructor() { }

  ngOnInit() {
  }

}
