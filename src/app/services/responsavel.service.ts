import {Responsavel} from './../model/responsavel';
import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Observable, pipe} from 'rxjs';

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
    return this.dbService.getAll(this.key).then(this.filtrarResponsaveisDesativadas);
  }

  filtrarResponsaveisDesativadas(contas: Responsavel[]): Responsavel[] {
    return contas.filter((conta: Responsavel) => conta.dataExclusao == null);
  }

  salvarResponsavel(responsavel: Responsavel) {
    this.dbService.add(this.key, responsavel);
  }

  atualizarResponsavel(responsavel: Responsavel): Promise<Responsavel> {
    return this.dbService.update(this.key, responsavel);
  }

  desativarResponsavel(responsavel: Responsavel): Promise<Responsavel> {
    responsavel.dataExclusao = new Date();
    return this.atualizarResponsavel(responsavel);
  }

  responsaveisSaoIguais(responsavel1: Responsavel, responsavel2: Responsavel): boolean {
    return responsavel1 && responsavel2 ? responsavel1.id === responsavel2.id : responsavel1 === responsavel2;
  }

  importarResponsaveis(responsaveis: Responsavel[]) {
    this.dbService.clear(this.key).then(() => {
      responsaveis.forEach(responsavel => {
        this.salvarResponsavel(responsavel);
      })
    }).catch(err => {
      console.log("Erro ao importar responsaveis: " + err);
    }).finally(() => {
      console.log("Improtacao de Responsaveis concluida");
    });
  }

  async mockData() {
    const transacoes = await this.obterTodosResponsaveis();
    if (transacoes == null || transacoes.length === 0) {
      this.salvarResponsavel(new Responsavel('Joãozinho'));
      this.salvarResponsavel(new Responsavel('Maria'));
    }
  }
}
