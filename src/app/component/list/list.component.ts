import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

import { Result } from '../../model/Result.model';
import { environment } from '../../../environments/environment';
import { ObservableClientService } from '../../service/ObservableClientService';
import { UserInfoContainerService } from '../../service/user-info-container.service';

interface SearchForm {
  userId: string;
  claimNumber: string;
  claimCategory: string[];
  insuranceKindInfo: string[];
  fromLossDate: string;
  toLossDate: string;
  insuredNameKana: string;
  insuredNameKanji: string;
  contractorNameKana: string;
  contractorNameKanji: string;
  department: string;
  base: string;
  labelType: string;
  order: string;
  displayFrom: string;
}

interface ClaimList {
  claims: Claim[];
  order: string;
  fromPages: number;
  toPages: number;
  totalNumber: number;
}

interface Claim {
  claimNumber: string;
  insuredName: string;
  contractorName: string;
  department: string;
  base: string;
  insuranceKind: string;
  lastUpdateDate: Date;
  lossDate: Date;
  claimCategory: string;
}

/**
 * List Component
 * @author SKK231527 植木
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  searchControl: FormGroup;
  myControl: FormGroup;
  message: string;
  uri = environment.restapi_url;

  // ビュー表示用
  userId: string;
  claims: Claim[];
  order: string;
  fromPages: number;
  toPages: number;
  totalNumber: number;

  // 検索用
  param: SearchForm;

  constructor(private route: ActivatedRoute,
    private clientService: ObservableClientService,
    private userInfo: UserInfoContainerService
  ) { }

  ngOnInit(): void {
    // ユーザ情報取得
    this.userId = this.userInfo.userId;

    // 認可処理を実施
    this.auth();

    // FormControlインスタンス作成
    this.searchControl = new FormGroup({
      claimNumber: new FormControl(''),
      claimCategory: new FormControl(''),
      insuranceKindInfo: new FormControl(''),
      fromLossDate: new FormControl(''),
      toLossDate: new FormControl(''),
      insuredNameKana: new FormControl(''),
      insuredNameKanji: new FormControl(''),
      contractorNameKana: new FormControl(''),
      contractorNameKanji: new FormControl(''),
      departmentOrBaseRadio: new FormControl(''),
      departmentOrBase: new FormControl('')
    });
    this.claims = [];
  }

  // 認可処理
  auth(): void {
    // 認可処理用のuri作成
    const authUri = this.uri + 'claimList';

    // 認可処理を実施
    const observer = this.clientService.rxClient(authUri, 'get', null);
    observer.subscribe((result: Result) => {
      if (!result.isSuccess) {
        // Todo: errorページに遷移
        console.log('認可NG');
      }
      console.log('認可OK');
    });
  }

  // 検索処理
  search(): void {
    // POSTボディ部に検索フォームの内容をディープコピー
    console.log(this.searchControl.value);
    const { departmentOrBaseRadio, departmentOrBase, ...rest } = this.searchControl.value;
    // this.param = { ...rest };
    this.param = JSON.parse(JSON.stringify(rest));

    // POSTボディ部の残り（検索フォーム以外の内容）をセット
    this.param.userId = this.userId;
    if (departmentOrBaseRadio === 'department') {
      this.param.department = departmentOrBase;
      this.param.base = '';
    } else if (departmentOrBaseRadio === 'base') {
      this.param.department = '';
      this.param.base = departmentOrBase;
    } else {
      this.param.department = '';
      this.param.base = '';
    }
    this.param.labelType = environment.lossDate;
    this.param.order = environment.desc;
    this.param.displayFrom = '1';
    console.log('POSTボディ部', JSON.stringify(this.param));

    // 事案一覧取得
    this.searchList(JSON.stringify(this.param));
  }

  // ソート処理
  listSort(sort: Sort) {
    // console.log(this.param);
    this.param.labelType = environment[sort.active];
    this.param.order = environment[sort.direction];
    // console.log(this.param);
    // 事案一覧取得
    this.searchList(JSON.stringify(this.param));
  }

  // 1ページ戻る処理
  previous(): void {
    if (this.fromPages - 10 > 0) {
      this.param.displayFrom = String(this.fromPages - 10);
    } else {
      this.param.displayFrom = '1';
    }
    // 事案一覧取得
    this.searchList(JSON.stringify(this.param));
  }

  // 1ページ進む処理
  next(): void {
    this.param.displayFrom = String(this.toPages + 1);
    // 事案一覧取得
    this.searchList(JSON.stringify(this.param));
  }

  // 開始位置指定して検索処理
  update(): void {
    this.param.displayFrom = String(this.fromPages);
  }

  // 事案一覧取得処理
  searchList(param: string): void {
    const claimUri = this.uri + 'claims';

    // 事案一覧を取得
    // const observer = this.clientService.rxClient(claimUri, 'post', param);// 本番用
    const observer = this.clientService.rxClient(claimUri, 'get', null);// モック用
    observer.subscribe((result: Result) => {
      if (result.isSuccess) {
        console.log('result.data', result.data);
        this.claims = result.data['claim'.toString()];
        this.order = result.data['order'.toString()];
        this.fromPages = result.data['fromPages'.toString()];
        this.toPages = result.data['toPages'.toString()];
        this.totalNumber = result.data['totalNumber'.toString()];
      } else {
        // Todo: errorページに遷移
        console.log('errorページに遷移');
      }
    });
  }


}
