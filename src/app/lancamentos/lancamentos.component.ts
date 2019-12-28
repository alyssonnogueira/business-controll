import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Lancamento} from '../model/lancamento';
import {LancamentoService} from '../services/lancamento.service';
import { LancamentoModalComponent } from '../lancamento-modal/lancamento-modal.component';
import {MatDialog } from '@angular/material/dialog';

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

  constructor(private  lancamentoService: LancamentoService, public dialog: MatDialog ) {
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

  adicionarLancamento(){
    const dialogRef = this.dialog.open(LancamentoModalComponent, {
      width: '450px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.lancamentoService.salvarLancamento(result);
        this.dataSource.data = this.lancamentoService.obterTodosLancamentos();
      }
    });
  }
}
