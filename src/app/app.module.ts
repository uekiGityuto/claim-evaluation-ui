import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DetailComponent } from './component/detail/detail.component';
import { ListComponent } from './component/list/list.component';
import { ErrorComponent } from './component/error/error.component';
import { TooltipDirective } from './directive/tooltip.directive';

@NgModule({
  declarations: [
    AppComponent,
    DetailComponent,
    ListComponent,
    ErrorComponent,
    TooltipDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSortModule,
    MatRadioModule,
    MatTooltipModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
