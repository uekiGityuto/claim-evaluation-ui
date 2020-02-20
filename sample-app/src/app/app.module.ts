import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientService } from './service/http-client-service';
import { ExampleComponent } from './example/example.component';
import { Example2Component } from './example2/example2.component';
import { FirstComponent } from './first/first.component';
import { DetailComponent } from './detail/detail.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

const routes:Routes = [
  { path: '', component: FirstComponent},
  { path: 'detail', component: DetailComponent},
  { path: 'example', component: ExampleComponent },
  { path: 'example2', component: Example2Component }
]

@NgModule({
  declarations: [
    AppComponent,
    ExampleComponent,
    Example2Component,
    FirstComponent,
    DetailComponent
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
    ReactiveFormsModule
  ],
  providers: [HttpClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
