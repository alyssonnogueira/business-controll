import { Injectable } from '@angular/core';
import {Lancamento} from '../model/lancamento';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  constructor() { }

  obterTodosLancamentos(): Lancamento[] {
    const lancamento1 = new Lancamento(1, new Date(), 1.5, 'nova descricao', 1,
      1,  1, 1);
    const lancamento2 = new Lancamento(2,  new Date(), 50.2, 'outra desc',
      3, 4, 5, 6 );
    const lancamento3 = new Lancamento(3, new Date(), 24.2, 'ewqewqeqw', 31,
      2, 2, 31);
    return [lancamento1, lancamento2, lancamento3];
  }

}

