import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransacaoComponent } from './component/transacao/transacao.component';
import {AppRouterModule} from './router/app-router.module';
import { MenuComponent } from './component/menu/menu.component';
import { FormsModule } from '@angular/forms';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule,
  MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import { TransacaoModalComponent } from './component/transacao-modal/transacao-modal.component';
import { ContaComponent } from './component/conta/conta.component';
import { ContaModalComponent } from './component/conta-modal/conta-modal.component';
import { ResponsavelComponent } from './component/responsavel/responsavel.component';
import { ResponsavelModalComponent } from './component/responsavel-modal/responsavel-modal.component';
import {NgxIndexedDBModule} from 'ngx-indexed-db';
import {IndexedDBConfigService} from './services/indexed-dbconfig.service';

@NgModule({
  declarations: [
    AppComponent,
    TransacaoComponent,
    MenuComponent,
    TransacaoModalComponent,
    ContaModalComponent,
    ResponsavelComponent,
    ContaComponent,
    ContaModalComponent,
    ResponsavelComponent,
    ResponsavelModalComponent,
  ],
  entryComponents: [
    TransacaoModalComponent,
    ContaModalComponent,
    ResponsavelModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRouterModule,
    FormsModule,
    // Material Imports
    MatNativeDateModule,
    ReactiveFormsModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    // IndexedDB
    NgxIndexedDBModule.forRoot(new IndexedDBConfigService())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
