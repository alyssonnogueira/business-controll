import { TransacaoService } from './../../services/transacao.service';
import { MesesEnum } from './../../model/meses.enum';
import { CurrencyFormatPipe } from './../../pipes/currency-format.pipe';
import { ContaModalComponent } from './../conta-modal/conta-modal.component';
import { ContaService } from '../../services/conta.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Conta } from '../../model/conta';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { filter } from 'minimatch';
import { Transacao } from 'src/app/model/transacao';

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

  displayedColumns: string[] = ['id', 'nome', 'saldo', 'responsavel', 'tipoConta'];
  dataSource: MatTableDataSource<Conta>;
  expandedElement: Conta | null;
  public currencyFormat = new CurrencyFormatPipe('pt-BR');
  keys = Object.keys;
  meses = MesesEnum;
  totalEmMeses = [];
  isLoading = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private contaService: ContaService,
              private transacaoService: TransacaoService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.contaService.obterTodasContas().then(contas => {
      this.dataSource = new MatTableDataSource(contas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageSize = 25;
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

  async carregarDetalhesDaConta(conta: Conta) {
    this.isLoading = true;
    for (const mes of this.keys(MesesEnum).slice(0, 12)) {
      const mesEmNumero = parseInt(mes, 10);
      const dataInicial = new Date((mesEmNumero + 1) + '/01/' + new Date().getFullYear());
      const dataFinal = new Date((mesEmNumero + 2) + '/01/' + new Date().getFullYear());
      const totalDespesas = await this.transacaoService.obterTodasDespesas(null, conta, dataInicial, dataFinal)
        .then(despesas => this.somarValorDasTransacaoes(despesas));
      const totalReceitas = await this.transacaoService.obterTodasReceitas(null, conta, dataInicial, dataFinal)
        .then(receitas => this.somarValorDasTransacaoes(receitas));
      const totalTransferenciasRecebidas = await this.transacaoService.obterTodasTransferencias(null, null, dataInicial, dataFinal, conta)
        .then(receitas => this.somarValorDasTransacaoes(receitas));
      const totalTransferenciasRealizadas = await this.transacaoService.obterTodasTransferencias(null, conta, dataInicial, dataFinal)
        .then(receitas => this.somarValorDasTransacaoes(receitas));
      this.totalEmMeses[mes] = totalReceitas + totalTransferenciasRecebidas - totalDespesas - totalTransferenciasRealizadas;
    }
    this.isLoading = false;
  }

  somarValorDasTransacaoes(transacoes: Transacao[]): number {
    return transacoes.map(transacao => transacao.valor)
                      .reduce((acumulador, valorCorrente) => acumulador + valorCorrente, 0);
  }
}
