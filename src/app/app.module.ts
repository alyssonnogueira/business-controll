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

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { HomeComponent } from './component/home/home.component';
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
