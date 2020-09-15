import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserInfoContainerService } from '../service/user-info-container.service';
import { ObservableClientService } from '../service/observable-client.service';
import { environment } from '../../environments/environment';
import { Result } from '../model/Result.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  claimNumber: string;

  constructor(private userInfo: UserInfoContainerService,
    private clientService: ObservableClientService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log('authorization start');
    const param = this.getQueryVariable('param');
    const userId = this.getQueryVariable('Uid');

    if(!(this.queryCheck(param, userId))) {
      console.log('queryチェックエラー')
      this.router.navigate(['/list/error']);
      return false;
    };

    const uri = environment.auth_url;
    this.auth(param, userId, uri);
    console.log('authorization end');
    return true;
  }

  queryCheck(param: string, userId: string): boolean {
    if (param === null || param.length === 0) {
      console.log('クエリパラメータにparamをセットして下さい');
      return false;
    };
    if (userId === null || userId.length === 0) {
      console.log('クエリパラメータにUidをセットして下さい');
      return false;
    };
    return true;
  }

  // 認可処理
  auth(param: string, userId: string, uri: string) {
    // 認可処理用のuri作成
    const authUri = uri + '?param=' + param + '&userId=' + userId;

    // 認可処理を実施
    const observer = this.clientService.rxClient(authUri, 'get', null);
    observer.subscribe((result: Result) => {
      if (result.isSuccess) {
        console.log('認可OK');
        this.userInfo.authFlag = result.data['authFlag'.toString()];
        this.userInfo.userId = result.data['userId'.toString()];
        this.claimNumber = result.data['claimNumber'.toString()];
        this.router.navigate(['/detail', this.claimNumber]);
      }
      console.log('認可NG');
    });
  }

  getQueryVariable(key): string {
    // 文頭?を除外
    const queryAll = window.location.search.slice(1);
    let variable = '';

    // クエリ文字列を & で分割して処理
    queryAll.split('&').forEach(query => {
      // = で分割してkeyが引数と一致すれば対応する値を返す
      const queryPair = query.split('=');
      if (queryPair[0] === key) {
        variable = queryPair[1];
      }
    });
    return variable;
  }
}
