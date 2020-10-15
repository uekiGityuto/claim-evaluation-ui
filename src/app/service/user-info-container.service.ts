import { Injectable } from '@angular/core';

/**
 * ユーザ情報を保管するためのsingletonなサービス
 * @author SKK231527 植木
 */
@Injectable({
  providedIn: 'root'
})
export class UserInfoContainerService {
  authFlag: boolean;
  userId: string;

  constructor() {
    this.authFlag = false;
    this.userId = '';
  }
}
