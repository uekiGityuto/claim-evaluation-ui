import { Component } from '@angular/core';
import { HttpClientService } from './service/http-client-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/css/flexbox.css', './app.component.css']
})
export class AppComponent {
  title = 'Sample App Hello';
}
