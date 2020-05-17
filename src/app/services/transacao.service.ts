import { TipoRendaEnum } from './../model/tipo-renda.enum';
import { TipoTransacaoEnum } from './../model/tipo-transacao.enum';
import { Despesa } from './../model/despesa';
import { Conta } from './../model/conta';
import { MesesEnum } from './../model/meses.enum';
import { Transferencia } from './../model/transferencia';
import { Receita } from './../model/receita';
import { ContaService } from './conta.service';
import { ResponsavelService } from './responsavel.service';
import { Injectable } from '@angular/core';
import {Transacao} from '../model/transacao';
import { CategoriaDespesaEnum } from '../model/categoria-despesa.enum';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import { Responsavel } from '../model/responsavel';
import { TipoContaEnum } from '../model/tipo-conta.enum';

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {

  private key = 'transacao';

  constructor(private responsavelService: ResponsavelService, private contaService: ContaService,
              private dbService: NgxIndexedDBService) {
    this.mockData();
  }

  obterTodasTransacoes(tipoTransacoes?: TipoTransacaoEnum[],
                       responsaveis?: Responsavel[],
                       conta?: Conta,
                       dataInicial?: Date,
                       dataFinal?: Date): Promise<Transacao[]> {
    return this.dbService.getAll(this.key).then((transacoes: Transacao[]) => {
      return transacoes.filter(transacao => this.filtroTipoTransacao(transacao, tipoTransacoes)
                                            && this.filtroConta(transacao, conta)
                                            && this.filtroResponsavel(transacao, responsaveis)
                                            && this.filtroData(transacao, dataInicial, dataFinal));
    });
  }

  obterTodasDespesas(responsavel?: Responsavel,
                     conta?: Conta,
                     dataInicial?: Date,
                     dataFinal?: Date,
                     categoria?: CategoriaDespesaEnum,
                     isCredito?: boolean): Promise<Despesa[]> {
    return this.obterTodasTransacoes([TipoTransacaoEnum.DESPESA], [responsavel], conta, dataInicial, dataFinal)
      .then((despesas: Despesa[]) =>
        despesas.filter(despesa => this.filtroCategoria(despesa, categoria) && this.filtroDebitoCredito(despesa, isCredito))
      );
  }

  obterTodasReceitas(responsavel?: Responsavel,
                     conta?: Conta,
                     dataInicial?: Date,
                     dataFinal?: Date,
                     renda?: TipoRendaEnum): Promise<Receita[]> {
    return this.obterTodasTransacoes([TipoTransacaoEnum.RECEITA], [responsavel], conta, dataInicial, dataFinal)
      .then((receitas: Receita[]) =>
        receitas.filter(receita => renda ? TipoRendaEnum[receita.tipoRenda] === renda : true)
      );
  }

  obterTodasTransferencias(responsavel?: Responsavel,
                           conta?: Conta,
                           dataInicial?: Date,
                           dataFinal?: Date,
                           contaDestino?: Conta): Promise<Transferencia[]> {
    return this.obterTodasTransacoes([TipoTransacaoEnum.TRANSFERENCIA], [responsavel], conta, dataInicial, dataFinal)
      .then((transferencias: Transferencia[]) =>
        transferencias.filter(transferencia => contaDestino ? transferencia.contaDestino.id === contaDestino.id : true)
      );
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

  private filtroTipoTransacao(transacao: Transacao, tipoTransacoes: TipoTransacaoEnum[]) {
    return tipoTransacoes ? tipoTransacoes.some(tipoTransacao => transacao.tipoTransacao === tipoTransacao) : true;
  }

  private filtroConta(transacao: Transacao, conta: Conta) {
    return conta ? transacao.conta.id === conta.id : true;
  }

  private filtroResponsavel(transacao: Transacao, responsaveis: Responsavel[]) {
    return responsaveis ?
              responsaveis.some(responsavel => transacao.responsavel.id === responsavel.id) :
              true;
  }

  private filtroDebitoCredito(transacao: Transacao, isCredito: boolean) {
    return isCredito != null ? (isCredito ?
                            transacao.conta.tipoConta === TipoContaEnum.CREDITO :
                            transacao.conta.tipoConta === TipoContaEnum.DEBITO
                          ) :
                          true;
  }

  private filtroData(transacao: Transacao, dataInicial: Date, dataFinal: Date) {
    return dataInicial && dataFinal ?
            (transacao.data >= dataInicial && transacao.data < dataFinal) :
            true;
  }

  private filtroCategoria(despesa: Despesa, categoria: CategoriaDespesaEnum) {
    return categoria ?
              CategoriaDespesaEnum[despesa.categoria] === categoria :
              true;
  }

  async mockData() {
    const transacoes = await this.obterTodasTransacoes();
    if (transacoes == null || transacoes.length === 0) {
      const transacao1 = {
        data: new Date(),
        valor: 1.5,
        descricao: 'teste 1',
        responsavel: await this.responsavelService.obterResponsavelPorId(1),
        conta: await this.contaService.obterContaPorId(1),
        categoria: 'ALIMENTACAO'
      };
      this.salvarTransacao(Despesa.jsonToDespesa(transacao1));

      const transacao2 = {
        data: new Date(),
        valor: 20,
        descricao: 'teste 2',
        responsavel: await this.responsavelService.obterResponsavelPorId(1),
        conta: await this.contaService.obterContaPorId(1),
        tipoRenda: 'SALARIO'
      };
      this.salvarTransacao(Receita.jsonToReceita(transacao2));

      const transacao3 = new Transferencia(new Date(), 5, 'teste 3',
      await this.responsavelService.obterResponsavelPorId(1),
      await this.contaService.obterContaPorId(1),
      await this.contaService.obterContaPorId(2));
      this.salvarTransacao(transacao3);
    }
  }

}

