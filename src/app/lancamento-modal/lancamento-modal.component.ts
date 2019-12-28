import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Lancamento } from '../model/lancamento';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TipoLancamento } from '../enum/tipo-lancamento.enum';
import { Categoria } from '../model/categoria';
import { CategoriaService } from '../services/categoria.service';
import { ContaService } from '../services/conta.service';
import { ResponsavelService } from '../services/responsavel.service';
import { Responsavel } from '../model/responsavel';
import { Conta } from '../model/conta';


@Component({
  selector: 'app-lancamento-modal',
  templateUrl: './lancamento-modal.component.html',
  styleUrls: ['./lancamento-modal.component.css']
})
export class LancamentoModalComponent {

  lancamentoFormGroup: FormGroup;

  constructor(
    private categoriaService: CategoriaService,
    private contaService: ContaService,
    private responsavelService: ResponsavelService,
    public dialogRef: MatDialogRef<LancamentoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Lancamento, fb: FormBuilder) {
      this.lancamentoFormGroup = fb.group({
        data: new FormControl(new Date()),
        valor: new FormControl(null),
        descricao: new FormControl(null),
        categoria: new FormControl(null),
        responsavel: new FormControl(null),
        conta: new FormControl(null),
        contaDestino: new FormControl(null),
        tipoLancamento: new FormControl('DESPESA'),
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSalvar(): Lancamento {
    if (this.data == null) {
      return Lancamento.formToLancamento(this.lancamentoFormGroup);
    } else {
      return this.data;
    }
  }

  isTransferencia(): boolean {
    return TipoLancamento[this.lancamentoFormGroup.controls.tipoLancamento.value] === TipoLancamento.TRANSFERENCIA;
  }

  get tiposDeLancamento(): string[] {
    return Object.keys(TipoLancamento);
  }

  lancamentoEnumParaTexto(tipoLancamento: string): string {
    return TipoLancamento[tipoLancamento];
  }

  get categorias(): Categoria[] {
    return this.categoriaService.obterCategorias();
  }

  get contas(): Conta[] {
    return this.contaService.obterContas();
  }

  get responsaveis(): Responsavel[] {
    return this.responsavelService.obterResponsaveis();
  }

}
