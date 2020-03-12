import { Injectable, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Modal } from '../model/Modal.model';

/**
 * Modal Service
 * @author SKK231099 李
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {
    public model: Modal;

  // データの変更を通知するためのオブジェクト
  private subject = new Subject<string>();

  // Subscribe するためのプロパティ( これでイベント通知をキャッチする )
  public ob = this.subject.asObservable();

  constructor() {
      this.model = new Modal();
  }

  public submitModal(param: any): void {
    this.model.memo = param.memo.value;
    this.subject.next(JSON.stringify(this.model));
  }

  public closeModal(): void {
    this.subject.next(JSON.stringify('close'));
  }
}