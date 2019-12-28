import { Injectable } from '@angular/core';
import {Lancamento} from '../model/lancamento';
import { Categoria } from '../model/categoria';
import { Conta } from '../model/conta';
import { TipoPagamento } from '../enum/tipo-pagamento.enum';
import { Responsavel } from '../model/responsavel';
import { TipoLancamento } from '../enum/tipo-lancamento.enum';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentos = [];

  constructor() {
    this.lancamentos = this.mockLancamentos();
  }

  obterTodosLancamentos(): Lancamento[] {
    return this.lancamentos;
  }

  salvarLancamento(lancamento: Lancamento) {
    if (lancamento.id != null) {
      const lancamentoId = this.lancamentos.findIndex(l => l.id === lancamento.id);
      this.lancamentos[lancamentoId] = lancamento;
    } else {
      lancamento.id = this.lancamentos.length;
      this.lancamentos.push(lancamento);
    }
  }

  mockLancamentos(): Lancamento[] {
    const categoriaMock = new Categoria(1, 'Mercado');
    const responsavelMock = new Responsavel(1, 'Alysson');
    const contaMock = new Conta(1, 'B.B Débito', TipoPagamento.DEBITO);
    const lancamento1 = new Lancamento(1, new Date(), 1.5, 'nova descricao',
    categoriaMock,  responsavelMock, TipoLancamento.DESPESA, contaMock);
    const lancamento2 = new Lancamento(1, new Date(), 1.5, 'nova descricao',
    categoriaMock,  responsavelMock, TipoLancamento.DESPESA, contaMock);
    const lancamento3 = new Lancamento(1, new Date(), 1.5, 'nova descricao',
    categoriaMock,  responsavelMock, TipoLancamento.DESPESA, contaMock);
    return [lancamento1, lancamento2, lancamento3];
  }

}

