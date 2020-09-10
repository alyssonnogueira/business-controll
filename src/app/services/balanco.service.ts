import { Injectable } from '@angular/core';
import {Conta} from "../model/conta";
import {MesesEnum} from "../model/meses.enum";
import {Transacao} from "../model/transacao";
import {TransacaoService} from "./transacao.service";
import {ContaService} from "./conta.service";
import {Balanco} from "../model/balanco";

@Injectable({
  providedIn: 'root'
})
export class BalancoService {

  keys = Object.keys;

  constructor(private contaService: ContaService, private transacaoService: TransacaoService) { }

  async calcularBalancoDe12Meses(conta: Conta, ano: Date): Promise<number[]> {
    const anoAtual = ano.getFullYear();
    const totalEmMeses = [];
    for (const mes of this.keys(MesesEnum).slice(0, 12)) {
      const mesEmNumero = parseInt(mes, 10);
      const dataInicial = new Date((mesEmNumero + 1) + '/01/' + anoAtual);
      const dataFinal = new Date((mesEmNumero + 2) + '/01/' + anoAtual);
      totalEmMeses[mes] = conta.dataCriacao >= dataInicial && conta.dataCriacao < dataFinal ? conta.saldoOriginal : 0;
      const balancoDoMes = await this.calcularBalanco(conta, dataInicial, dataFinal);
      const saldoMesAnterior = mesEmNumero > 0 ? totalEmMeses[mesEmNumero - 1] :
        (await this.calcularBalancoAnoAnterior(conta, anoAtual));

      totalEmMeses[mes] += saldoMesAnterior + balancoDoMes.calcularValorTotal();
    }

    return totalEmMeses;
  }

  async calcularBalancoAnoAnterior(conta: Conta, ano: number): Promise<number> {
    const dataFinal = new Date('01/01/' + ano);
    const saldoInicial = conta.dataCriacao < dataFinal ? conta.saldoOriginal : 0;
    const balancoTotal = await this.calcularBalanco(conta, null, dataFinal);
    return saldoInicial + balancoTotal.calcularValorTotal();
  }

  private async calcularBalanco(conta: Conta, dataInicial: Date, dataFinal: Date): Promise<Balanco> {
    const totalDespesas = await this.transacaoService.obterTodasDespesas(null, [conta], dataInicial, dataFinal)
      .then(despesas => this.somarValorDasTransacaoes(despesas));
    const totalReceitas = await this.transacaoService.obterTodasReceitas(null, [conta], dataInicial, dataFinal)
      .then(receitas => this.somarValorDasTransacaoes(receitas));
    const totalTransferenciasRecebidas = await this.transacaoService.obterTodasTransferencias(null, null, dataInicial, dataFinal, conta)
      .then(transferencias => this.somarValorDasTransacaoes(transferencias));
    const totalTransferenciasRealizadas = await this.transacaoService.obterTodasTransferencias(null, [conta], dataInicial, dataFinal)
      .then(transferencias => this.somarValorDasTransacaoes(transferencias));

    return new Balanco(totalDespesas, totalReceitas, totalTransferenciasRecebidas, totalTransferenciasRealizadas);
  }

  private somarValorDasTransacaoes(transacoes: Transacao[]): number {
    return transacoes.map(transacao => transacao.valor)
      .reduce((acumulador, valorCorrente) => acumulador + valorCorrente, 0);
  }
}
