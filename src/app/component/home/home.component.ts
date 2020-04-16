import { Responsavel } from './../../model/responsavel';
import { CategoriaDespesaEnum } from 'src/app/model/categoriaDespesa.enum';
import { TipoTransacaoEnum } from './../../model/tipoTransacao.enum';
import { TipoRendaEnum } from './../../model/tipoRenda.enum';
import { ContaService } from 'src/app/services/conta.service';
import { TransacaoService } from './../../services/transacao.service';
import { ResponsavelService } from './../../services/responsavel.service';
import { Component, OnInit } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';

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
  // {
  //           0: {
  //             despesas: [
  //               []
  //             ],
  //             receitas: [
  //               []
  //             ],
  //             credito: [
  //               []
  //             ]
  //           }
  //         };
  // {
  //           0: {
  //             despesas: [
  //               [55, 25, 20]
  //             ],
  //             receitas: [
  //               [15, 25, 60]
  //             ],
  //             credito: [
  //               [51, 35, 70]
  //             ]
  //           },
  //           1: {
  //             despesas: [
  //               [5, 25, 20]
  //             ],
  //             receitas: [
  //               [95, 25, 60]
  //             ],
  //             credito: [
  //               [101, 35, 70]
  //             ]
  //           },
  //           2: {
  //             despesas: [
  //               [15, 25, 20]
  //             ],
  //             receitas: [
  //               [215, 25, 60]
  //             ],
  //             credito: [
  //               [351, 35, 70]
  //             ]
  //           }
  //       };
  // categoriaEnum = CategoriaDespesaEnum;
  constructor(private responsavelService: ResponsavelService,
              private transacaoService: TransacaoService,
              private contaService: ContaService) { }

  ngOnInit() {
    this.responsavelService.obterTodosResponsaveis().then(responsaveis => {
      if (responsaveis.length > 1) {
        responsaveis.forEach(responsavel => this.responsaveis.push(responsavel));
      } else {
        this.responsaveis = responsaveis.length === 1 ? [responsaveis[0]] : [];
      }
      this.inicializaOsDados(responsaveis);
      this.coletarDadosDasDespesas(responsaveis);
    });
    this.rendaEnum = this.keys(TipoRendaEnum).map(tipoRenda => TipoRendaEnum[tipoRenda]);
    this.categoriaEnum = this.keys(CategoriaDespesaEnum).map(categoria => CategoriaDespesaEnum[categoria]);
  }

  inicializaOsDados(responsaveis: Responsavel[]) {
    const despesas = [[]];
    const receitas = [[]];
    const credito = [[]];
    if (responsaveis.length === 1) {
      this.dados[responsaveis[0].id] = {despesas, receitas, credito};
    } else {
      this.dados = { 0: {despesas, receitas, credito} };
      responsaveis.forEach(responsavel => {
          this.dados[responsavel.id] = {despesas, receitas, credito};
       });
    }
    console.log(this.dados);
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

  coletarDadosDasDespesas(responsaveis: Responsavel[]) {

  }

}
