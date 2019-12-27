import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Lancamento} from '../model/lancamento';
import {LancamentoService} from '../services/lancamento.service';

@Component({
  selector: 'app-lancamentos',
  templateUrl: './lancamentos.component.html',
  styleUrls: ['./lancamentos.component.css']
})
export class LancamentosComponent implements OnInit {

  displayedColumns: string[] = ['id', 'data', 'valor', 'descricao', 'categoriaId', 'responsavelId', 'tipoPagamentoId', 'tipoLancamentoId'];
  dataSource: MatTableDataSource<Lancamento>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private  lancamentoService: LancamentoService ) {
    const lancamentos = lancamentoService.obterTodosLancamentos();
    this.dataSource = new MatTableDataSource(lancamentos);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
