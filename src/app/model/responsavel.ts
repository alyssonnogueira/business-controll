export class Responsavel {
    id: number;
    nome: string;
    dataExclusao: Date = null;

    constructor(nome: string) {
        this.nome = nome;
    }
}
