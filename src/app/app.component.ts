import { Component, Type, OnInit } from '@angular/core';
import { ModalComponent } from './component/modal/modal.component';
import { Result } from './model/Result.model';
import { Subscription } from 'rxjs';
import { ModalService } from './service/modal-service';
import { Modal } from './model/Modal.model';
import { Plugins } from 'protractor/built/plugins';
import { ObservableClientService } from './service/ObservableClientService';
import { User } from './model/User.model';
import { environment } from '../environments/environment';
import { Session } from 'protractor';

/**
 * Main App Component
 * @author SKK231099 李
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/css/flexbox.css', './app.component.css']
})
export class AppComponent implements OnInit {
  public result: Result;
  public modalCmpt: any;
  public subscription: Subscription;

  constructor(public ms: ModalService,
              private ob: ObservableClientService) {
    this.result = new Result();
    this.modalCmpt = null;
  }

  public openModal(model: Modal) {
    this.modalCmpt = ModalComponent;
    this.ms.model = model;
  }

  public closeModal() {
    this.subscription.unsubscribe();
  }

  public ngOnInit(): void {
    // Dummy user data
    const user = new User('GNO0971', 'Yamamoto naoko', '1234', 4);
    this.samlSuccess(JSON.stringify(user));
  }

  private samlSuccess(data: string) {
    sessionStorage.setItem('user', data);
  }

  private samlError() {
    // setTimeout(() => window.location.replace(process.env.saml_url), 3000);
  }

  private logout() {
    sessionStorage.clear();
  }
}
