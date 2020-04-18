import { Transacao } from './transacao';
import { CategoriaDespesaEnum } from './categoria-despesa.enum';
import { Responsavel } from './responsavel';
import { Conta } from './conta';
import { TipoTransacaoEnum } from './tipo-transacao.enum';

export class Despesa extends Transacao {
    categoria: CategoriaDespesaEnum;

    constructor(data: Date, valor: number, descricao: string,
                responsavel: Responsavel, conta: Conta, categoria: CategoriaDespesaEnum) {
        super(data, valor, descricao, responsavel, conta, TipoTransacaoEnum.DESPESA);
        this.categoria = categoria;
      }

    static jsonToDespesa(json): Despesa {
        return new Despesa(json.data, json.valor, json.descricao, json.responsavel, json.conta, json.categoria);
    }
}
