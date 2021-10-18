import {Responsavel} from './../model/responsavel';
import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {filter, finalize, first, lastValueFrom, map, mergeMap, Observable, pipe, Subscription, takeLast} from 'rxjs';
import {Conta} from '../model/conta';

@Injectable({
  providedIn: 'root'
})
export class ResponsavelService {

  private key = 'responsavel';

  constructor(private dbService: NgxIndexedDBService) {
    // this.mockData(); //.subscribe();
  }

  obterResponsavelPorId(id: number): Observable<Responsavel> {
    return this.dbService.getByID(this.key, id);
  }

  obterTodosResponsaveis(): Observable<Responsavel[]> {
    return this.dbService.getAll(this.key).pipe(map(this.filtrarResponsaveisDesativadas));
  }

  filtrarResponsaveisDesativadas(contas: Responsavel[]): Responsavel[] {
    return contas.filter((conta: Responsavel) => conta.dataExclusao == null);
  }

  salvarResponsavel(responsavel: Responsavel) {
    this.dbService.add(this.key, responsavel).subscribe();
  }

  atualizarResponsavel(responsavel: Responsavel): Observable<Responsavel> {
    return this.dbService.update(this.key, responsavel, responsavel.id)
      .pipe(map((responsaveis: Responsavel[]) => responsaveis[0]));
  }

  desativarResponsavel(responsavel: Responsavel): Observable<Responsavel> {
    responsavel.dataExclusao = new Date();
    return this.atualizarResponsavel(responsavel);
  }

  responsaveisSaoIguais(responsavel1: Responsavel, responsavel2: Responsavel): boolean {
    return responsavel1 && responsavel2 ? responsavel1.id === responsavel2.id : responsavel1 === responsavel2;
  }

  importarResponsaveis(responsaveis: Responsavel[]) {
    this.dbService.clear(this.key).subscribe(
      {
        next: () => responsaveis.forEach(responsavel => {
          this.salvarResponsavel(responsavel);
        }),
        error: err => console.log('Erro ao importar responsaveis: ' + err),
        complete: () => this.dbService.count(this.key).subscribe(nResponsaveis => {
          console.log(`Improtacao de Responsaveis concluida \n ${nResponsaveis} Responsaveis importadas`);
        })
      });
  }

  mockData(): Observable<void> {
    return this.obterTodosResponsaveis()
      .pipe(
        filter((responsaveis: Responsavel[]) => responsaveis == null || responsaveis.length === 0),
        map(() => {
          this.salvarResponsavel(new Responsavel('Joãozinho'));
          this.salvarResponsavel(new Responsavel('Maria'));
        })
      );
  }
}
