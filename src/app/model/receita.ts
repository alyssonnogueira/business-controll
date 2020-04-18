import { TipoTransacaoEnum } from './tipoTransacao.enum';
import { Transacao } from './transacao';
import { TipoRendaEnum } from './tipoRenda.enum';
import { Conta } from './conta';
import { Responsavel } from './responsavel';

export class Receita extends Transacao {
    tipoRenda: TipoRendaEnum;

    constructor(data: Date, valor: number, descricao: string,
                responsavel: Responsavel, conta: Conta, tipoRenda: TipoRendaEnum) {
        super(data, valor, descricao, responsavel, conta, TipoTransacaoEnum.RECEITA);
        this.tipoRenda = tipoRenda;
    }

    static jsonToDespesa(json): Receita {
        return new Receita(json.data, json.valor, json.descricao, json.responsavel, json.conta, json.tipoRenda);
    }
}
