import { Responsavel } from 'src/app/model/responsavel';
import { MesesEnum } from './../../model/meses.enum';
import { CategoriaDespesaEnum } from 'src/app/model/categoria-despesa.enum';
import { TipoRendaEnum } from '../../model/tipo-renda.enum';
import { TransacaoService } from './../../services/transacao.service';
import { ResponsavelService } from './../../services/responsavel.service';
import { Component, OnInit } from '@angular/core';
import { MultiDataSet } from 'ng2-charts';
import { Transacao } from 'src/app/model/transacao';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  filtroGeral: Responsavel = {id: 0, nome: 'Geral', dataExclusao: null};
  responsaveis = [this.filtroGeral];
  colunas = ['Despesas', 'Receitas', 'Cartão de Crédito'];
  categoriaEnum = [];
  rendaEnum = [];
  keys = Object.keys;
  dados = {};
  isDespesaLoading = true;
  isReceitaLoading = true;
  isCreditoLoading = true;
  hoje = new Date();
  dataInicial = new Date((this.hoje.getMonth() + 1) + '/01/' + this.hoje.getFullYear());
  dataFinal = new Date((this.hoje.getMonth() + 2) + '/01/' + this.hoje.getFullYear());
  mesSelecionado = MesesEnum[this.hoje.getMonth()];

  constructor(private responsavelService: ResponsavelService, private transacaoService: TransacaoService) { }

  ngOnInit() {
    this.responsavelService.obterTodosResponsaveis().subscribe(responsaveis => {
      if (responsaveis.length > 1) {
        responsaveis.forEach(responsavel => this.responsaveis.push(responsavel));
      } else {
        this.responsaveis = responsaveis.length === 1 ? [responsaveis[0]] : [];
      }
      this.atualizarDados();
    });
    this.rendaEnum = this.keys(TipoRendaEnum).map(tipoRenda => TipoRendaEnum[tipoRenda]);
    this.categoriaEnum = this.keys(CategoriaDespesaEnum).map(categoria => CategoriaDespesaEnum[categoria]);
  }

  inicializaOsDados(responsaveis: Responsavel[]) {
    if (responsaveis.length === 1) {
      this.dados[responsaveis[0].id] = {despesas: [[]], receitas: [[]], credito: [[]]};
    } else {
      this.dados = { 0: {despesas: [[]], receitas: [[]], credito: [[]]} };
      responsaveis.forEach(responsavel => {
          this.dados[responsavel.id] = {despesas: [[]], receitas: [[]], credito: [[]]};
       });
    }
  }

  get categoria() {
    return this.categoriaEnum;
  }

  get renda() {
    return this.rendaEnum;
  }

  obterDadosDespesa(responsavel): MultiDataSet {
    return this.dados[responsavel.id] ? this.dados[responsavel.id].despesas : [[]];
  }

  obterDadosReceita(responsavel): MultiDataSet {
    return this.dados[responsavel.id] ? this.dados[responsavel.id].receitas : [[]];
  }

  obterDadosCartaoDeCredito(responsavel): MultiDataSet {
    return this.dados[responsavel.id] ? this.dados[responsavel.id].credito : [[]];
  }

  atualizarDados() {
    this.inicializaOsDados(this.responsaveis);
    this.isDespesaLoading = true;
    this.isReceitaLoading = true;
    this.isCreditoLoading = true;
    this.coletarDadosDasDespesas(this.responsaveis).finally(() => this.isDespesaLoading = false);
    this.coletarDadosDasReceitas(this.responsaveis).finally(() => this.isReceitaLoading = false);
    this.coletarDadosDasDespesas(this.responsaveis, true).finally(() => this.isCreditoLoading = false);
  }

  async coletarDadosDasDespesas(todosResponsaveis: Responsavel[], isCredito = false) {
    const responsaveis = todosResponsaveis.filter(responsavel => responsavel.id !== 0);
    const chave = isCredito ? 'credito' : 'despesas';

    for (const responsavel of responsaveis) {
      for (const categoria of this.keys(CategoriaDespesaEnum)) {
        const despesasFiltradas = await lastValueFrom(this.transacaoService.obterTodasDespesas([responsavel],
          null, this.dataInicial, this.dataFinal, CategoriaDespesaEnum[categoria], isCredito));
        this.dados[responsavel.id][chave][0].push(this.somarValorDasTransacaoes(despesasFiltradas));
      }
    }

    if (todosResponsaveis.length > 1) {
      this.keys(CategoriaDespesaEnum).forEach((categoria, index) => {
        this.dados[0][chave][0][index] = 0;
        responsaveis.forEach(responsavel => {
          this.dados[0][chave][0][index] += this.dados[responsavel.id][chave][0][index];
        });
      });
    }
  }

  async coletarDadosDasReceitas(todosResponsaveis: Responsavel[]) {
    const responsaveis = todosResponsaveis.filter(responsavel => responsavel.id !== 0);
    for (const responsavel of responsaveis) {
      for (const renda of this.keys(TipoRendaEnum)) {
        const receitasFiltradas = await lastValueFrom(this.transacaoService.obterTodasReceitas([responsavel],
          null, this.dataInicial, this.dataFinal, TipoRendaEnum[renda]));
        this.dados[responsavel.id].receitas[0].push(this.somarValorDasTransacaoes(receitasFiltradas));
      }
    }

    if (todosResponsaveis.length > 1) {
      this.keys(CategoriaDespesaEnum).forEach((categoria, index) => {
        this.dados[0].receitas[0][index] = 0;
        responsaveis.forEach(responsavel => {
          this.dados[0].receitas[0][index] += this.dados[responsavel.id].receitas[0][index];
        });
      });
    }
  }

  somarValorDasTransacaoes(transacoes: Transacao[]): number {
    return transacoes.map(transacao => transacao.valor)
                      .reduce((acumulador, valorCorrente) => acumulador + valorCorrente, 0);
  }

  diminuirMes() {
    if (MesesEnum[this.mesSelecionado] > 0 ) {
      const mes = MesesEnum[this.mesSelecionado] - 1;
      this.dataInicial = this.obterData(mes + 1);
      this.dataFinal = this.obterData(mes + 2);
      this.mesSelecionado = MesesEnum[mes];
    }
    this.atualizarDados();
  }

  aumentarMes() {
    if (MesesEnum[this.mesSelecionado] < 12 ) {
      const mes = MesesEnum[this.mesSelecionado] + 1;
      this.dataInicial = this.obterData(mes + 1);
      this.dataFinal = this.obterData(mes + 2);
      this.mesSelecionado = MesesEnum[mes];
    }
    this.atualizarDados();
  }

  private obterData(mes: number) {
    return new Date(mes + '/01/' + this.hoje.getFullYear());
  }
}
