import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Lancamento } from '../model/lancamento';


@Component({
  selector: 'app-lancamento-modal',
  templateUrl: './lancamento-modal.component.html',
  styleUrls: ['./lancamento-modal.component.css']
})
export class LancamentoModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<LancamentoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Lancamento) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
  }

}
