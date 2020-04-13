import { ContaService } from './conta.service';
import { ResponsavelService } from './responsavel.service';
import { Transferencia } from '../model/transferencia';
import { Injectable } from '@angular/core';
import {Transacao} from '../model/transacao';
import { Despesa } from '../model/despesa';
import { Receita } from '../model/receita';
import { CategoriaDespesaEnum } from '../model/categoriaDespesa.enum';
import { TipoRendaEnum } from '../model/tipoRenda.enum';
import {NgxIndexedDBService} from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {

  private transacoes: Transacao[] = [];
  private key = 'transacao';

  constructor(private responsavelService: ResponsavelService, private contaService: ContaService,
              private dbService: NgxIndexedDBService) {
    const transacao1 = new Despesa(1, new Date(), 1.5, 'teste 1',
                                  this.responsavelService.obterResponsavelPorId(1),
                                  this.contaService.obterContaPorId(1), CategoriaDespesaEnum.ALIMENTACAO);
    transacao1.categoria = CategoriaDespesaEnum.MERCADO;
    this.transacoes.push(transacao1);

    const transacao2 = new Receita(2,  new Date(), 20, 'teste 2',
        this.responsavelService.obterResponsavelPorId(1),
        this.contaService.obterContaPorId(1),
        TipoRendaEnum.SALARIO);
    transacao2.tipoRenda = TipoRendaEnum.SALARIO;
    this.transacoes.push(transacao2);

    const transacao3 = new Transferencia(3, new Date(), 5, 'teste 3',
        this.responsavelService.obterResponsavelPorId(1),
        this.contaService.obterContaPorId(1),
        this.contaService.obterContaPorId(2));
    transacao3.contaDestino = this.contaService.obterContaPorId(2);
    this.transacoes.push(transacao3);
    this.dbService.add(this.key, transacao1).then(
      () => console.log('Salvo'),
      error => {
        console.log(error);
      }
    );
    this.dbService.getAll(this.key).then(
      transacao => {
        console.log(transacao);
        this.transacoes = transacao as Transacao[];
      }
    );
  }

  obterTodasTransacoes(): Transacao[] {
    return this.transacoes;
  }

  salvarTransacao(transacao: Transacao): void {
    transacao.id = this.transacoes.length > 0 ? this.transacoes[this.transacoes.length - 1].id + 1 : 1;
    this.transacoes.push(transacao);
    this.contaService.alterarSaldoConta(transacao);
  }

  desfazerTransacao(transacao: Transacao): void {
    this.contaService.desfazerAlteracao(transacao);
    const index = this.transacoes.indexOf(transacao);
    this.transacoes.splice(index, 1);
  }

}

