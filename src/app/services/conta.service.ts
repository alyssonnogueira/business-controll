import { Transferencia } from './../model/transferencia';
import { Receita } from './../model/receita';
import { Despesa } from './../model/despesa';
import { ResponsavelService } from './responsavel.service';
import { Injectable } from '@angular/core';
import { Conta } from '../model/conta';
import { TipoContaEnum } from '../model/tipoConta.enum';
import { Transacao } from '../model/transacao';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Responsavel } from '../model/responsavel';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  key = 'conta';

  constructor(private responsavelService: ResponsavelService, private dbService: NgxIndexedDBService) {
    this.mockData();
  }

  obterContaPorId(id: number): Promise<Conta> {
    return this.dbService.getByID(this.key, id);
  }

  obterTodasContas(): Promise<Conta[]> {
    return this.dbService.getAll(this.key);
  }

  async obterContaPorIdResponsavel(idResponsavel: number): Promise<Conta[]> {
    const contas = await this.obterTodasContas();
    return contas.filter(conta => conta.responsavel.id === idResponsavel);
  }

  salvarConta(conta: Conta): void {
    this.dbService.add(this.key, conta);
  }

  async alterarSaldoConta(transacao: Transacao) {
    const conta = await this.obterContaPorId(transacao.conta.id);
    if (transacao instanceof Despesa) {
      conta.saldo -= transacao.valor;
    } else if (transacao instanceof Receita) {
      conta.saldo += transacao.valor;
    } else if (transacao instanceof Transferencia) {
      conta.saldo -= transacao.valor;
      const contaDestino = await this.obterContaPorId(transacao.contaDestino.id);
      contaDestino.saldo += transacao.valor;
    }
  }

  async desfazerAlteracao(transacao: Transacao) {
    const conta = await this.obterContaPorId(transacao.conta.id);
    if (transacao instanceof Despesa) {
      conta.saldo += transacao.valor;
    } else if (transacao instanceof Receita) {
      conta.saldo -= transacao.valor;
    } else if (transacao instanceof Transferencia) {
      conta.saldo += transacao.valor;
      const contaDestino = await this.obterContaPorId(transacao.contaDestino.id);
      contaDestino.saldo -= transacao.valor;
    }
  }

  async mockData() {
    const contas = await this.obterTodasContas();
    if (contas == null || contas.length === 0) {
      this.dbService.add(this.key, new Conta('NuConta', 100,
      await this.responsavelService.obterResponsavelPorId(1), TipoContaEnum.DEBITO));
      this.dbService.add(this.key, new Conta('Bradesco', 50,
      await this.responsavelService.obterResponsavelPorId(1), TipoContaEnum.DEBITO));
      this.dbService.add(this.key, new Conta('NuConta', 200,
      await this.responsavelService.obterResponsavelPorId(2), TipoContaEnum.DEBITO));
    }
  }
}
