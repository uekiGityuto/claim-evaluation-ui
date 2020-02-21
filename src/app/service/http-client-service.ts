import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HttpClientService {
    // private httpOptions: any = {
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json'
    //     }),
    //     body: null
    // };

    constructor(private http: HttpClient) {
    // `Authorization` に `Bearer トークン` をセットする
    // this.setAuthorization('my-auth-token');
    }

    public get(uri, method, param={}):any{
        return this.http
            .request(
                method,
                uri, 
                {
                    responseType:"json",
                    params: param
                })
    }

    // private errorHandler(err) {
    //     console.log('Error occured.', err);
    //     // if(err.status === 401) {
    //     // }
    //     return Promise.reject(err.message || err);
    // }

    // public setAuthorization(token: string = null): void {
    //     if (!token) {
    //       return;
    //     }
    //     const bearerToken: string = `Bearer ${token}`;
    //     this.httpOptions.headers = this.httpOptions.headers.set('Authorization', bearerToken);
    //   }
}
