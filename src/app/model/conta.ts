import { Responsavel } from './responsavel';
import { TipoContaEnum } from './tipoConta.enum';
export class Conta {
    id: number;
    nome: string;
    saldo: number;
    responsavel: Responsavel;
    tipoConta: TipoContaEnum;

    constructor(id: number, nome: string, saldo: number, responsavel: Responsavel, tipoConta: TipoContaEnum) {
        this.id = id;
        this.nome = nome;
        this.saldo = saldo;
        this.responsavel = responsavel;
        this.tipoConta = tipoConta;
    }
}
