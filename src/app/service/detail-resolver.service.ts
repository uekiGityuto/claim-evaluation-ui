import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Scores } from '../model/scores/scores';

import { ScoresClientService } from './scores-client.service';

/**
 * DetailComponentへのルーティング前に呼び出されるリゾルバ
 * @author SKK231527 植木
 */
@Injectable({
  providedIn: 'root'
})
export class DetailResolverService implements Resolve<Scores> {

  constructor(private client: ScoresClientService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Scores> {
    const claimNumber = route.paramMap.get('claimNumber');
    return this.client.post(claimNumber);
  }
}
