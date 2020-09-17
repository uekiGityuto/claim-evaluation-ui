import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserInfoContainerService } from './service/user-info-container.service'
import { AuthResult } from './model/auth-result';
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

  isError = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private userInfo: UserInfoContainerService
  ) { }

  public ngOnInit(): void {
    // クエリパラメータをセット
    const param = this.getQueryVariable('param');
    const userId = this.getQueryVariable('userId');

    // クエリパラメータがセットされていれば認可処理を実施
    if (param === '' || userId === '') {
      console.log('Queryチェックエラー');
      this.isError = true;
    } else {
      this.authorize(param, userId);
    }
  }

  // クエリパラメータ取得
  getQueryVariable(key: string): string {
    // 文頭「?」を除外
    const queryAll = window.location.search.slice(1);

    let value = '';
    // 各クエリパラメータのkeyと引数を比較し、一致すれば対応するvalueを返す
    queryAll.split('&').forEach(query => {
      const queryPair = query.split('=');
      if (queryPair[0] === key) {
        value = queryPair[1];
      }
    });
    return value;
  }

  // 認可処理
  authorize(param: string, userId: string): void {
    // HTTPリクエストの各情報セット
    const authUri = environment.auth_url;
    const params = { param: param, userId: userId };

    this.httpClient.get(authUri, {
      params: params
    }).subscribe(
      (response: AuthResult) => {
        console.log('認可OK');
        this.userInfo.userId = response.userId;
        this.userInfo.authFlag = response.authFlag;

        // スコア詳細画面を表示
        this.displayDetail(response.claimNumber);
      }, error => {
        console.log('認可NG');
        this.isError = true;
      }
    );
  }

  // スコア詳細画面表示
  displayDetail(claimNumber: string): void {
    console.log('スコア詳細画面を表示');
    this.router.navigate(['/detail', claimNumber]);
  }

}
