export class Balanco {
  totalDespesas: number;
  totalReceitas: number;
  totalTransferenciasRecebidas: number;
  totalTransferenciasRealizadas: number;

  constructor(totalDespesas: number, totalReceitas: number, totalTransferenciasRecebidas: number, totalTransferenciasRealizadas: number) {
    this.totalReceitas = totalReceitas;
    this.totalTransferenciasRecebidas = totalTransferenciasRecebidas;
    this.totalDespesas = totalDespesas;
    this.totalTransferenciasRealizadas = totalTransferenciasRealizadas;
  }

  calcularValorTotal(){
    return this.totalReceitas + this.totalTransferenciasRecebidas - this.totalDespesas - this.totalTransferenciasRealizadas;
  }
}
