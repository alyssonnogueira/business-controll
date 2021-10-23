import { FileService } from './../../services/file.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.css']
})
export class FileUploadModalComponent implements OnInit {

  files: FileList;

  constructor(private fileService: FileService, public dialogRef: MatDialogRef<FileUploadModalComponent>) { }

  ngOnInit() {
  }

  adicionarArquivo(files: FileList) {
    this.files = files;
  }

  onSave() {
    const reader: FileReader = new FileReader();
    reader.readAsText(this.files.item(0));
    reader.onload = (e) => {
      const jsonString = reader.result.toString().split('\r\n');
      const database = JSON.parse(jsonString[0]);
      this.fileService.importDatabase(database);
    };
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

}
