import { FileUploadModalComponent } from './../file-upload-modal/file-upload-modal.component';
import { FileService } from './../../services/file.service';
import { IndexedDBConfigService } from './../../services/indexed-dbconfig.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import fileSaver from 'file-saver';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(public dialog: MatDialog, private fileService: FileService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  get currentUserName() {
    return 'Alysson';
  }

  download() {
    this.fileService.exportDatabase().then(database => {
      const blob = new Blob([database], { type: 'text/json' });
      fileSaver.saveAs(blob, 'BusinessControllV3.json');
    });
  }

  upload() {
    const dialogRef = this.dialog.open(FileUploadModalComponent, {
      width: '370px',
      height: '188px',
      data: {}
    });
  }

}
