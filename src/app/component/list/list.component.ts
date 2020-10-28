import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

import * as moment from 'moment';

import { CategoryClass } from '../../model/category-class';
import { Claim } from '../../model/claim-list/claim';
import { ClaimView } from '../../model/claim-view';
import { TargetClaimList } from '../../model/target-claim-list/target-claim-list';

import { environment } from '../../../environments/environment';

import { ClaimListClientService } from '../../service/claim-list-client.service';
import { UserInfoContainerService } from '../../service/user-info-container.service';

/**
 * CE-S02事案一覧画面のコンポーネント
 * @author SKK231527 植木
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, AfterViewChecked {
  // 検索状態管理用
  normal = 0;
  error = 1;
  noData = 2;
  searching = 3;
  searchStatus = this.normal;

  // ビュー表示用
  userId: string;
  claims: ClaimView[] = [];
  order: string;
  fromPages: number; // 入力フォームと同期しているfromPagesの値
  displayFromPages: number; // apiから受け取ったfromPagesの値
  toPages: number;
  totalNumber: number;
  prevButtonVisibility: string;
  nextButtonVisibility: string;

  // 事案一覧の行の高さ決め処理用
  zero = 0;
  one = 1;
  twoMore = 2;
  serchTimes = this.zero;
  @ViewChild('claimListCard')
  claimListCard: ElementRef;
  @ViewChild('claimListHeader')
  claimListHeader: ElementRef;
  rowHeight = 0;

  // 検索用
  searchControl: FormGroup;
  param: TargetClaimList;

  // 検索中ボタン非活性用
  @ViewChild('searchButton')
  searchButton: ElementRef;

  // 検索ボタン押下フラグ
  isSearchButton = false;

  constructor(private datepipe: DatePipe,
    private router: Router,
    private client: ClaimListClientService,
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
      fromLossDate: new FormControl(null, [this.isFromLossDate]),
      toLossDate: new FormControl(null, [this.isToLossDate]),
      // fromLossDate: new FormControl(),
      // toLossDate: new FormControl(),
      insuredNameKana: new FormControl(null, [Validators.pattern(/^[ァ-ヶー　]+$/)]),
      insuredNameKanji: new FormControl(),
      contractorNameKana: new FormControl(null, [Validators.pattern(/^[ァ-ヶー　]+$/)]),
      contractorNameKanji: new FormControl(),
      butenKyotenRadio: new FormControl(),
      butenKyoten: new FormControl()
    }, {
      // 複数項目に対してのvalidation
      validators: [this.isInputMoreThanOne, this.isButenKyotenRadio]
    });

    // mat-selectのスタイル調整
    const matSelectTrigger: HTMLElement[] = Array.prototype.slice.call(document.getElementsByClassName('mat-select-trigger'));
    matSelectTrigger.forEach(matSelectValue => {
      matSelectValue.style.height = environment.form_size;
    });
    const matSelectValues: HTMLElement[] = Array.prototype.slice.call(document.getElementsByClassName('mat-select-value'));
    matSelectValues.forEach(matSelectValue => {
      matSelectValue.style.verticalAlign = 'middle';
    });

  }

  // 事案一覧の行の高さ決め処理
  ngAfterViewChecked(): void {
    if(this.serchTimes !== this.one) {
      return;
    }
    const claimListCardHeight = this.claimListCard.nativeElement.offsetHeight;
    const claimListHeaderHeight = this.claimListHeader.nativeElement.offsetHeight;
    const claimListDatasetHeight = (claimListCardHeight - claimListHeaderHeight) / 10;
    // 「Expression has changed after it was checked.」例外を回避するためheight更新処理を非同期化
    setTimeout(() => {
      this.rowHeight = claimListDatasetHeight;
      this.serchTimes = this.twoMore;
    }, 0);
  }

  // 認可処理
  authorize(): void {
    this.client.get().subscribe(
      response => {
      }, error => {
        this.router.navigate(['/list/error']);
      }
    );
  }

  // 検索処理
  search(): void {
    // バリデーション
    if (this.searchControl.invalid || this.searchStatus === this.searching) {
      return;
    }
    this.isSearchButton = true;
    // HTTPリクエストのボディ部作成
    this.param = new TargetClaimList(this.searchControl, this.datepipe);

    // 事案一覧取得
    this.searchList(this.param);
  }

  // ソート処理
  sortList(sort: Sort) {
    this.param.labelType = environment[sort.active];
    this.param.order = environment[sort.direction];

    // 事案一覧取得
    this.searchList(this.param);
  }

  // 1ページ戻る処理
  previous(): void {
    if (this.displayFromPages <= 1) {
      return;
    }
    // 1ページ戻ったときのfromPagesをセット
    this.setDisplayFromPages();
    // 事案一覧取得
    this.searchList(this.param);
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
    } else {
      this.param.displayFrom = String(this.toPages + 1);
      // 事案一覧取得
      this.searchList(this.param);
    }
  }

  // 開始位置指定して検索処理
  update(): void {
    if (this.fromPages <= 0 || this.fromPages > this.totalNumber) {
      return;
    }
    this.param.displayFrom = String(this.fromPages);
    this.searchList(this.param);
  }

  // 事案一覧取得処理
  searchList(params: TargetClaimList): void {
    // 検索中のレイアウトに変更
    this.searchStatus = this.searching;
    this.searchButton.nativeElement.setAttribute('disabled', 'disabled');

    // ビュー要素の初期化
    this.initializeViewElemnet();

    // 事案一覧を取得
    this.client.post(params).subscribe(
      response => {
        this.searchButton.nativeElement.removeAttribute('disabled');
        this.isSearchButton = false;

        // 検索結果が無い場合の判定条件
        if (!response.claim || response.claim.length === 0) {
          this.searchStatus = this.noData;
          return;
        }

        // ビュー要素の取得
        response.claim.forEach((claim: Claim, i) => {
          const categoryClass = new CategoryClass('高', '中', '低', claim.claimCategory);
          this.claims[i] = { ...claim, categoryClass };
        });
        this.order = response.order;
        this.fromPages = response.fromPages;
        this.displayFromPages = response.fromPages;
        this.toPages = response.toPages;
        this.totalNumber = response.totalNumber;

        // 1ページ戻るボタン、1ページ進むボタンの表示/非表示
        this.prevButtonVisibility = this.displayFromPages > 1 ? 'visible' : 'hidden';
        this.nextButtonVisibility = this.toPages < this.totalNumber ? 'visible' : 'hidden';

        // 事案一覧の行の高さ決め処理をする場合の判定条件
        if(this.serchTimes === this.zero) {
          this.serchTimes = this.one;
        }

        this.searchStatus = this.normal;

      }, error => {
        this.searchStatus = this.error;
      }
    );
  };

  // ビュー要素の初期化処理
  initializeViewElemnet() {
    this.claims = [];
  }

  // 一つ以上フォーム入力されていない場合はバリデーションエラー（butenKyotenRadioは除外）
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

  // butenKyoten入力時、butenKyotenRadioが選択されていなければバリデーションエラー
  isButenKyotenRadio(control: AbstractControl) {
    if (control.value && control.value.butenKyoten && !control.value.butenKyotenRadio) {
      return { isButenKyotenRadio: { valid: false } };
    } else {
      return null;
    }
  }

  // 事故日fromが日付形式でなければ精査エラー
  isFromLossDate(control: AbstractControl) {
    if (!control.value || !control.value.fromLossDate) {
      return null;
    }
    if (moment.isDate(control.value.fromLossDate)) {
      return null;
    } else {
      return { isFromLossDate: { valid: false } };
    }
  }

  // 事故日toが日付形式でなければ精査エラー
  isToLossDate(control: AbstractControl) {
    if (!control.value || !control.value.toLossDate) {
      return null;
    }
    if (moment.isDate(control.value.toLossDate)) {
      return null;
    } else {
      return { istoLossDate: { valid: false } };
    }
  }

}
