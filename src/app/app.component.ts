import { Component, Type, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Result } from './model/Result.model';
// import { AuthResult } from './model/AuthResult.model';
import { ObservableClientService } from './service/ObservableClientService';
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

  // authResult = new AuthResult();
  uri = environment.restapi_url;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private clientService: ObservableClientService,
    private userInfo: UserInfoContainerService
  ) { }

  public ngOnInit(): void {
    // 認可処理用
    let param = '';
    let userId = '';

    // 暗号化パラメータ(param)が存在すれば、認可処理を実施
    param = this.route.snapshot.queryParamMap.get('param');
    userId = this.route.snapshot.queryParamMap.get('userId');
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
        // Todo: errorページに遷移
        console.log('認可NG');
      }
    });
  }

  // スコア詳細画面を表示
  displayDetail(claimNumber: string): void {
    console.log('スコア詳細画面を表示');
    this.router.navigate(['/detail', claimNumber]);
  }

}
