import { FormGroup } from '@angular/forms';
import { Categoria } from './categoria';
import { Responsavel } from './responsavel';
import { TipoLancamento } from '../enum/tipo-lancamento.enum';
import { Conta } from './conta';

export class Lancamento {
  id: number;
  data: Date;
  valor: number;
  descricao: string;
  categoria: Categoria;
  responsavel: Responsavel;
  tipoLancamento: TipoLancamento;
  conta: Conta;
  contaDestino?: Conta;

  constructor(id: number,
              data: Date,
              valor: number,
              descricao: string,
              categoria: Categoria,
              responsavel: Responsavel,
              tipoLancamento: TipoLancamento,
              conta: Conta,
              contaDestino?: Conta) {
    this.id = id;
    this.data = data;
    this.valor = valor;
    this.descricao = descricao;
    this.categoria = categoria;
    this.responsavel = responsavel;
    this.tipoLancamento = tipoLancamento;
    this.conta = conta;
    this.contaDestino = contaDestino;
  }

  static formToLancamento(lancamentoFormGroup: FormGroup): Lancamento {
      return new Lancamento(
        null,
        lancamentoFormGroup.controls.data.value,
        lancamentoFormGroup.controls.valor.value,
        lancamentoFormGroup.controls.descricao.value,
        lancamentoFormGroup.controls.categoria.value,
        lancamentoFormGroup.controls.responsavel.value,
        lancamentoFormGroup.controls.tipoLancamento.value,
        lancamentoFormGroup.controls.conta.value,
        lancamentoFormGroup.controls.contaDestino.value
      );
  }

}
