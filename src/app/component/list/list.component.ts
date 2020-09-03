import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

// import { SearchForm } from '../../model/SearchForm.model';
import { Result } from '../../model/Result.model';
import { environment } from '../../../environments/environment';
import { ObservableClientService } from '../../service/ObservableClientService';

interface SearchForm {
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
  claims: Claim[];
  order: string;
  fromPages: number;
  toPages: number;
  totalNumber: number;

  // 検索用
  param: SearchForm;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient,
    private clientService: ObservableClientService) { }

  ngOnInit(): void {
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

  // 検索処理
  search(): void {
    // POSTボディ部作成
    console.log(this.searchControl.value);
    const { departmentOrBaseRadio, departmentOrBase, ...rest } = this.searchControl.value;
    this.param = { ...rest };
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
    console.log('POSTボディ部', this.param);
    console.log('POSTボディ部', JSON.stringify(this.param));

    // 事案一覧取得
    this.searchList(this.param);
  }

  searchList(param: SearchForm): void {
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
      }
    });
  }

  // ソート処理
  listSort(sort: Sort) {
    // console.log(this.param);
    this.param.labelType = environment[sort.active];
    this.param.order = environment[sort.direction];
    // console.log(this.param);
    // 事案一覧取得
    this.searchList(this.param);
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
      }
      console.log('認可OK');
    });
  }

}
