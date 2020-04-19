import { Transferencia } from './../model/transferencia';
import { Receita } from './../model/receita';
import { TipoTransacaoEnum } from '../model/tipo-transacao.enum';
import { ContaService } from './conta.service';
import { ResponsavelService } from './responsavel.service';
import { Injectable } from '@angular/core';
import {Transacao} from '../model/transacao';
import { Despesa } from '../model/despesa';
import { CategoriaDespesaEnum } from '../model/categoria-despesa.enum';
import { TipoRendaEnum } from '../model/tipo-renda.enum';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import { Responsavel } from '../model/responsavel';

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {

  private key = 'transacao';

  constructor(private responsavelService: ResponsavelService, private contaService: ContaService,
              private dbService: NgxIndexedDBService) {
    // this.mockData();
  }

  obterTodasTransacoes(): Promise<Transacao[]> {
    return this.dbService.getAll(this.key);
  }

  obterTodasDespesas(): Promise<Despesa[]> {
    return this.obterTodasTransacoes().then(transacoes =>
        transacoes.filter(transacao => transacao.tipoTransacao === TipoTransacaoEnum.DESPESA) as Despesa[]
      );
  }

  obterTodasReceitas(): Promise<Receita[]> {
    return this.obterTodasTransacoes().then(transacoes =>
      transacoes.filter(transacao => transacao.tipoTransacao === TipoTransacaoEnum.RECEITA) as Receita[]
    );
  }

  obterTodasTransferencias(): Promise<Transferencia[]> {
    return this.dbService.getByIndex(this.key, 'tipoTransacao', TipoTransacaoEnum.TRANSFERENCIA);
  }

  salvarTransacao(transacao: Transacao): void {
    this.dbService.add(this.key, transacao);
    this.contaService.alterarSaldoConta(transacao);
  }

  desfazerTransacao(transacao: Transacao): void {
    this.contaService.desfazerAlteracao(transacao);
    this.dbService.delete(this.key, transacao.id);
  }

  async editarTransacao(transacaoDesfeita, novaTransacao): Promise<void> {
    this.desfazerTransacao(transacaoDesfeita);
    await this.contaService.desfazerAlteracao(transacaoDesfeita);
    await this.dbService.delete(this.key, transacaoDesfeita);
    delete novaTransacao.id;
    await this.dbService.add(this.key, novaTransacao);
    await this.contaService.alterarSaldoConta(novaTransacao);
  }

  async mockData() {
    const transacoes = await this.obterTodasTransacoes();
    if (transacoes == null || transacoes.length === 0) {
      const transacao1 = new Despesa(new Date(), 1.5, 'teste 1',
      await this.responsavelService.obterResponsavelPorId(1),
      await this.contaService.obterContaPorId(1), CategoriaDespesaEnum[CategoriaDespesaEnum.ALIMENTACAO]);
      this.salvarTransacao(transacao1);

      const transacao2 = new Receita(new Date(), 20, 'teste 2',
      await this.responsavelService.obterResponsavelPorId(1),
      await this.contaService.obterContaPorId(1),
      TipoRendaEnum[TipoRendaEnum.SALARIO]);
      this.salvarTransacao(transacao2);

      const transacao3 = new Transferencia(new Date(), 5, 'teste 3',
      await this.responsavelService.obterResponsavelPorId(1),
      await this.contaService.obterContaPorId(1),
      await this.contaService.obterContaPorId(2));
      this.salvarTransacao(transacao3);
    }
  }

}

