import {MesesEnum} from './../../model/meses.enum';
import {CurrencyFormatPipe} from './../../pipes/currency-format.pipe';
import {ContaModalComponent} from './../conta-modal/conta-modal.component';
import {ContaService} from '../../services/conta.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {Conta} from '../../model/conta';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {BalancoService} from "../../services/balanco.service";

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class ContaComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'saldo', 'responsavel', 'tipoConta', 'edit', 'delete'];
  dataSource: MatTableDataSource<Conta>;
  expandedElement: Conta | null;
  public currencyFormat = new CurrencyFormatPipe('pt-BR');
  keys = Object.keys;
  meses = MesesEnum;
  totalEmMeses = [];
  isLoading = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public dialog: MatDialog, private contaService: ContaService, private balancoService: BalancoService) {
  }

  ngOnInit() {
    this.contaService.obterTodasContas().then(contas => {
      this.dataSource = new MatTableDataSource(contas);
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
    const dialogRef = this.dialog.open(ContaModalComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.contaService.salvarConta(result);
      this.atualizarDataSource();
    });
  }

  editarConta(conta: Conta) {
    const dialogRef = this.dialog.open(ContaModalComponent, {
      width: '800px',
      data: conta
    });

    dialogRef.afterClosed().subscribe(contaEditada => {
      return contaEditada ? this.contaService.atualizarConta(contaEditada).finally(() => this.atualizarDataSource()) : null;
    });
  }

  desativarConta(conta: Conta) {
    this.contaService.desativarConta(conta)
      .finally(() => this.atualizarDataSource());
  }

  atualizarDataSource() {
    this.contaService.obterTodasContas().then(contas => {
      this.dataSource.data = contas;
    });
  }

  expandirConta(conta) {
    if (conta === this.expandedElement) {
      this.expandedElement = null;
    } else {
      this.carregarDetalhesDaConta(conta);
      this.expandedElement = conta;
    }
  }

  mesAtual(mes) {
    return new Date().getMonth() === parseInt(mes, 10) ? 'blue' : '';
  }

  carregarDetalhesDaConta(conta: Conta) {
    this.isLoading = true;
    this.balancoService
      .calcularBalancoDe12Meses(conta, new Date())
      .then((totalEmMeses => this.totalEmMeses = totalEmMeses))
      .finally(() => this.isLoading = false);
  }
}
