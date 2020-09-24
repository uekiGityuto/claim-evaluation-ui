import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

import { SearchForm } from '../../model/search-form';
import { CategoryClass } from '../../model/category-class';
import { ClaimView } from '../../model/claim-view';
import { ClaimList } from '../../model/claim-list/claim-list';
import { Claim } from '../../model/claim-list/claim';

import { environment } from '../../../environments/environment';
import { UserInfoContainerService } from '../../service/user-info-container.service';

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
  claims: ClaimView[] = [];
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
      claimNumber: new FormControl(),
      claimCategoryInfo: new FormControl(),
      insuranceKindInfo: new FormControl(),
      fromLossDate: new FormControl(),
      toLossDate: new FormControl(),
      insuredNameKana: new FormControl(null, [Validators.pattern(/^[ァ-ヶー　]+$/)]),
      insuredNameKanji: new FormControl(),
      contractorNameKana: new FormControl(null, [Validators.pattern(/^[ァ-ヶー　]+$/)]),
      contractorNameKanji: new FormControl(),
      butenKyotenRadio: new FormControl(),
      butenKyoten: new FormControl()
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
    const authUri = environment.transition_url;

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
    // console.log(this.searchControl.value);
    // バリデーション
    if (this.searchControl.invalid) {
      console.log('バリデーションエラー');
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
    this.param = this.createPostBody(this.searchControl, this.param, this.userId);

    // 事案一覧取得
    this.searchList(this.param);

    // フォームの各要素をnullで初期化
    this.searchControl.reset();
    // console.log('this.searchControl(初期化後)', this.searchControl.value);
  }

  // フォームの配列の各要素を{key, value}形式に変換
  setKeyArrayElement(form :FormGroup) {
    // フォームコントロールの事案カテゴリ要素にkeyをつける（nullならば空の配列に変換）
    if (form.value.claimCategoryInfo) {
      form.value.claimCategoryInfo.forEach(
        (claimCategory, i) => {
          claimCategory = { claimCategory: claimCategory };
          form.value.claimCategoryInfo[i] = claimCategory;
        });
    } else {
      form.value.claimCategoryInfo = [];
    }
    // フォームコントロールの保険種類要素にkeyをつける（nullならば空の配列に変換）
    if (form.value.insuranceKindInfo) {
      form.value.insuranceKindInfo.forEach(
        (insuranceKind, i) => {
          insuranceKind = { insuranceKind: insuranceKind };
          form.value.insuranceKindInfo[i] = insuranceKind;
        });
    } else {
      form.value.insuranceKindInfo = [];
    }
  }

  // HTTPリクエストのボディ部を作成
  createPostBody(form :FormGroup, param: SearchForm, userId: string) {
    // ボディ部に検索フォームの内容をディープコピー
    const { butenKyotenRadio, butenKyoten, ...rest } = form.value;
    param = JSON.parse(JSON.stringify(rest));

    // ボディ部の残り（検索フォーム以外の内容）をセット
    // param.REQ_USER_ID = userId;
    if (butenKyotenRadio === 'buten') {
      param.butenKanji = butenKyoten;
      param.kyotenKanji = '';
    } else if (butenKyotenRadio === 'kyoten') {
      param.butenKanji = '';
      param.kyotenKanji = butenKyoten;
    } else {
      param.butenKanji = '';
      param.kyotenKanji = '';
    }
    param.labelType = environment.lossDate;
    param.order = environment.desc;
    param.displayFrom = '1';
    // console.log('POSTボディ部', param);
    return param;
  }

  // ソート処理
  listSort(sort: Sort) {
    // console.log(this.param);
    // TODO: environmentからの取得方法の書き方を他と合わせる
    this.param.labelType = environment[sort.active];
    this.param.order = environment[sort.direction];
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
      this.searchList(this.param);
    }
  }

  // 開始位置指定して検索処理
  update(): void {
    if (this.fromPages < 0 || this.fromPages > this.totalNumber) {
      console.log('reject update');
    } else {
      console.log('accept update');
      this.param.displayFrom = String(this.fromPages);
      this.searchList(this.param);
    }
  }

  // 事案一覧取得処理
  searchList(params: SearchForm): void {
    console.log('postボディ:', params);
    const claimsUri = environment.claims_url;
    const headers = { 'Content-Type': 'application/json' };

    // 事案一覧を取得
    // 本番用
    this.httpClient.post<ClaimList>(claimsUri, params ,{ headers: headers})
    // スタブ用
    // this.httpClient.get(claimsUri)
      .subscribe(
        response => {
          // console.log('response:', response);
          this.isError = false;
          // ビュー要素を取得
          // this.claims = [];
          response.claim.forEach((claim: Claim, i) => {
            const categoryClass = new CategoryClass('高', '中', '低', claim.claimCategory);
            this.claims[i] = { ...claim, categoryClass };
          });
          this.order = response.order;
          this.fromPages = response.fromPages;
          this.displayFromPages = response.fromPages;
          this.toPages = response.toPages;
          this.totalNumber = response.totalNumber;
        }, error => {
          console.log('検索エラーメッセージ表示');
          this.isError = true;
          // this.router.navigate(['/list/error']);
        }
      );
  }

  // TODO: validationは切り離すか要検討

  // 一つ以上フォーム入力されているか検証（butenKyotenRadioは除外）
  isInputMoreThanOne(control: AbstractControl) {
    if (!control.value) {
      return { isInputMoreThanOne: { valid: false } };
    }
    if (control.value.claimNumber) {
      return null;
    } else if (control.value.claimCategoryInfo && control.value.claimCategoryInfo.length > 0) {
      return null;
    } else if (control.value.insuranceKindInfo && control.value.insuranceKindInfo.length > 0) {
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
    } else if (control.value.butenKyoten) {
      return null;
    } else {
      return { isInputMoreThanOne: { valid: false } };
    };
  }

  // butenKyotenを入力する時にbutenKyotenRadioも選択されているか検証
  isButenKyotenRadio(control: AbstractControl) {
    if (control.value && control.value.butenKyoten && !control.value.butenKyotenRadio) {
      return { isButenKyotenRadio: { valid: false } };
    } else {
      return null;
    }
  }

}
