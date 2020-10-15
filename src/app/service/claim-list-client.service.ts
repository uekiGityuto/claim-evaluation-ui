import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ClaimList } from '../model/claim-list/claim-list';
import { TargetClaimList } from '../model/target-claim-list/target-claim-list';

import { environment } from '../../environments/environment';

/**
 * A05事案一覧照会アプリにリクエストするサービス
 * @author SKK231527 植木
 */
@Injectable({
  providedIn: 'root'
})
export class ClaimListClientService {

  constructor(private httpClient: HttpClient) { }

  get(): Observable<Object> {
    // HTTPリクエストの各情報セット
    const authUri = environment.transition_url;

    // 認可処理を実施し、実施結果を呼び出し元に返す
    return this.httpClient.get(authUri);
  }

  post(params: TargetClaimList): Observable<ClaimList> {
    // HTTPリクエストの各情報セット
    const claimsUri = environment.claims_url;
    const headers = { 'Content-Type': 'application/json' };

    // 事案一覧を取得し、取得結果を呼び出し元に返す
    return this.httpClient.post<ClaimList>(claimsUri, params, { headers: headers });
  }

}
