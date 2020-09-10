import {Component, OnInit} from '@angular/core';
import {Label} from "ng2-charts";
import {ChartDataSets, ChartType} from "chart.js";
import {MesesEnum} from "../../model/meses.enum";
import {Conta} from "../../model/conta";
import {ContaService} from "../../services/conta.service";
import {TransacaoService} from "../../services/transacao.service";
import {TipoContaEnum} from "../../model/tipo-conta.enum";
import {BalancoService} from "../../services/balanco.service";

@Component({
  selector: 'app-evolucao-chart',
  templateUrl: './evolucao-chart.component.html',
  styleUrls: ['./evolucao-chart.component.css']
})
export class EvolucaoChartComponent implements OnInit {

  keys = Object.keys;

  labels: Label[] = this.keys(MesesEnum).map(mes => MesesEnum[mes]).slice(0, new Date().getMonth() + 1);
  dados: ChartDataSets[] = [];

  lineChartType: ChartType = 'line';
  options = {
    responsive: true,
    legend: {
      display: true
    }
  };

  isLoading = true;

  constructor(private contaService: ContaService, private transacaoService: TransacaoService, private balancoService: BalancoService) {
  }

  ngOnInit() {
    this.inicializarDados();
  }

  async inicializarDados() {
    const contas = await this.contaService.obterTodasContas();
    this.isLoading = true;
    const promises = contas.filter(conta => conta.tipoConta == TipoContaEnum.DEBITO).map(conta => {
      return this.carregarDetalhesDaConta(conta);
    });
    await Promise.all(promises);
    this.isLoading = false
  }

  async carregarDetalhesDaConta(conta: Conta) {
    const totalEmMeses = await this.balancoService.calcularBalancoDe12Meses(conta, new Date());
    const charDataSet = {
      data: totalEmMeses, label: `${conta.nome}:${conta.responsavel.nome}`
    };
    this.dados.push(charDataSet);
  }
}
