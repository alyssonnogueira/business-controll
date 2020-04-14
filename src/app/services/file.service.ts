import { Conta } from './../model/conta';
import { element } from 'protractor';
import { ResponsavelService } from './responsavel.service';
import { ContaService } from 'src/app/services/conta.service';
import { TransacaoService } from './transacao.service';
import { Injectable } from '@angular/core';
import { Transacao } from '../model/transacao';
import { Responsavel } from '../model/responsavel';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private transacaoService: TransacaoService,
              private contaService: ContaService,
              private responsavelService: ResponsavelService) { }

  async exportDatabase(): Promise<string> {
    const transacoes = await this.transacaoService.obterTodasTransacoes();
    const contas = await this.contaService.obterTodasContas();
    const responsaveis = await this.responsavelService.obterTodosResponsaveis();
    return JSON.stringify({transacoes, contas, responsaveis});
  }

  async importDatabase(database) {
    const transacoes = database.transacoes as Transacao[];
    transacoes.forEach(transacao => {
      this.transacaoService.salvarTransacao(transacao);
    });
    const contas = database.contas as Conta[];
    contas.forEach(conta => {
      this.contaService.salvarConta(conta);
    });
    const responsaveis = database.responsaveis as Responsavel[];
    responsaveis.forEach(responsavel => {
      this.responsavelService.salvarResponsavel(responsavel);
    });
  }
}
