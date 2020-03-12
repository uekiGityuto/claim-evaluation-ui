import { Component, Type, OnInit } from '@angular/core';
import { ModalComponent } from './component/modal/modal.component';
import { Result } from './model/Result.model';
import { Subscription } from 'rxjs';
import { ModalService } from './service/modal-service';
import { Modal } from './model/Modal.model';

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
  public modal: any;
  private subscription: Subscription;

  constructor(public ms: ModalService) {
    this.result = new Result();
    this.modal = null;
  }

  public openModal(model: Modal, callback: FunctionStringCallback, cmpt: any) {
    this.modal = ModalComponent;
    this.ms.model = model;
    this.subscription = this.ms.ob.subscribe(
      (param) => {
        const result = JSON.parse(param);
        if (result != 'close') {
          this.ms.model.memo = (<Modal>result).memo;
          callback(param);
        }
        this.modal = null;
        this.closeModal();
      }
    );
  }

  public closeModal() {
    this.subscription.unsubscribe();
  }
}
