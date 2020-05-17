import { TipoTransacaoEnum } from './../../model/tipo-transacao.enum';
import { ResponsavelService } from './../../services/responsavel.service';
import { CurrencyFormatPipe } from './../../pipes/currency-format.pipe';
import { CategoriaDespesaEnum } from 'src/app/model/categoria-despesa.enum';
import { TipoRendaEnum } from './../../model/tipo-renda.enum';
import { TransacaoService } from '../../services/transacao.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Transacao} from '../../model/transacao';
import { TransacaoModalComponent } from '../transacao-modal/transacao-modal.component';
import {MatDialog } from '@angular/material/dialog';
import { Responsavel } from 'src/app/model/responsavel';

@Component({
  selector: 'app-transacao',
  templateUrl: './transacao.component.html',
  styleUrls: ['./transacao.component.css']
})
export class TransacaoComponent implements OnInit {

  displayedColumns: string[] = ['id', 'data', 'valor', 'descricao', 'categoria', 'responsavel', 'conta', 'edit', 'delete'];
  dataSource: MatTableDataSource<Transacao>;
  responsaveis: Responsavel[] = [];
  responsaveisFiltrados: Responsavel[] = [];
  tipoTransacoes = Object.keys(TipoTransacaoEnum);
  tipoTransacoesEnum = TipoTransacaoEnum;
  tipoTransacoesFiltradas: TipoTransacaoEnum[] = [];
  hoje = new Date();
  dataInicial = new Date((this.hoje.getMonth() + 1) + '/01/' + this.hoje.getFullYear());
  dataFinal = new Date((this.hoje.getMonth() + 2) + '/01/' + this.hoje.getFullYear());

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public currencyFormat = new CurrencyFormatPipe('pt-BR');

  constructor(private transacaoService: TransacaoService, public dialog: MatDialog,
              protected responsavelService: ResponsavelService) {
  }

  ngOnInit() {
    this.transacaoService.obterTodasTransacoes(null, null, null, this.dataInicial, this.dataFinal).then(transacoes => {
      this.dataSource = new MatTableDataSource(transacoes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageSize = 10;
      this.dataSource.sort = this.sort;
    });
    this.responsavelService.obterTodosResponsaveis().then(responsaveis =>  {
      this.responsaveis = responsaveis;
      this.responsaveisFiltrados = responsaveis.slice();
    });
    this.tipoTransacoes.forEach(tipoTransacao => this.tipoTransacoesFiltradas.push(TipoTransacaoEnum[tipoTransacao]));
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
      return novaTransacao ? this.transacaoService.editarTransacao(transacao, novaTransacao)
      .finally(() => this.atualizarDataSource()) : null;
    });
  }

  excluirTransacao(transacao: Transacao) {
    this.transacaoService.desfazerTransacao(transacao);
    this.atualizarDataSource();
  }

  atualizarDataSource() {
    this.transacaoService.obterTodasTransacoes(
      this.tipoTransacoesFiltradas, this.responsaveisFiltrados, null, this.dataInicial, this.dataFinal)
      .then(transacoes => {
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

  filtroResponsaveis(responsavel: Responsavel) {
    const index = this.obterPosicaoResponsavelSelecionado(responsavel);
    if (index === -1) {
      this.responsaveisFiltrados.push(responsavel);
    } else {
      this.responsaveisFiltrados.splice(index, 1);
    }
    this.atualizarDataSource();
  }

  obterPosicaoResponsavelSelecionado(responsavel: Responsavel): number {
    return this.responsaveisFiltrados.findIndex(responsavelFiltrado => {
      return responsavelFiltrado.id === responsavel.id;
    });
  }

  filtroTipoTransacoes(tipoTransacao: TipoTransacaoEnum) {
    const index = this.tipoTransacoesFiltradas.findIndex(tipoTransacaoFiltrada => tipoTransacao === tipoTransacaoFiltrada);
    if (index === -1) {
      this.tipoTransacoesFiltradas.push(tipoTransacao);
    } else {
      this.tipoTransacoesFiltradas.splice(index, 1);
    }
    this.atualizarDataSource();
  }

  get valorTotal() {
    return this.dataSource ? this.dataSource.filteredData.map(transacao => {
      let valor = 0;
      switch (transacao.tipoTransacao) {
        case TipoTransacaoEnum.DESPESA: valor = transacao.valor * -1; break;
        case TipoTransacaoEnum.RECEITA: valor = transacao.valor; break;
        case TipoTransacaoEnum.TRANSFERENCIA: valor = 0; break;
      }
      return valor;
    }).reduce((acumulador, valorCorrente) => acumulador + valorCorrente, 0) : 0;
  }
}
