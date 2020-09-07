import {Transferencia} from './../model/transferencia';
import {ResponsavelService} from './responsavel.service';
import {Injectable} from '@angular/core';
import {Conta} from '../model/conta';
import {TipoContaEnum} from '../model/tipo-conta.enum';
import {Transacao} from '../model/transacao';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {TipoTransacaoEnum} from '../model/tipo-transacao.enum';

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
    return this.dbService.getAll(this.key).then(this.filtrarContasDesativadas);
  }

  async obterContaPorIdResponsavel(idResponsavel: number): Promise<Conta[]> {
    const contas = await this.obterTodasContas();
    return this.filtrarContasDesativadas(contas.filter(conta => conta.responsavel.id === idResponsavel));
  }

  contasSaoIguais(conta1: Conta, conta2: Conta): boolean {
    return conta1 && conta2 ? conta1.id === conta2.id : conta1 === conta2;
  }

  filtrarContasDesativadas(contas: Conta[]): Conta[] {
    return contas.filter((conta: Conta) => conta.dataExclusao == null);
  }

  salvarConta(conta: Conta): void {
    this.dbService.add(this.key, conta);
  }

  atualizarConta(conta: Conta): Promise<Conta> {
    return this.dbService.update(this.key, conta);
  }

  desativarConta(conta: Conta): Promise<Conta> {
    conta.dataExclusao = new Date();
    return this.atualizarConta(conta);
  }

  async alterarSaldoConta(transacao: Transacao) {
    const conta = await this.obterContaPorId(transacao.conta.id);
    if (TipoTransacaoEnum.DESPESA === transacao.tipoTransacao) {
      conta.saldo -= transacao.valor;
    } else if (TipoTransacaoEnum.RECEITA === transacao.tipoTransacao) {
      conta.saldo += transacao.valor;
    } else if (TipoTransacaoEnum.TRANSFERENCIA === transacao.tipoTransacao) {
      conta.saldo -= transacao.valor;
      const contaDestino = await this.obterContaPorId((transacao as Transferencia).contaDestino.id);
      contaDestino.saldo += transacao.valor;
      await this.atualizarConta(contaDestino);
    }
    await this.atualizarConta(conta);
  }

  async desfazerAlteracao(transacao: Transacao) {
    const conta = await this.obterContaPorId(transacao.conta.id);
    if (TipoTransacaoEnum.DESPESA === transacao.tipoTransacao) {
      conta.saldo += transacao.valor;
    } else if (TipoTransacaoEnum.RECEITA === transacao.tipoTransacao) {
      conta.saldo -= transacao.valor;
    } else if (TipoTransacaoEnum.TRANSFERENCIA === transacao.tipoTransacao) {
      conta.saldo += transacao.valor;
      const contaDestino = await this.obterContaPorId((transacao as Transferencia).contaDestino.id);
      contaDestino.saldo -= transacao.valor;
      await this.atualizarConta(contaDestino);
    }
    await this.atualizarConta(conta);
  }

  importarContas(contas: Conta[]) {
    this.dbService.clear(this.key).then(() => {
      contas.forEach(conta => {
        conta.dataCriacao = new Date(conta.dataCriacao);
        conta.dataExclusao = !!conta.dataExclusao ? new Date(conta.dataExclusao) : null;
        this.salvarConta(conta);
      })
    }).catch(err => {
      console.log("Erro ao importar contas: " + err);
    }).finally(() => {
      this.dbService.count(this.key).then(nContas => {
        console.info(`Improtacao de Contas concluida \n ${nContas} Contas importadas`);
      });
    });
  }

  async mockData() {
    const contas = await this.obterTodasContas();
    if (contas == null || contas.length === 0) {
      this.dbService.add(this.key, new Conta('Banco Digital', 100,
        await this.responsavelService.obterResponsavelPorId(1), TipoContaEnum.DEBITO));
      this.dbService.add(this.key, new Conta('Bancão', 50,
        await this.responsavelService.obterResponsavelPorId(1), TipoContaEnum.DEBITO));
      this.dbService.add(this.key, new Conta('Banco Digital', 200,
        await this.responsavelService.obterResponsavelPorId(2), TipoContaEnum.DEBITO));
    }
  }
}
