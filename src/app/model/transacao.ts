import { TipoTransacaoEnum } from './tipoTransacao.enum';
import { Responsavel } from './responsavel';
import { Conta } from './conta';

export abstract class Transacao {
  id: number;
  data: Date;
  valor: number;
  descricao: string;
  responsavel: Responsavel;
  conta: Conta;

  constructor(data: Date, valor: number, descricao: string, responsavel: Responsavel, conta: Conta) {
    this.data = data;
    this.valor = valor;
    this.descricao = descricao;
    this.responsavel = responsavel;
    this.conta = conta;
  }
}
