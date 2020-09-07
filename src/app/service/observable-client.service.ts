import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../model/result.model';
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
      'Authorization': environment.pre_token + environment.token
    };
  }

  public rxClient(uri, method = 'get', param = {}): Observable<any> {
    this.result = new Result();
    param = this.toParamObject(param);
    this.result.errMsgList = [];
    return new Observable(observer => {
      const rtn = this.http.request(method,
        uri,
        {
          headers: this.headers,
          responseType: 'json',
          params: param
        });
      rtn.subscribe(
        data => {
          this.result.data = data;
          this.result.isSuccess = true;
          observer.next(this.result);
          observer.complete();
        },
        err => {
          this.result.isSuccess = false;
          if (err.status === 401) {
            this.result.errMsgList.push({ key: '401', value: environment.err_401 });
          } else if (err.status === 403) {
            this.result.errMsgList.push({ key: '403', value: environment.err_403 });
          } else if (err.status === 404) {
            this.result.errMsgList.push({ key: '404', value: environment.err_404 });
          } else if (err.status === 500) {
            this.result.errMsgList.push({ key: '500', value: environment.err_500 });
          } else if (err.status === 504) {
            this.result.errMsgList.push({ key: '504', value: environment.err_504 });
          } else if (err.status === 510) {
            this.result.errMsgList.push({ key: '510', value: environment.err_510 });
          } else if (err.status === 520) {
            this.result.errMsgList.push({ key: '520', value: environment.err_520 });
          } else if (err.status === 521) {
            this.result.errMsgList.push({ key: '521', value: environment.err_521 });
          } else if (err.status === 522) {
            this.result.errMsgList.push({ key: '522', value: environment.err_522 });
          } else if (err.status === 523) {
            this.result.errMsgList.push({ key: '523', value: environment.err_523 });
          } else if (err.status === 524) {
            this.result.errMsgList.push({ key: '524', value: environment.err_524 });
          } else if (err.status === 525) {
            this.result.errMsgList.push({ key: '525', value: environment.err_525 });
          } else if (err.status === 526) { this.result.errMsgList.push({ key: '526', value: environment.err_526 }); }
          observer.next(this.result);
          observer.complete();
        });
    });
  }

  private toParamObject(obj = {}) {
    if (!obj) { return {}; }
    for (const key of Object.keys(obj)) {
      if (key.toLocaleLowerCase().indexOf('date') > -1 || key.toLocaleLowerCase().indexOf('time') > -1) {
        if (obj[key]) {
          obj[key] = this.formatDatetime(new Date(obj[key]), 'yyyy-mm-ddThh:ii:ss.SSS');
        } else {
          delete obj[key];
        }
      }
    }
    const paramObj = JSON.parse(JSON.stringify(obj));
    return paramObj;
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
