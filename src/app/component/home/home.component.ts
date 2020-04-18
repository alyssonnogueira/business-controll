import { MesesEnum } from './../../model/meses.enum';
import { Despesa } from './../../model/despesa';
import { TipoTransacaoEnum } from '../../model/tipo-transacao.enum';
import { Receita } from './../../model/receita';
import { Responsavel } from './../../model/responsavel';
import { CategoriaDespesaEnum } from 'src/app/model/categoria-despesa.enum';
import { TipoRendaEnum } from '../../model/tipo-renda.enum';
import { ContaService } from 'src/app/services/conta.service';
import { TransacaoService } from './../../services/transacao.service';
import { ResponsavelService } from './../../services/responsavel.service';
import { Component, OnInit } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { TipoContaEnum } from 'src/app/model/tipo-conta.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  responsaveis = [{id: 0, nome: 'Geral'}];
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
    this.responsavelService.obterTodosResponsaveis().then(responsaveis => {
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
    const todasDespesas = await this.transacaoService.obterTodasDespesas();
    const despesasPorResponsavel = {};
    const chave = isCredito ? 'credito' : 'despesas';
    responsaveis.forEach(responsavel => {
      despesasPorResponsavel[responsavel.id] = todasDespesas.filter(despesa => despesa.responsavel.id === responsavel.id);
      this.keys(CategoriaDespesaEnum).forEach(categoria => {
        const total = despesasPorResponsavel[responsavel.id]
            .filter((despesa: Despesa) => despesa.data >= this.dataInicial && despesa.data < this.dataFinal)
            .filter(despesa => despesa.categoria === categoria)
            .filter((despesa: Despesa) => isCredito ?
                                          despesa.conta.tipoConta === TipoContaEnum.CREDITO :
                                          despesa.conta.tipoConta === TipoContaEnum.DEBITO)
            .map(despesa => despesa.valor)
            .reduce((acumulador, valorCorrente) => acumulador + valorCorrente, 0);
        this.dados[responsavel.id][chave][0].push(total);
      });
    });

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
    const todasReceitas = await this.transacaoService.obterTodasReceitas();
    const receitaPorResponsavel = {};
    responsaveis.forEach(responsavel => {
      receitaPorResponsavel[responsavel.id] = todasReceitas.filter(receita => receita.responsavel.id === responsavel.id);
      this.keys(TipoRendaEnum).forEach(renda => {
        const total = receitaPorResponsavel[responsavel.id]
            .filter(receita => receita.data >= this.dataInicial && receita.data < this.dataFinal)
            .filter((receita: Receita) => receita.tipoRenda === renda)
            .map(receita => receita.valor)
            .reduce((acumulador, valorCorrente) => acumulador + valorCorrente, 0);
        this.dados[responsavel.id].receitas[0].push(total);
      });
    });
    if (todosResponsaveis.length > 1) {
      this.keys(CategoriaDespesaEnum).forEach((categoria, index) => {
        this.dados[0].receitas[0][index] = 0;
        responsaveis.forEach(responsavel => {
          this.dados[0].receitas[0][index] += this.dados[responsavel.id].receitas[0][index];
        });
      });
    }
  }

  diminuirMes() {
    if (MesesEnum[this.mesSelecionado] > 0 ) {
      const mes = MesesEnum[this.mesSelecionado] - 1;
      this.dataInicial = new Date((mes + 1) + '/01/' + this.hoje.getFullYear());
      this.dataFinal = new Date((mes + 2) + '/01/' + this.hoje.getFullYear());
      this.mesSelecionado = MesesEnum[mes];
    }
    this.atualizarDados();
  }

  aumentarMes() {
    if (MesesEnum[this.mesSelecionado] < 12 ) {
      const mes = MesesEnum[this.mesSelecionado] + 1;
      this.dataInicial = new Date((mes + 1) + '/01/' + this.hoje.getFullYear());
      this.dataFinal = new Date((mes + 2) + '/01/' + this.hoje.getFullYear());
      this.mesSelecionado = MesesEnum[mes];
    }
    this.atualizarDados();
  }
}
