import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Lancamento } from '../model/lancamento';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-lancamento-modal',
  templateUrl: './lancamento-modal.component.html',
  styleUrls: ['./lancamento-modal.component.css']
})
export class LancamentoModalComponent implements OnInit {

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  lacamentoFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LancamentoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Lancamento, fb: FormBuilder) {
      this.lacamentoFormGroup = fb.group({
        pagamento: 1,
        tipo: 1,
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
  }

}
