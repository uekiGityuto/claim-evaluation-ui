import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthResult } from '../model/auth-result';
import { environment } from '../../environments/environment';

/**
 * A02認可処理アプリにリクエストするサービス
 * @author SKK231527 植木
 */
@Injectable({
  providedIn: 'root'
})
export class AuthorizationClientService {

  constructor(private httpClient: HttpClient) {
  }

  get(param: string, userId: string): Observable<AuthResult> {
    // HTTPリクエストの各情報セット
    const authUri = environment.authorize_url;
    const params = { param: param, userId: userId };

    return this.httpClient.get<AuthResult>(authUri, { params: params });
  }
}
