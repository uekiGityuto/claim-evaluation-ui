import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../model/Result.model';

@Injectable({
    providedIn: 'root'
})
export class ObservableClientService {
    private result: Result;

    constructor(private http: HttpClient) {
        this.result = new Result();
    }

    public rxClient(uri, method, param= {}): Observable<any> {
        return new Observable(observer => {
            const rtn = this.http.request(method,
                            uri,
                            {
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
                err => {
                    this.result.isSuccess = false;
                    this.result.errMsgList.push({key: 'rxClientError', value: '通信エラー'});
                    observer.next(this.result);
                    observer.complete();
                    // if(err.status === 401) {'権限がありません。'}
                    // if(err.status === 403) {'サーバーから拒否されました。'}
                    // if(err.status === 407) {'Proxy認証が必要です。'}
                    // if(err.status === 500) {'内部サーバーエラー'}
                    // if(err.status === 503) {'サービスを利用できません。暫く時間をおいてから再度接続してください。'}
                });
        });
    }

    // public setAuthorization(token: string = null): void {
    //     if (!token) {
    //       return;
    //     }
    //     const bearerToken: string = `Bearer ${token}`;
    //     this.httpOptions.headers = this.httpOptions.headers.set('Authorization', bearerToken);
    //   }
}
