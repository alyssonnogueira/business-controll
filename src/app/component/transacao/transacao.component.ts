import { CurrencyFormatPipe } from './../../pipes/currency-format.pipe';
import { CategoriaDespesaEnum } from 'src/app/model/categoria-despesa.enum';
import { TipoRendaEnum } from './../../model/tipo-renda.enum';
import { Transferencia } from '../../model/transferencia';
import { TipoTransacaoEnum } from '../../model/tipo-transacao.enum';
import { Receita } from '../../model/receita';
import { Despesa } from '../../model/despesa';
import { TransacaoService } from '../../services/transacao.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Transacao} from '../../model/transacao';
import { TransacaoModalComponent } from '../transacao-modal/transacao-modal.component';
import {MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-transacao',
  templateUrl: './transacao.component.html',
  styleUrls: ['./transacao.component.css']
})
export class TransacaoComponent implements OnInit {

  displayedColumns: string[] = ['id', 'data', 'valor', 'descricao', 'categoria', 'responsavel', 'tipoPagamento', 'conta', 'edit', 'delete'];
  dataSource: MatTableDataSource<Transacao>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public currencyFormat = new CurrencyFormatPipe('pt-BR');

  constructor(private transacaoService: TransacaoService, public dialog: MatDialog ) {
  }

  ngOnInit() {
    this.transacaoService.obterTodasTransacoes().then(transacoes => {
      this.dataSource = new MatTableDataSource(transacoes);
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

  adicionarTransacao() {
    const dialogRef = this.dialog.open(TransacaoModalComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.transacaoService.salvarTransacao(result);
      this.atualizarDataSource();
    });
  }

  editarTransacao(transacao: Transacao) {
    const dialogRef = this.dialog.open(TransacaoModalComponent, {
      width: '800px',
      data: Object.assign({}, transacao)
    });

    dialogRef.afterClosed().subscribe(novaTransacao => {
      this.transacaoService.editarTransacao(transacao, novaTransacao)
      .finally(() => this.atualizarDataSource());
    });
  }

  excluirTransacao(transacao: Transacao) {
    this.transacaoService.desfazerTransacao(transacao);
    this.atualizarDataSource();
  }

  atualizarDataSource() {
    this.transacaoService.obterTodasTransacoes().then(transacoes => {
      this.dataSource.data = transacoes;
    });
  }

  obterClasseTransacao(transacao: Transacao): string {
    let classe = '';
    switch (transacao.tipoTransacao) {
      case TipoTransacaoEnum.DESPESA: classe = 'despesa'; break;
      case TipoTransacaoEnum.RECEITA: classe = 'receita'; break;
      case TipoTransacaoEnum.TRANSFERENCIA: classe = 'transferencia'; break;
    }
    return classe;
  }

  obterCategoria(transacao): string {
    let categoria = null;
    switch (transacao.tipoTransacao) {
      case TipoTransacaoEnum.DESPESA: categoria = CategoriaDespesaEnum[transacao.categoria]; break;
      case TipoTransacaoEnum.RECEITA: categoria = TipoRendaEnum[transacao.tipoRenda]; break;
      case TipoTransacaoEnum.TRANSFERENCIA: categoria = TipoTransacaoEnum.TRANSFERENCIA; break;
    }
    return categoria;
  }
}
