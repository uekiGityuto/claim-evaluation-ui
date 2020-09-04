import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailComponent } from './component/detail/detail.component';
import { ListComponent } from './component/list/list.component';

const routes: Routes = [
  { path: '', component: DetailComponent },
  { path: 'detail/:id', component: DetailComponent },
  { path: 'list', component: ListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
