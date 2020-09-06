import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserInfoContainerService } from '../service/user-info-container.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userInfo: UserInfoContainerService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userInfo.userId) {
      // Todo: errorページへの遷移を修正
      console.log('errorページに遷移');
      this.router.navigate(['/detail/error']);
      return false;
    }
    return true;
  }
}
