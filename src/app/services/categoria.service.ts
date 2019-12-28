import { Injectable } from '@angular/core';
import { Categoria } from '../model/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  categorias = [];

  constructor() {
    const categoria1 = new Categoria(1, 'Mercado');
    const categoria2 = new Categoria(2, 'Alimentacao');
    const categoria3 = new Categoria(3, 'Transporte');
    this.categorias = [categoria1, categoria2, categoria3];
  }

  obterCategorias(): Categoria[] {
    return this.categorias;
  }

  obterCategoria(id: number): Categoria {
    return this.categorias.find(categoria => categoria.id === id);
  }
}
