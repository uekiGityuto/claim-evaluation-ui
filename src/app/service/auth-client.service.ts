import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthResult } from '../model/auth-result';

@Injectable({
  providedIn: 'root'
})
export class AuthClientService {

  constructor(private httpClient: HttpClient) {
  }

  auth(authUri: string): Observable<any> {
      return this.httpClient.get(authUri).pipe(
        map((response: Response) => {
          if (response.status === 403) {
            throw new Error();
          }
        }),
        catchError(error  => throwError(error))
      );
  }

}
