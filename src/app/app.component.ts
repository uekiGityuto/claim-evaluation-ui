import { Component } from '@angular/core';
import { Result } from './model/Result.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/css/flexbox.css', './app.component.css']
})
export class AppComponent {
  result: Result;

  constructor() {
    this.result = new Result();
  }
}
