import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {LancamentosComponent} from '../lancamentos/lancamentos.component';
import {MenuComponent} from '../menu/menu.component';

const routes = [
  { path: '', component: LancamentosComponent },
  { path: 'lancamentos', component: LancamentosComponent }
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
