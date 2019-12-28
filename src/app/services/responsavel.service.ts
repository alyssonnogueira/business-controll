import { Injectable } from '@angular/core';
import { Responsavel } from '../model/responsavel';

@Injectable({
  providedIn: 'root'
})
export class ResponsavelService {

  responsaveis = [];

  constructor() {
    const responsavel1 = new Responsavel(1, 'Alysson');
    const responsavel2 = new Responsavel(2, 'Rafael');
    this.responsaveis = [responsavel1, responsavel2];
  }

  obterResponsaveis(): Responsavel[] {
    return this.responsaveis;
  }

  obterResponsavel(id: number): Responsavel {
    return this.responsaveis.find(responsavel => responsavel.id === id);
  }
}
