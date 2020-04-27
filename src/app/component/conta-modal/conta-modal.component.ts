import { TipoContaEnum } from '../../model/tipo-conta.enum';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Conta } from '../../model/conta';
import { ResponsavelService } from '../../services/responsavel.service';

@Component({
  selector: 'app-conta-modal',
  templateUrl: './conta-modal.component.html',
  styleUrls: ['./conta-modal.component.css']
})
export class ContaModalComponent implements OnInit {

  tipoContaEnum = TipoContaEnum;
  keys = Object.keys;
  responsaveis = [];

  constructor(
    public dialogRef: MatDialogRef<ContaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Conta,
    private responsavelService: ResponsavelService) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(Conta.jsonToConta(this.data));
  }

  ngOnInit() {
    this.responsavelService.obterTodosResponsaveis().then(responsaveis => this.responsaveis = responsaveis);
  }
}
