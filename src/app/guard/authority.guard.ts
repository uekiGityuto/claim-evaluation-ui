import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserInfoContainerService } from '../service/user-info-container.service'

/**
 * ListComponentへのルーティング前に呼び出されるガード
 * @author SKK231527 植木
 */
@Injectable({
  providedIn: 'root'
})
export class AuthorityGuard implements CanActivate {

  constructor(private userInfo: UserInfoContainerService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.userInfo.authFlag) {
      console.log('認可エラーページに遷移');
      this.router.navigate(['/list/error']);
      return false;
    }
    return true;
  }
}
