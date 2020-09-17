import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthResult } from '../model/auth-result';
import { environment } from '../../environments/environment';

// TODO:  中山さんに確認後にファイル削除
@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  // 外部が変更されないようにprivateととする
  private _authFlag: boolean;
  private _userId: string;
  private _claimNumber: string;

  constructor(private httpClient: HttpClient) {
  }

  get authFlag(): boolean {
    return this._authFlag;
  }

  get userId(): string {
    return this._userId;
  }

  get claimNumber(): string {
    return this._claimNumber;
  }

  // 書いてみたもののclaimNumberを返す方法がなかったです。。。
  authorize(param: string, userId: string):void {
    // HTTPリクエストの各情報セット
    const authUri = environment.auth_url;
    const params = { param: param, userId: userId };

    this.httpClient.get(authUri, {
      params: params
    }).subscribe(
      (response: AuthResult) => {
        console.log('認可OK');
        this._userId = response.userId;
        this._authFlag = response.authFlag;
        this._claimNumber = response.claimNumber;
      }, error => {
        console.log('認可NG');
      }
    );
  }
}
