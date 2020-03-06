import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ExampleComponent } from './component/example/example.component';
import { Example2Component } from './component/example2/example2.component';
import { DetailComponent } from './component/detail/detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './component/list/list.component';
import { ObservableClientService } from './service/ObservableClientService';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterPipe } from '../app/module/filter.pipe';
import { ModalComponent } from './component/modal/modal.component';

const routes: Routes = [
  { path: '', component: ListComponent},
  { path: 'detail', component: DetailComponent},
  { path: 'example', component: ExampleComponent },
  { path: 'example2', component: Example2Component }
];

@NgModule({
  declarations: [
    AppComponent,
    ExampleComponent,
    Example2Component,
    DetailComponent,
    ListComponent,
    FilterPipe,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true }
    ),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  providers: [
    ObservableClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
