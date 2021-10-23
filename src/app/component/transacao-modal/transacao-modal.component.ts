import {Transferencia} from '../../model/transferencia';
import {Receita} from '../../model/receita';
import {Despesa} from '../../model/despesa';
import {ContaService} from '../../services/conta.service';
import {ResponsavelService} from '../../services/responsavel.service';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Transacao} from '../../model/transacao';
import {TipoTransacaoEnum} from '../../model/tipo-transacao.enum';
import {CategoriaDespesaEnum} from '../../model/categoria-despesa.enum';
import {TipoRendaEnum} from '../../model/tipo-renda.enum';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-transacao-modal',
  templateUrl: './transacao-modal.component.html',
  styleUrls: ['./transacao-modal.component.css']
})
export class TransacaoModalComponent implements OnInit {

  tipoTransacaoEnum = TipoTransacaoEnum;
  tipoTransacao = 'DESPESA';
  keys = Object.keys;
  categoriaEnum = CategoriaDespesaEnum;
  tipoRendaEnum = TipoRendaEnum;
  private mensagemValidacao = 'POR FAVOR PREENCHA TODOS OS CAMPOS';
  responsaveis = [];
  contas = [];

  contaDestinoData;
  tipoRendaData;
  categoriaData;

  constructor(
    public dialogRef: MatDialogRef<TransacaoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transacao,
    public responsavelService: ResponsavelService,
    public contaService: ContaService,
    private snackBar: MatSnackBar) {
    this.responsavelService.obterTodosResponsaveis().subscribe(responsaveis => this.responsaveis = responsaveis);
  }

  ngOnInit() {
    if (this.data.id) {
      if (this.data.tipoTransacao === TipoTransacaoEnum.DESPESA) {
        this.tipoTransacao = 'DESPESA';
        const despesa = this.data as Despesa;
        despesa.categoria = this.categoriaEnum[despesa.categoria];
        this.categoriaData = despesa.categoria;
      } else if ('tipoRenda' in this.data) {
        this.tipoTransacao = 'RECEITA';
        const receita = this.data as Receita;
        receita.tipoRenda = this.tipoRendaEnum[receita.tipoRenda];
        this.tipoRendaData = receita.tipoRenda;
      } else if ('contaDestino' in this.data) {
        this.tipoTransacao = 'TRANSFERENCIA';
        this.contaDestinoData = (this.data as Transferencia).contaDestino;
      }
      this.obterContas();
    } else {
      this.data.data = new Date();
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSave(): void {
    if (this.isDespesa && this.validarDespesa(this.data as Despesa)) {
      const index = this.keys(CategoriaDespesaEnum).findIndex(key => this.categoriasSaoIguais(key, this.categoriaData));
      (this.data as Despesa).categoria = this.keys(CategoriaDespesaEnum)[index] as CategoriaDespesaEnum;
      this.dialogRef.close(Despesa.jsonToDespesa(this.data));
    }

    if (this.isReceita && this.validarReceita(this.data as Receita)) {
      const index = this.keys(TipoRendaEnum).findIndex(key => this.receitasSaoIguais(key, this.tipoRendaData));
      (this.data as Receita).tipoRenda = this.keys(TipoRendaEnum)[index] as TipoRendaEnum;
      this.dialogRef.close(Receita.jsonToReceita(this.data));
    }

    if (this.isTranferencia && this.validarTransferencia(this.data as Transferencia)) {
      (this.data as Transferencia).contaDestino = this.contaDestinoData;
      this.dialogRef.close(Transferencia.jsonToTransferencia(this.data));
    }
  }

  obterContas() {
    return this.data.responsavel != null ?
      this.contaService.obterContaPorIdResponsavel(this.data.responsavel.id).then(contas => this.contas = contas) : [];
  }

  categoriasSaoIguais(categoria1: string, categoria2: string): boolean {
    return categoria1 && categoria2 ? CategoriaDespesaEnum[categoria1] === categoria2 || categoria1 === categoria2 : false;
  }

  receitasSaoIguais(receita1: string, receita2: string): boolean {
    return receita1 && receita2 ? TipoRendaEnum[receita1] === receita2 || receita1 === receita2 : false;
  }

  get isDespesa(): boolean {
    return TipoTransacaoEnum[this.tipoTransacao] === TipoTransacaoEnum.DESPESA;
  }

  get isReceita(): boolean {
    return TipoTransacaoEnum[this.tipoTransacao] === TipoTransacaoEnum.RECEITA;
  }

  get isTranferencia(): boolean {
    return TipoTransacaoEnum[this.tipoTransacao] === TipoTransacaoEnum.TRANSFERENCIA;
  }

  validarDespesa(transacao: Despesa): boolean {
    if (this.validarTransacao(transacao) || (!transacao.categoria && !this.categoriaData)) {
      this.mostrarMensagemDeErro();
      return false;
    }
    return true;
  }

  validarTransferencia(transacao: Transferencia) {
    if (this.validarTransacao(transacao) || (!transacao.contaDestino && !this.contaDestinoData)) {
      this.mostrarMensagemDeErro();
      return false;
    }
    return true;
  }

  validarReceita(transacao: Receita) {
    if (this.validarTransacao(transacao) || (!transacao.tipoRenda && !this.tipoRendaData)) {
      this.mostrarMensagemDeErro();
      return false;
    }
    return true;
  }

  validarTransacao(transacao: Transacao): boolean {
    return !transacao.conta || !transacao.data || !transacao.responsavel || !transacao.valor;
  }

  mostrarMensagemDeErro(): void {
    console.log(this.data);
    this.snackBar.open(this.mensagemValidacao, 'Ok', {
      duration: 3000,
    });
  }
}
