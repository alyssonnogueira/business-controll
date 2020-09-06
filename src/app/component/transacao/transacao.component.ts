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
import {Conta} from "../../model/conta";
import {ContaService} from "../../services/conta.service";

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
  contas: Conta[] = [];
  contasFiltrados: Conta[] = [];
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
              protected responsavelService: ResponsavelService, private contaService: ContaService) {
    this.tipoTransacoes.forEach(tipoTransacao => this.tipoTransacoesFiltradas.push(TipoTransacaoEnum[tipoTransacao]));
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
    })

    this.contaService.obterTodasContas().then(contas => {
      this.contas = contas;
      this.contasFiltrados = contas.slice();
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  atualizarResponsaveisEContas() {
    this.contasFiltrados = [];
    this.contas = [];
    this.responsaveisFiltrados.forEach(responsavel => {
      this.contaService.obterContaPorIdResponsavel(responsavel.id).then(contas => {
        this.contas = this.contas.concat(contas);
        this.contasFiltrados = this.contasFiltrados.concat(contas.slice());
      });
    });
    this.atualizarDataSource();
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
      this.tipoTransacoesFiltradas, this.responsaveisFiltrados, this.contasFiltrados, this.dataInicial, this.dataFinal)
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
