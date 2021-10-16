import { FileUploadModalComponent } from './../file-upload-modal/file-upload-modal.component';
import { FileService } from './../../services/file.service';
import { IndexedDBConfigService } from './../../services/indexed-dbconfig.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import fileSaver from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavContainer } from '@angular/material/sidenav';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @ViewChild(MatSidenavContainer, { static: true }) sidenavContainer: MatSidenavContainer;

  constructor(public dialog: MatDialog, private fileService: FileService, private sanitizer: DomSanitizer, private el: ElementRef) { }

  ngOnInit() {
    window.addEventListener("close", detail => {
      console.log("close");
      this.closeMenu();
    });
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

  closeMenu() {
    this.sidenavContainer.close();
  }

  logout() {}

}
