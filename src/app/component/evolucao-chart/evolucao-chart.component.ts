import {Component, OnInit} from '@angular/core';
import {Label} from "ng2-charts";
import {ChartDataSets, ChartType} from "chart.js";
import {MesesEnum} from "../../model/meses.enum";
import {Conta} from "../../model/conta";
import {Transacao} from "../../model/transacao";
import {ContaService} from "../../services/conta.service";
import {TransacaoService} from "../../services/transacao.service";
import {TipoContaEnum} from "../../model/tipo-conta.enum";

@Component({
  selector: 'app-evolucao-chart',
  templateUrl: './evolucao-chart.component.html',
  styleUrls: ['./evolucao-chart.component.css']
})
export class EvolucaoChartComponent implements OnInit {

  keys = Object.keys;

  labels: Label[] = this.keys(MesesEnum).map(mes => MesesEnum[mes]).slice(0, 12);
  dados: ChartDataSets[] = [];

  lineChartType: ChartType = 'line';
  options = {
    responsive: true,
    legend: {
      display: true
    }
  };

  isLoading = true;

  constructor(private contaService: ContaService, private transacaoService: TransacaoService) {
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
    const anoAtual = new Date().getFullYear();
    const totalEmMeses = [];
    for (const mes of this.keys(MesesEnum).slice(0, 12)) {
      const mesEmNumero = parseInt(mes, 10);
      const dataInicial = new Date((mesEmNumero + 1) + '/01/' + anoAtual);
      const dataFinal = new Date((mesEmNumero + 2) + '/01/' + anoAtual);
      totalEmMeses[mes] = conta.dataCriacao >= dataInicial && conta.dataCriacao < dataFinal ? conta.saldoOriginal : 0;
      const totalDespesas = await this.transacaoService.obterTodasDespesas(null, [conta], dataInicial, dataFinal)
        .then(despesas => this.somarValorDasTransacaoes(despesas));
      const totalReceitas = await this.transacaoService.obterTodasReceitas(null, [conta], dataInicial, dataFinal)
        .then(receitas => this.somarValorDasTransacaoes(receitas));
      const totalTransferenciasRecebidas = await this.transacaoService.obterTodasTransferencias(null, null, dataInicial, dataFinal, conta)
        .then(transferencias => this.somarValorDasTransacaoes(transferencias));
      const totalTransferenciasRealizadas = await this.transacaoService.obterTodasTransferencias(null, [conta], dataInicial, dataFinal)
        .then(transferencias => this.somarValorDasTransacaoes(transferencias));
      const saldoMesAnterior = mesEmNumero > 0 ? totalEmMeses[mesEmNumero - 1] :
        (await this.saldoAnoAnterior(conta, anoAtual));

      totalEmMeses[mes] += saldoMesAnterior + totalReceitas + totalTransferenciasRecebidas
        - totalDespesas - totalTransferenciasRealizadas;
    }
    const charDataSet = {
      data: totalEmMeses, label: `${conta.nome}:${conta.responsavel.nome}`
    };
    this.dados.push(charDataSet);
  }

  somarValorDasTransacaoes(transacoes: Transacao[]): number {
    return transacoes.map(transacao => transacao.valor)
      .reduce((acumulador, valorCorrente) => acumulador + valorCorrente, 0);
  }

  async saldoAnoAnterior(conta: Conta, ano: number): Promise<number> {
    const dataFinal = new Date('01/01' + ano);
    const saldoInicial = conta.dataCriacao < dataFinal ? conta.saldoOriginal : 0;
    const totalDespesas = await this.transacaoService.obterTodasDespesas(null, [conta])
      .then(despesas => this.somarValorDasTransacaoes(despesas.filter(despesa => despesa.data < dataFinal)));
    const totalReceitas = await this.transacaoService.obterTodasReceitas(null, [conta])
      .then(receitas => this.somarValorDasTransacaoes(receitas.filter(receita => receita.data < dataFinal)));
    const totalTransferenciasRecebidas = await this.transacaoService.obterTodasTransferencias(null, [conta])
      .then(transferencias => this.somarValorDasTransacaoes(transferencias.filter(transferencia => transferencia.data < dataFinal)));
    const totalTransferenciasRealizadas = await this.transacaoService.obterTodasTransferencias(null, null, null, null, conta)
      .then(transferencias => this.somarValorDasTransacaoes(transferencias.filter(transferencia => transferencia.data < dataFinal)));
    return saldoInicial + totalReceitas + totalTransferenciasRecebidas - totalDespesas - totalTransferenciasRealizadas;
  }

}
