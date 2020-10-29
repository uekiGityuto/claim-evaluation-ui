import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailComponent } from './component/detail/detail.component';
import { ListComponent } from './component/list/list.component';
import { ErrorComponent } from './component/error/error.component';

import { AuthorityGuard } from './guard/authority.guard';

const routes: Routes = [
  { path: 'detail/:claimNumber', component: DetailComponent  },
  { path: 'list/error', component: ErrorComponent },
  { path: 'list', component: ListComponent, canActivate: [AuthorityGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
