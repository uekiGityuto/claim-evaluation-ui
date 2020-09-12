import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

import { Result } from '../../model/result.model';
import { CategoryClass } from '../../model/category-class.model';
import { environment } from '../../../environments/environment';
import { ObservableClientService } from '../../service/observable-client.service';
import { UserInfoContainerService } from '../../service/user-info-container.service';
import { ClassService } from '../../service/class.service';

// Todo: interfaceをmodelとして切り離すか要検討

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

interface ClaimForDisplay extends Claim {
  // ngClass用
  categoryClass: CategoryClass;
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
  // エラーメッセージ表示用
  // errorSwith = '';
  isError = false;

  // ビュー表示用
  userId: string;
  claims: ClaimForDisplay[];
  order: string;
  fromPages: number; // 入力フォームと同期しているfromPagesの値
  displayFromPages: number; // apiから受け取ったfromPagesの値
  toPages: number;
  totalNumber: number;

  // 検索用
  searchControl: FormGroup;
  uri = environment.restapi_url;
  param: SearchForm;

  // // ツールチップ付与用
  // @ViewChild('tableDatas')
  // elementRef: ElementRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private clientService: ObservableClientService,
    private userInfo: UserInfoContainerService,
    private classService: ClassService
  ) { }

  ngOnInit(): void {
    // ユーザ情報取得
    this.userId = this.userInfo.userId;

    // 認可処理を実施
    this.auth();

    // FormControlインスタンス（検索フォーム）作成
    this.searchControl = new FormGroup({
      claimNumber: new FormControl(''),
      claimCategory: new FormControl(''),
      insuranceKindInfo: new FormControl(''),
      fromLossDate: new FormControl(),
      toLossDate: new FormControl(),
      insuredNameKana: new FormControl('', [Validators.pattern(/^[ァ-ヶー　]+$/)]),
      insuredNameKanji: new FormControl(''),
      contractorNameKana: new FormControl('', [Validators.pattern(/^[ァ-ヶー　]+$/)]),
      contractorNameKanji: new FormControl(''),
      departmentOrBaseRadio: new FormControl(''),
      departmentOrBase: new FormControl('')
    }, {
      // 複数項目に対してのvalidation
      // Todo: 全てのFormControlについて一回ずつ実施してしまうので他に良い方法がないか検討
      validators: [this.isInputMoreThanOne, this.isDepartmentOrBaseRadio]
    });

    // this.fromPages = new FormControl(1, [Validators.required, Validators.min(1), Validators.max(this.totalNumber)]);

    this.claims = [];
  }

  // getter
  get insuredNameKana() { return this.searchControl.value.insuredNameKana; };
  get contractorNameKana() { return this.searchControl.value.contractorNameKana; };

  // 認可処理
  auth(): void {
    // 認可処理用のuri作成
    const authUri = this.uri + 'claimList';

    // 認可処理を実施
    const observer = this.clientService.rxClient(authUri, 'get', null);
    observer.subscribe((result: Result) => {
      if (!result.isSuccess) {
        console.log('認可エラーページに遷移');
        this.router.navigate(['/list/error']);
      }
      console.log('認可OK');
    });
  }

  // 検索処理
  search(): void {
    if (this.searchControl.invalid) {
      console.log('reject search');
    } else {
      // POSTボディ部に検索フォームの内容をディープコピー
      console.log('this.searchControl', this.searchControl.value);
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
    if (this.displayFromPages <= 1) {
      console.log('reject prev');
    } else {
      console.log('accept prev');
      // 1ページ戻ったときのfromPagesをセット
      this.setDisplayFromPages();
      // 事案一覧取得
      this.searchList(JSON.stringify(this.param));
    }
  }

  // 1ページ戻ったときのfromPagesをセット
  setDisplayFromPages(): void {
    if (this.fromPages - 10 > 0) {
      this.param.displayFrom = String(this.fromPages - 10);
    } else {
      this.param.displayFrom = '1';
    }
  }

  // 1ページ進む処理
  next(): void {
    if (this.toPages >= this.totalNumber) {
      console.log('reject next');
    } else {
      console.log('accept next');
      this.param.displayFrom = String(this.toPages + 1);
      // 事案一覧取得
      this.searchList(JSON.stringify(this.param));
    }
  }

  // 開始位置指定して検索処理
  update(): void {
    if (this.fromPages < 0 || this.fromPages > this.totalNumber) {
      console.log('reject update');
    } else {
      console.log('accept update');
      this.param.displayFrom = String(this.fromPages);
      this.searchList(JSON.stringify(this.param));
    }
  }

  // 事案一覧取得処理
  searchList(param: string): void {
    const claimUri = this.uri + 'claims';

    // 事案一覧を取得
    // const observer = this.clientService.rxClient(claimUri, 'post', param);// 本番用
    const observer = this.clientService.rxClient(claimUri, 'get', null);// モック用
    observer.subscribe((result: Result) => {
      if (result.isSuccess) {
        // console.log('result.data', result.data);
        this.isError = false;
        // ビュー要素を取得
        this.claims = [];
        result.data['claim'.toString()].forEach((claim: Claim, i) => {
          const categoryClass = this.classService.setCategoryClass('低', '中', '高', claim.claimCategory);
          this.claims[i] = { ...claim, categoryClass };
        });
        this.order = result.data['order'.toString()];
        this.fromPages = result.data['fromPages'.toString()];
        this.displayFromPages = result.data['fromPages'.toString()];
        this.toPages = result.data['toPages'.toString()];
        this.totalNumber = result.data['totalNumber'.toString()];
      } else {
        console.log('検索エラーメッセージ表示');
        this.isError = true;
        // this.router.navigate(['/list/error']);
      }
    });
  }

  // Todo: validationは切り離すか要検討

  // 一つ以上フォーム入力されているか検証（departmentOrBaseRadioは除外）
  isInputMoreThanOne(control: AbstractControl) {
    // Todo: 何か良い方法を検討
    // （for文で回す等したいがdepartmentOrBaseRadioを除外したいのでこの方法を使用）
    if (!control.value) {
      return { isInputMoreThanOne: { valid: false } };
    }
    if (control.value.claimNumber) {
      return null;
    } else if (control.value.claimCategory) {
      return null;
    } else if (control.value.insuranceKindInfo) {
      return null;
    } else if (control.value.fromLossDate) {
      return null;
    } else if (control.value.toLossDate) {
      return null;
    } else if (control.value.insuredNameKana) {
      return null;
    } else if (control.value.insuredNameKanji) {
      return null;
    } else if (control.value.contractorNameKana) {
      return null;
    } else if (control.value.contractorNameKanji) {
      return null;
    } else if (control.value.departmentOrBase) {
      return null;
    } else {
      return { isInputMoreThanOne: { valid: false } };
    };
  }

  // departmentOrBaseを入力する時にdepartmentOrBaseRadioも選択されているか検証
  isDepartmentOrBaseRadio(control: AbstractControl) {
    if (control.value && control.value.departmentOrBase && !control.value.departmentOrBaseRadio) {
      return { isDepartmentOrBaseRadio: { valid: false } };
    } else {
      return null;
    }
  }

}
