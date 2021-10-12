import { ResponsavelModalComponent } from './../responsavel-modal/responsavel-modal.component';
import { ResponsavelService } from './../../services/responsavel.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Responsavel } from 'src/app/model/responsavel';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-responsavel',
  templateUrl: './responsavel.component.html',
  styleUrls: ['./responsavel.component.css']
})
export class ResponsavelComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'edit', 'delete'];
  dataSource: MatTableDataSource<Responsavel>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private responsavelService: ResponsavelService, public dialog: MatDialog ) {}

  ngOnInit() {
    this.responsavelService.obterTodosResponsaveis().then(responsaveis => {
      this.dataSource = new MatTableDataSource(responsaveis);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageSize = 10;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  adicionarConta() {
    const dialogRef = this.dialog.open(ResponsavelModalComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.responsavelService.salvarResponsavel(result);
      this.atualizarDataSource();
    });
  }

  editarResponsavel(responsavel: Responsavel) {
    const dialogRef = this.dialog.open(ResponsavelModalComponent, {
      width: '400px',
      data: responsavel
    });

    dialogRef.afterClosed().subscribe(responsavelEditada => {
      return responsavelEditada ? this.responsavelService.atualizarResponsavel(responsavelEditada)
        .finally(() => this.atualizarDataSource()) : null;
    });
  }

  desativarResponsavel(responsavel: Responsavel) {
    this.responsavelService.desativarResponsavel(responsavel)
      .finally(() => this.atualizarDataSource());
  }

  atualizarDataSource() {
    this.responsavelService.obterTodosResponsaveis().then(responsaveis => {
      this.dataSource.data = responsaveis;
    });
  }

}
