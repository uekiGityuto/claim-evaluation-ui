import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take, map, catchError } from 'rxjs/operators';

import { Scores } from '../model/scores/scores';

import { environment } from '../../environments/environment';

/**
 * A03スコア詳細照会アプリにリクエストするサービス
 * @author SKK231527 植木
 */
@Injectable({
  providedIn: 'root'
})
export class ScoresClientService {

  constructor(private httpClient: HttpClient) { }

  post(claimNumber: string): Observable<Scores> {
    // HTTPリクエストの各情報セット
    const scoresUri = environment.scores_url;
    const params = { claimNumber: claimNumber };
    const headers = { 'Content-Type': 'application/json' };

    // スコア詳細を取得し、取得結果を呼び出し元に返す
    return this.httpClient.post<Scores>(scoresUri, params, { headers: headers });
  }

}
