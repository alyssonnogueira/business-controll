import { Injectable } from '@angular/core';
import { Responsavel } from '../model/responsavel';

@Injectable({
  providedIn: 'root'
})
export class ResponsavelService {

  private responsaveis: Responsavel[] = [
    new Responsavel(1, 'Alysson'),
    new Responsavel(2, 'Giordana')
  ];

  constructor() { }

  obterResponsavelPorId(id: number): Responsavel {
    return this.responsaveis.filter(responsavel => responsavel.id === id)[0];
  }

  obterTodosResponsaveis() {
    return this.responsaveis;
  }
}
