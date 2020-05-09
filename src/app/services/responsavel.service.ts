import { Injectable } from '@angular/core';
import { Responsavel } from '../model/responsavel';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsavelService {

  private key = 'responsavel';

  constructor(private dbService: NgxIndexedDBService) {
    this.mockData();
  }

  obterResponsavelPorId(id: number): Promise<Responsavel> {
    return this.dbService.getByID(this.key, id);
  }

  obterTodosResponsaveis(): Promise<Responsavel[]> {
    return this.dbService.getAll(this.key);
  }

  salvarResponsavel(responsavel: Responsavel) {
    this.dbService.add(this.key, responsavel);
  }

  responsaveisSaoIguais(responsavel1: Responsavel, responsavel2: Responsavel): boolean {
    return responsavel1 && responsavel2 ? responsavel1.id === responsavel2.id : responsavel1 === responsavel2;
  }

  async mockData() {
    const transacoes = await this.obterTodosResponsaveis();
    if (transacoes == null || transacoes.length === 0) {
      this.salvarResponsavel(new Responsavel('Joãozinho'));
      this.salvarResponsavel(new Responsavel('Maria'));
    }
  }
}
