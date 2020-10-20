import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Scores } from '../model/scores/scores';

import { ScoresClientService } from './scores-client.service';

/**
 * DetailComponentへのルーティング前に呼び出されるリゾルバ
 * @author SKK231527 植木
 */
@Injectable({
  providedIn: 'root'
})
export class DetailResolverService implements Resolve<any> {

  constructor(private client: ScoresClientService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const claimNumber = route.paramMap.get('claimNumber');
    try {
      const response = this.client.post(claimNumber);
      console.log('受信確認');
      console.log(response)
      return response;
    } catch(e) {
      this.router.navigate(['/list/error']);
    }
  }
}
