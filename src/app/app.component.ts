import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { UserInfoContainerService } from './service/user-info-container.service';
import { AuthorizationClientService } from './service/authorization-client.service';

/**
 * ルートコンポーネント
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
    private title: Title,
    private client: AuthorizationClientService,
    private userInfo: UserInfoContainerService
  ) { }

  public ngOnInit(): void {
    // HTMLのTitleタグの内容を更新
    this.title.setTitle('スコア詳細: ');

    // クエリパラメータをセット
    const param = this.getQueryVariable('param');
    const userId = this.getQueryVariable('Uid');

    // クエリパラメータがセットされていれば認可処理を実施
    if (param === '' || userId === '') {
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
    // 認可処理を実施して取得結果をセット
    this.client.get(param, userId).subscribe(
      response => {
        this.userInfo.userId = response.userId;
        this.userInfo.authFlag = response.authFlag;

        // スコア詳細画面を表示
        this.displayDetail(response.claimNumber);
      }, error => {
        this.isError = true;
      }
    );
  }

  // スコア詳細画面表示
  displayDetail(claimNumber: string): void {
    this.router.navigate(['/detail', claimNumber]);
  }

}
