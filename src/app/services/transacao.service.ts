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

  private key = 'transacao';

  constructor(private responsavelService: ResponsavelService, private contaService: ContaService,
              private dbService: NgxIndexedDBService) {
    this.mockData();
  }

  obterTodasTransacoes(): Promise<Transacao[]> {
    return this.dbService.getAll(this.key);
  }

  salvarTransacao(transacao: Transacao): void {
    this.dbService.add(this.key, transacao);
    this.contaService.alterarSaldoConta(transacao);
  }

  desfazerTransacao(transacao: Transacao): void {
    this.contaService.desfazerAlteracao(transacao);
    this.dbService.delete(this.key, transacao.id);
  }

  async mockData() {
    const transacoes = await this.obterTodasTransacoes();
    if (transacoes == null || transacoes.length === 0) {
      const transacao1 = new Despesa(new Date(), 1.5, 'teste 1',
      await this.responsavelService.obterResponsavelPorId(1),
      await this.contaService.obterContaPorId(1), CategoriaDespesaEnum.ALIMENTACAO);
      transacao1.categoria = CategoriaDespesaEnum.MERCADO;
      this.salvarTransacao(transacao1);

      const transacao2 = new Receita(new Date(), 20, 'teste 2',
      await this.responsavelService.obterResponsavelPorId(1),
      await this.contaService.obterContaPorId(1),
      TipoRendaEnum.SALARIO);
      transacao2.tipoRenda = TipoRendaEnum.SALARIO;
      this.salvarTransacao(transacao2);

      const transacao3 = new Transferencia(new Date(), 5, 'teste 3',
      await this.responsavelService.obterResponsavelPorId(1),
      await this.contaService.obterContaPorId(1),
      await this.contaService.obterContaPorId(2));
      this.salvarTransacao(transacao3);
    }
  }

}

