import { Responsavel } from './responsavel';
import { TipoContaEnum } from './tipo-conta.enum';
export class Conta {
    id: number;
    nome: string;
    saldo: number;
    saldoOriginal: number;
    responsavel: Responsavel;
    tipoConta: TipoContaEnum;
    dataCriacao: Date;

    constructor(nome: string, saldoOriginal: number, responsavel: Responsavel, tipoConta: TipoContaEnum) {
        this.nome = nome;
        // this.saldoOriginal = saldoOriginal;
        this.saldo = saldoOriginal;
        this.responsavel = responsavel;
        this.tipoConta = tipoConta;
        this.dataCriacao = new Date();
    }

    static jsonToConta(json): Conta {
        return new Conta(json.nome, json.saldoOriginal, json.responsavel, json.tipoConta);
    }
}
