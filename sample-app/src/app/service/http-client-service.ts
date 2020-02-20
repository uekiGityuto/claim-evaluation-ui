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

    // public get(uri, method): Promise<any>{
    public get(uri, method, params={}):any{
        return this.http
            .request(
                method,
                uri, 
                {
                    responseType:"json",
                    params
                })
        // let promise = new Promise((resolve, reject) => {
            // let rtnHttp;
            // switch(method) {
            //     case "get":
            //         rtnHttp = this.http.get(uri);
            //         break;
            //     case "post":
            //         rtnHttp = this.http.post(uri, this.httpOptions);
            //         break;
            // }
            
            // rtnHttp.toPromise()
            //     .then((res) => {
            //         let results = res.json().results;
            //         resolve(results);
            //     }).catch(this.errorHandler);
            // rtnHttp.subscribe((result:Card) => {
            //     this.results = result;
            // });
            // this.results = rtnHttp.map(data => __values(data))
        // });
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
