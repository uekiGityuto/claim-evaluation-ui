import { Component, Type, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Result } from './model/Result.model';
import { ObservableClientService } from './service/observable-client.service';
import { UserInfoContainerService } from './service/user-info-container.service';
import { environment } from '../environments/environment';

/**
 * Main App Component
 * @author SKK231527 植木
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  uri = environment.restapi_url;
  isError = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private clientService: ObservableClientService,
    private userInfo: UserInfoContainerService
  ) { }

  public ngOnInit(): void {
    // クエリパラメータをセット
    // const param = this.route.snapshot.queryParamMap.get('param');
    // const userId = this.route.snapshot.queryParamMap.get('userId');
    // Todo: 良い方法があれば修正（<router-outlet>の外ではActivatedRouteが使えない）
    const param = this.getQueryVariable('param');
    const userId = this.getQueryVariable('userId');

    if (param != null && param.length > 0) {
      this.auth(param, userId);
    } else {
      console.log('クエリパラメータにparamをセットして下さい');
      this.auth(param, userId);
    }
  }

  // 認可処理
  auth(param: string, userId: string): void {
    // 認可処理用のuri作成
    const authUri = this.uri + 'authorization?param=' + param + '&userId=' + userId;

    // 認可処理を実施
    const observer = this.clientService.rxClient(authUri, 'get', null);
    observer.subscribe((result: Result) => {
      if (result.isSuccess) {
        console.log('認可OK');
        this.userInfo.authFlag = result.data['authFlag'.toString()];
        this.userInfo.userId = result.data['userId'.toString()];
        // スコア詳細画面を表示
        // Todo: ngOnInit()で実施するように修正
        this.displayDetail(result.data['claimNumber'.toString()]);
      } else {
        // Todo: errorページへの遷移を修正
        console.log('認可NG');
        this.isError = true;
        // this.router.navigate(['/detail/error']);
      }
    });
  }

  // スコア詳細画面を表示
  displayDetail(claimNumber: string): void {
    console.log('スコア詳細画面を表示');
    this.router.navigate(['/detail', claimNumber]);
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
