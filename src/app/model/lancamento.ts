export class Lancamento {
  id: number;
  data: Date;
  valor: number;
  descricao: string;
  categoriaId: number;
  responsavelId: number;
  tipoPagamentoId: number;
  tipoLancamentoId: number;

  constructor(id: number, data: Date, valor: number, descricao: string, categoriaId: number, responsavelId: number, tipoPagamentoId: number, tipoLancamentoId: number) {
    this.id = id;
    this.data = data;
    this.valor = valor;
    this.descricao = descricao;
    this.categoriaId = categoriaId;
    this.responsavelId = responsavelId;
    this.tipoPagamentoId = tipoPagamentoId;
    this.tipoLancamentoId = tipoLancamentoId;
  }
}
