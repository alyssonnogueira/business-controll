import { TransacaoComponent } from '../transacao/transacao.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {MenuComponent} from '../menu/menu.component';

const routes = [
  { path: '', component: TransacaoComponent },
  { path: 'transacao', component: TransacaoComponent }
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
