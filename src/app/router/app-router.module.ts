import { HomeComponent } from './../component/home/home.component';
import { ContaComponent } from '../component/conta/conta.component';
import { TransacaoComponent } from '../component/transacao/transacao.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { ResponsavelComponent } from '../component/responsavel/responsavel.component';
import {SorteioComponent} from '../component/sorteio/sorteio.component';

const routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'transacoes', component: TransacaoComponent },
  { path: 'contas', component: ContaComponent },
  { path: 'responsaveis', component: ResponsavelComponent },
  { path: 'sorteio/:encrypt', component: SorteioComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: false }
    ),
  ],
  exports: [RouterModule]
})
export class AppRouterModule { }
