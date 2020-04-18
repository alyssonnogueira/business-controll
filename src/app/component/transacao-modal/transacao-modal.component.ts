import { Transferencia } from '../../model/transferencia';
import { Receita } from '../../model/receita';
import { Despesa } from '../../model/despesa';
import { ContaService } from '../../services/conta.service';
import { ResponsavelService } from '../../services/responsavel.service';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Transacao } from '../../model/transacao';
import { TipoTransacaoEnum } from '../../model/tipo-transacao.enum';
import { Responsavel } from '../../model/responsavel';
import { Conta } from '../../model/conta';
import { CategoriaDespesaEnum } from '../../model/categoria-despesa.enum';
import { TipoRendaEnum } from '../../model/tipo-renda.enum';
import {MatSnackBar} from '@angular/material';
import { from, Observable, of } from 'rxjs';


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

  constructor(
    public dialogRef: MatDialogRef<TransacaoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transacao,
    private responsavelService: ResponsavelService,
    private contaService: ContaService,
    private snackBar: MatSnackBar) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.isDespesa && this.validarDespesa(this.data as Despesa)) {
      this.dialogRef.close(Despesa.jsonToDespesa(this.data));
    }

    if (this.isReceita && this.validarReceita(this.data as Receita)) {
      this.dialogRef.close(Receita.jsonToDespesa(this.data));
    }

    if (this.isTranferencia && this.validarTransferencia(this.data as Transferencia)) {
      this.dialogRef.close(Transferencia.jsonToDespesa(this.data));
    }
  }

  ngOnInit() {
    if (this.data.id) {
      if ('categoria' in this.data) {
        this.tipoTransacao = 'DESPESA';
        const despesa = this.data as Despesa;
        despesa.categoria = this.categoriaEnum[despesa.categoria];
      } else if ('tipoRenda' in this.data) {
        this.tipoTransacao = 'RECEITA';
        const receita = this.data as Receita;
        receita.tipoRenda = this.tipoRendaEnum[receita.tipoRenda];
      } else if ('contaDestino' in this.data) {
        this.tipoTransacao = 'TRANSFERENCIA';
      }
    } else {
      this.data.data = new Date();
    }
    this.responsavelService.obterTodosResponsaveis().then(responsaveis => this.responsaveis = responsaveis);
  }

  obterContas() {
    return this.data.responsavel != null ?
      this.contaService.obterContaPorIdResponsavel(this.data.responsavel.id).then(contas => this.contas = contas) : [];
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
    if (this.validarTransacao(transacao) || !transacao.categoria) {
      this.mostrarMensagemDeErro();
      return false;
    }
    return true;
  }

  validarTransferencia(transacao: Transferencia) {
    if (this.validarTransacao(transacao) || !transacao.contaDestino) {
      this.mostrarMensagemDeErro();
      return false;
    }
    return true;
  }
  validarReceita(transacao: Receita) {
    if (this.validarTransacao(transacao) || !transacao.tipoRenda) {
      this.mostrarMensagemDeErro();
      return false;
    }
    return true;
  }

  validarTransacao(transacao: Transacao): boolean {
    return !transacao.conta || !transacao.data || !transacao.responsavel || !transacao.valor;
  }

  mostrarMensagemDeErro(): void {
    this.snackBar.open(this.mensagemValidacao, 'Ok', {
      duration: 3000,
    });
  }
}
