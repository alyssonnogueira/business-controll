import { TipoTransacaoEnum } from './tipo-transacao.enum';
import { Transacao } from './transacao';
import { Conta } from './conta';
import { Responsavel } from './responsavel';

export class Transferencia extends Transacao {
    contaDestino: Conta;

    constructor(data: Date, valor: number, descricao: string,
                responsavel: Responsavel, conta: Conta, contaDestino: Conta) {
        super(data, valor, descricao, responsavel, conta, TipoTransacaoEnum.TRANSFERENCIA);
        this.contaDestino = contaDestino;
    }

    static jsonToTransferencia(json): Transferencia {
        return new Transferencia(json.data, json.valor, json.descricao, json.responsavel, json.conta, json.contaDestino);
    }
}
