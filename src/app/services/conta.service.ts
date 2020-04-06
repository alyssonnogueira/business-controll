import { ResponsavelService } from './responsavel.service';
import { Injectable } from '@angular/core';
import { Conta } from '../model/conta';
import { TipoContaEnum } from '../model/tipoConta.enum';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  private contas: Conta[];

  constructor(private responsavelService: ResponsavelService) {
    this.contas = [
      new Conta(1, 'NuConta', 100, responsavelService.obterResponsavelPorId(1), TipoContaEnum.DEBITO),
      new Conta(2, 'Bradesco', 50, responsavelService.obterResponsavelPorId(1), TipoContaEnum.DEBITO),
      new Conta(3, 'NuConta', 200, responsavelService.obterResponsavelPorId(2), TipoContaEnum.DEBITO)
    ];
  }

  obterContaPorId(id: number): Conta {
    return this.contas.filter(conta => conta.id === id)[0];
  }

  obterTodosConta() {
    return this.contas;
  }

  obterContaPorIdResponsavel(idResponsavel: number): Conta[] {
    return this.contas.filter(conta => conta.responsavel.id === idResponsavel);
  }
}
