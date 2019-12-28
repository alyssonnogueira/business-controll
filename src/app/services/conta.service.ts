import { Injectable } from '@angular/core';
import { TipoPagamento } from '../enum/tipo-pagamento.enum';
import { Conta } from '../model/conta';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  contas = [];

  constructor() {
    const conta1 = new Conta(1, 'B.B Débito', TipoPagamento.DEBITO);
    const conta2 = new Conta(2, 'Santander', TipoPagamento.DEBITO);
    const conta3 = new Conta(3, 'Nubank', TipoPagamento.CREDITO);
    this.contas = [conta1, conta2, conta3];
  }

  obterContas(): Conta[] {
    return this.contas;
  }

  obterConta(id: number): Conta {
    return this.contas.find(conta => conta.id === id);
  }
}
