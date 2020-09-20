import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ɵSWITCH_VIEW_CONTAINER_REF_FACTORY__POST_R3__ } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

import { SearchForm } from '../../model/search-form';
import { CategoryClass } from '../../model/category-class';

import { environment } from '../../../environments/environment';
import { UserInfoContainerService } from '../../service/user-info-container.service';

interface ClaimList {
  CLAIM: Claim[];
  ORDER: string;
  FROMPAGES: number;
  TOPAGES: number;
  TOTALNUMBER: number;
}

interface Claim {
  CLAIMNUMBER: string;
  INSUREDNAMEKANJI: string;
  INSUREDNAMEKANA: string;
  CONTRACTORNAMEKANJI: string;
  CONTRACTORNAMEKANA: string;
  BUTENKANJI: string;
  KYOTENKANJI: string;
  INSURANCEKIND: string;
  LASTUPDATEDATE: Date;
  LOSSDATE: Date;
  CLAIMCATEGORY: string;
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
  param: SearchForm;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private userInfo: UserInfoContainerService
  ) { }

  ngOnInit(): void {
    // ユーザ情報取得
    this.userId = this.userInfo.userId;

    // 認可処理を実施
    this.authorize();

    // FormControlインスタンス（検索フォーム）作成
    this.searchControl = new FormGroup({
      CLAIMNUMBER: new FormControl(),
      CLAIMCATEGORYINFO: new FormControl(),
      INSURANCEKINDINFO: new FormControl(),
      FROMLOSSDATE: new FormControl(),
      TOLOSSDATE: new FormControl(),
      INSUREDNAMEKANA: new FormControl(null, [Validators.pattern(/^[ァ-ヶー　]+$/)]),
      INSUREDNAMEKANJI: new FormControl(),
      CONTRACTORNAMEKANA: new FormControl(null, [Validators.pattern(/^[ァ-ヶー　]+$/)]),
      CONTRACTORNAMEKANJI: new FormControl(),
      BUTENKYOTENRADIO: new FormControl(),
      BUTENKYOTEN: new FormControl()
    }, {
      // 複数項目に対してのvalidation
      // TODO: 全てのFormControlについて一回ずつ（つまり11回）実施してしまうので他に良い方法がないか検討
      validators: [this.isInputMoreThanOne, this.isButenKyotenRadio]
    });

    this.claims = [];
  }

  // 認可処理
  authorize(): void {
    // 認可処理用のuri作成
    const authUri = environment.claim_list_url;

    // 認可処理を実施
    this.httpClient.get(authUri).subscribe(
      response => {
        console.log('認可OK');
      }, error => {
        console.log('認可エラーページに遷移');
        this.router.navigate(['/list/error']);
      }
    );
  }

  // 検索処理
  search(): void {
    // バリデーション
    if (this.searchControl.invalid) {
      console.log('reject search');
      return;
    }

    // console.log('this.searchControl', this.searchControl.value);

    // フォームの配列の各要素を{key, value}形式に変換
    this.setKeyArrayElement(this.searchControl);

    // フォームの全要素に対してnullを空文字に変換
    Object.keys(this.searchControl.value)
      .forEach(key => {
        if (this.searchControl.value[key] === null) this.searchControl.value[key] = '';
      });

    // POSTボディ部に検索フォームの内容をディープコピー
    this.createPostBody(this.searchControl, this.param, this.userId);

    // 事案一覧取得
    this.searchList(this.param);

    // フォームの各要素をnullで初期化
    this.searchControl.reset();
    // console.log('this.searchControl(初期化後)', this.searchControl.value);
  }

  // フォームの配列の各要素を{key, value}形式に変換
  setKeyArrayElement(form :FormGroup) {
    // フォームコントロールの事案カテゴリ要素にkeyをつける（nullならば空の配列に変換）
    if (form.value.CLAIMCATEGORYINFO) {
      form.value.CLAIMCATEGORYINFO.forEach(
        (claimCategory, i) => {
          claimCategory = { CLAIMCATEGORY: claimCategory };
          form.value.CLAIMCATEGORYINFO[i] = claimCategory;
        });
    } else {
      form.value.CLAIMCATEGORYINFO = [];
    }
    // フォームコントロールの保険種類要素にkeyをつける（nullならば空の配列に変換）
    if (form.value.INSURANCEKINDINFO) {
      form.value.INSURANCEKINDINFO.forEach(
        (insuranceKind, i) => {
          insuranceKind = { INSURANCEKIND: insuranceKind };
          form.value.INSURANCEKINDINFO[i] = insuranceKind;
        });
    } else {
      form.value.INSURANCEKINDINFO = [];
    }
  }

  // HTTPリクエストのボディ部を作成
  createPostBody(form :FormGroup, param: SearchForm, userId: string) {
    // ボディ部に検索フォームの内容をディープコピー
    const { BUTENKYOTENRADIO, BUTENKYOTEN, ...rest } = form.value;
    param = JSON.parse(JSON.stringify(rest));

    // ボディ部の残り（検索フォーム以外の内容）をセット
    param.REQ_USER_ID = userId;
    if (BUTENKYOTENRADIO === 'buten') {
      param.BUTENKANJI = BUTENKYOTEN;
      param.KYOTENKANJI = '';
    } else if (BUTENKYOTENRADIO === 'kyoten') {
      param.BUTENKANJI = '';
      param.KYOTENKANJI = BUTENKYOTEN;
    } else {
      param.BUTENKANJI = '';
      param.KYOTENKANJI = '';
    }
    param.LABELTYPE = environment.lossDate;
    param.ORDER = environment.desc;
    param.DISPLAYFROM = '1';
    console.log('POSTボディ部', param);
  }

  // ソート処理
  listSort(sort: Sort) {
    // console.log(this.param);
    this.param.LABELTYPE = environment[sort.active];
    this.param.ORDER = environment[sort.direction];
    // console.log(this.param);
    // 事案一覧取得
    this.searchList(this.param);
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
      this.searchList(this.param);
    }
  }

  // 1ページ戻ったときのfromPagesをセット
  setDisplayFromPages(): void {
    if (this.fromPages - 10 > 0) {
      this.param.DISPLAYFROM = String(this.fromPages - 10);
    } else {
      this.param.DISPLAYFROM = '1';
    }
  }

  // 1ページ進む処理
  next(): void {
    if (this.toPages >= this.totalNumber) {
      console.log('reject next');
    } else {
      console.log('accept next');
      this.param.DISPLAYFROM = String(this.toPages + 1);
      // 事案一覧取得
      this.searchList(this.param);
    }
  }

  // 開始位置指定して検索処理
  update(): void {
    if (this.fromPages < 0 || this.fromPages > this.totalNumber) {
      console.log('reject update');
    } else {
      console.log('accept update');
      this.param.DISPLAYFROM = String(this.fromPages);
      this.searchList(this.param);
    }
  }

  // 事案一覧取得処理
  searchList(params: SearchForm): void {
    const claimsUri = environment.claims_url;
    const headers = { 'Content-Type': 'application/json' };

    // 事案一覧を取得
    // 本番用
    // this.httpClient.post(claimsUri, params ,{
    //   headers: headers})
    // スタブ用
    this.httpClient.get(claimsUri)
      .subscribe(
        (response: ClaimList) => {
          // console.log('response:', response);
          this.isError = false;
          // ビュー要素を取得
          this.claims = [];
          response.CLAIM.forEach((claim: Claim, i) => {
            const categoryClass = new CategoryClass('高', '中', '低', claim.CLAIMCATEGORY);
            this.claims[i] = { ...claim, categoryClass };
          });
          this.order = response.ORDER;
          this.fromPages = response.FROMPAGES;
          this.displayFromPages = response.FROMPAGES;
          this.toPages = response.TOPAGES;
          this.totalNumber = response.TOTALNUMBER;
        }, error => {
          console.log('検索エラーメッセージ表示');
          this.isError = true;
          // this.router.navigate(['/list/error']);
        }
      );
  }

  // TODO: validationは切り離すか要検討

  // 一つ以上フォーム入力されているか検証（BUTENKYOTENRADIOは除外）
  // TODO: CLAIMCATEGORYINFOとINSURANCEKINDINFOを選択→選択解除すると、
  // 何も選択されていないのに検証okになってしまうので対応
  isInputMoreThanOne(control: AbstractControl) {
    if (!control.value) {
      return { isInputMoreThanOne: { valid: false } };
    }
    if (control.value.CLAIMNUMBER) {
      return null;
    } else if (control.value.CLAIMCATEGORYINFO) {
      return null;
    } else if (control.value.INSURANCEKINDINFO) {
      return null;
    } else if (control.value.FROMLOSSDATE) {
      return null;
    } else if (control.value.TOLOSSDATE) {
      return null;
    } else if (control.value.INSUREDNAMEKANA) {
      return null;
    } else if (control.value.INSUREDNAMEKANJI) {
      return null;
    } else if (control.value.CONTRACTORNAMEKANA) {
      return null;
    } else if (control.value.CONTRACTORNAMEKANJI) {
      return null;
    } else if (control.value.BUTENKYOTEN) {
      return null;
    } else {
      return { isInputMoreThanOne: { valid: false } };
    };
  }

  // BUTENKYOTENを入力する時にBUTENKYOTENRADIOも選択されているか検証
  isButenKyotenRadio(control: AbstractControl) {
    if (control.value && control.value.BUTENKYOTEN && !control.value.BUTENKYOTENRADIO) {
      return { isButenKyotenRadio: { valid: false } };
    } else {
      return null;
    }
  }

}
