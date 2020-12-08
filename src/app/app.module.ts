import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';

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
  MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MAT_DATE_LOCALE, MatPaginatorIntl
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
import { FileUploadModalComponent } from './component/file-upload-modal/file-upload-modal.component';
import { ChartsModule } from 'ng2-charts';
import { HomeComponent } from './component//home/home.component';
import { DoughnutChartComponent } from './component/doughnut-chart/doughnut-chart.component';
import localePTBRExtra from '@angular/common/locales/extra/pt';
import localePTBR from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { EvolucaoChartComponent } from './component/evolucao-chart/evolucao-chart.component';
import { SorteioComponent } from './component/sorteio/sorteio.component';

registerLocaleData(localePTBR, 'pt-BR', localePTBRExtra);
export const customCurrencyMaskConfig = {
  align: 'left',
  allowNegative: false,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.',
  nullable: true
};

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
    FileUploadModalComponent,
    HomeComponent,
    DoughnutChartComponent,
    CurrencyFormatPipe,
    EvolucaoChartComponent,
    SorteioComponent,
  ],
  entryComponents: [
    TransacaoModalComponent,
    ContaModalComponent,
    ResponsavelModalComponent,
    FileUploadModalComponent
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
    NgxIndexedDBModule.forRoot(new IndexedDBConfigService()),
    // Charts
    ChartsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    CurrencyFormatPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
