import { FormGroup } from '@angular/forms';
import { TipoPagamento } from '../enum/tipo-pagamento.enum';
import { Responsavel } from './responsavel';

export class Conta {
  id: number;
  nome: string;
  tipoCartao: TipoPagamento;
  responsavel: Responsavel;

  constructor(id?: number,
              nome?: string,
              tipoCartao?: TipoPagamento,
              responsavel?: Responsavel) {
    this.id = id;
    this.nome = nome;
    this.tipoCartao = tipoCartao;
    this.responsavel = responsavel;
  }

}
