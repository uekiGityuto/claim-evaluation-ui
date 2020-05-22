import { Component, Type, OnInit } from '@angular/core';
import { ModalComponent } from './component/modal/modal.component';
import { Result } from './model/Result.model';
import { Subscription } from 'rxjs';
import { ModalService } from './service/modal-service';
import { Modal } from './model/Modal.model';
import { Plugins } from 'protractor/built/plugins';

/**
 * Main App Component
 * @author SKK231099 李
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/css/flexbox.css', './app.component.css']
})
export class AppComponent {
  public result: Result;
  public modalCmpt: any;
  public subscription: Subscription;

  constructor(public ms: ModalService) {
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
}
