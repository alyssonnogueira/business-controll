import {Injectable} from '@angular/core';
import {Conta} from '../model/conta';
import {MesesEnum} from '../model/meses.enum';
import {Transacao} from '../model/transacao';
import {TransacaoService} from './transacao.service';
import {ContaService} from './conta.service';
import {Balanco} from '../model/balanco';
import {combineLatest, combineLatestAll, combineLatestWith, lastValueFrom, map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalancoService {

  keys = Object.keys;

  constructor(private contaService: ContaService, private transacaoService: TransacaoService) {
  }

  async calcularBalancoDe12Meses(conta: Conta, ano: Date): Promise<number[]> {
    const anoAtual = ano.getFullYear();
    const totalEmMeses = [];
    for (const mes of this.keys(MesesEnum).slice(0, 12)) {
      const mesEmNumero = parseInt(mes, 10);
      const dataInicial = new Date((mesEmNumero + 1) + '/01/' + anoAtual);
      const dataFinal = new Date((mesEmNumero + 2) + '/01/' + anoAtual);
      totalEmMeses[mes] = conta.dataCriacao >= dataInicial && conta.dataCriacao < dataFinal ? conta.saldoOriginal : 0;
      const balancoDoMes = await lastValueFrom(this.calcularBalanco(conta, dataInicial, dataFinal));
      const saldoMesAnterior = mesEmNumero > 0 ? totalEmMeses[mesEmNumero - 1] :
        (await this.calcularBalancoAnoAnterior(conta, anoAtual));

      totalEmMeses[mes] += saldoMesAnterior + balancoDoMes.calcularValorTotal();
    }

    return totalEmMeses;
  }

  async calcularBalancoAnoAnterior(conta: Conta, ano: number): Promise<number> {
    const dataFinal = new Date('01/01/' + ano);
    const saldoInicial = conta.dataCriacao < dataFinal ? conta.saldoOriginal : 0;
    const balancoTotal = await lastValueFrom(this.calcularBalanco(conta, null, dataFinal));
    return saldoInicial + balancoTotal.calcularValorTotal();
  }

  private calcularBalanco(conta: Conta, dataInicial: Date, dataFinal: Date): Observable<Balanco> {
    const totalDespesasObservable = this.transacaoService.obterTodasDespesas(null, [conta], dataInicial, dataFinal)
      .pipe(map(this.somarValorDasTransacaoes));
    const totalReceitasObservable = this.transacaoService.obterTodasReceitas(null, [conta], dataInicial, dataFinal)
      .pipe(map(this.somarValorDasTransacaoes));
    const totalTransferenciasRecebidasObservable = this.transacaoService.obterTodasTransferencias(null, null, dataInicial, dataFinal, conta)
      .pipe(map(this.somarValorDasTransacaoes));
    const totalTransferenciasRealizadasObservable = this.transacaoService.obterTodasTransferencias(null, [conta], dataInicial, dataFinal)
      .pipe(map(this.somarValorDasTransacaoes));

    return totalDespesasObservable
      .pipe(
        combineLatestWith(totalReceitasObservable, totalTransferenciasRecebidasObservable, totalTransferenciasRealizadasObservable),
        map(
          ([totalDespesas, totalReceitas, totalTransferenciasRecebidas, totalTransferenciasRealizadas]) =>
            new Balanco(totalDespesas, totalReceitas, totalTransferenciasRecebidas, totalTransferenciasRealizadas))
      );
    // combineLatest(totalDespesas, totalReceitas, totalTransferenciasRecebidas, totalTransferenciasRealizadas)
    //
    // return new Balanco(totalDespesas, totalReceitas, totalTransferenciasRecebidas, totalTransferenciasRealizadas);
  }

  private somarValorDasTransacaoes(transacoes: Transacao[]): number {
    return transacoes.map(transacao => transacao.valor)
      .reduce((acumulador, valorCorrente) => acumulador + valorCorrente, 0);
  }
}
