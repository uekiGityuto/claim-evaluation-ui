import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../service/modal-service';
import { Modal } from '../../model/Modal.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  public model: Modal;

  constructor(private ms: ModalService) {
    this.model = new Modal();
    this.model.setModel(ms.model);
  }

  public ngOnInit(): void {
    const modalElement: HTMLInputElement = <HTMLInputElement>document.getElementById('modal-dialog');
    modalElement.style.width = this.model.width + 'em';
    modalElement.style.height = this.model.height + 'em';
    const header = <HTMLInputElement>document.getElementById('modal-header');
    header.style.display = this.ms.model.isHeader ? '' : 'none';
    const contents = <HTMLInputElement>document.getElementById('modal-contents');
    contents.style.display = this.ms.model.isMemo ? '' : 'none';
  }

  public ngOnDestroy(): void {
  }

  public onSubmit(param: any): void {
    this.ms.submitModal(param);
  }
  
  public close(): void {
    this.ms.closeModal();
  }
  
}
