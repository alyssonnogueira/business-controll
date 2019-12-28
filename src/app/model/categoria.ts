import { FormGroup } from '@angular/forms';

export class Categoria {
  id: number;
  nome: string;

  constructor(id?: number,
              nome?: string) {
    this.id = id;
    this.nome = nome;
  }

}
