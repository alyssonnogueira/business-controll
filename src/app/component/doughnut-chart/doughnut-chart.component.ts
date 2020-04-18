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

  get total() {
    const valor = this.dados[0] as number[];
    return this.dados[0].length > 0 ? valor.reduce((acc, atual) => acc + atual, 0) : 0;
  }

}
