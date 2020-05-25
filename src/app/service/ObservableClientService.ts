import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../model/Result.model';
import { environment } from '../../environments/environment';

/**
 * 非同期通信ClientService
 * @author SKK231099 李
 */
@Injectable({
    providedIn: 'root'
})
export class ObservableClientService {
    private result: Result;
    private headers: any;

    constructor(private http: HttpClient) {
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + environment.token
        };
    }

    public rxClient(uri, method= 'get', param= {}): Observable<any> {
        this.result = new Result();
        param = this.toParamObject(param);
        return new Observable(observer => {
            const rtn = this.http.request(method,
                            uri,
                            {
                                headers: this.headers,
                                responseType: 'json',
                                params: param
                            });
            // rtn.map(res => res.json())
            rtn.subscribe(
                data => {
                    this.result.data = data;
                    this.result.isSuccess = true;
                    observer.next(this.result);
                    observer.complete();
                },
                // response => {
                //     this.result.data = response.;
                //     this.result.isSuccess = true;
                //     observer.next(this.result);
                //     observer.complete();
                // },
                err => {
                    this.result.isSuccess = false;
                    this.result.errMsgList.push({key: 'rxClientError', value: '通信エラー'});
                    observer.next(this.result);
                    observer.complete();
                    if(err.status === 401) {console.log('権限がありません。')}
                    if(err.status === 403) {console.log('サーバーから拒否されました。')}
                    // if(err.status === 407) {'Proxy認証が必要です。'}
                    // if(err.status === 500) {'内部サーバーエラー'}
                    // if(err.status === 503) {'サービスを利用できません。暫く時間をおいてから再度接続してください。'}
                });
        });
    }

    private toParamObject(obj= {}) {
      if (!obj) { return {}; }
      for (const key of Object.keys(obj)) {
        if (key.toLocaleLowerCase().indexOf('date') > -1 || key.toLocaleLowerCase().indexOf('time') > -1) {
          if (obj[key]) {
            obj[key] = this.formatDatetime(new Date(obj[key]), 'yyyy-mm-ddThh:ii:ss.SSSZ');
          } else {
            delete obj[key];
          }
        }
      }
      return JSON.parse(JSON.stringify(obj));
    }

    private formatDatetime(date: Date, format: string) {
      const padStart = (value: number): string => value.toString().padStart(2, '0');
      return format
          .replace(/yyyy/g, padStart(date.getFullYear()))
          .replace(/dd/g, padStart(date.getDate()))
          .replace(/mm/g, padStart(date.getMonth() + 1))
          .replace(/hh/g, padStart(date.getHours()))
          .replace(/ii/g, padStart(date.getMinutes()))
          .replace(/ss/g, padStart(date.getSeconds()))
          .replace(/SSS/g, padStart(date.getMilliseconds()));
   }
}
