import { Transferencia } from '../../model/transferencia';
import { TipoTransacaoEnum } from '../../model/tipoTransacao.enum';
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

  displayedColumns: string[] = ['id', 'data', 'valor', 'descricao', 'responsavel', 'tipoPagamento', 'conta', 'delete'];
  dataSource: MatTableDataSource<Transacao>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private transacaoService: TransacaoService, public dialog: MatDialog ) {
  }

  ngOnInit() {
    this.transacaoService.obterTodasTransacoes().then(transacoes => {
      this.dataSource = new MatTableDataSource(transacoes);
      this.dataSource.paginator = this.paginator;
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
      data: transacao
    });

    dialogRef.afterClosed().subscribe(result => {
      transacao = result;
      this.atualizarDataSource();
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

  obterTipoTransacao(transacao): string {
    if (transacao instanceof Despesa) {
      return TipoTransacaoEnum.DESPESA;
    }
    if (transacao instanceof Receita) {
      return TipoTransacaoEnum.RECEITA;
    }
    if (transacao instanceof Transferencia) {
      return TipoTransacaoEnum.TRANSFERENCIA;
    }
    return '';
  }

  obterClasseTransacao(transacao): string {
    const tipoTransacao = this.obterTipoTransacao(transacao);
    let classe = '';
    switch (tipoTransacao) {
      case TipoTransacaoEnum.DESPESA: classe = 'despesa'; break;
      case TipoTransacaoEnum.RECEITA: classe = 'receita'; break;
      case TipoTransacaoEnum.TRANSFERENCIA: classe = 'transferencia'; break;
    }
    return classe;
  }
}
