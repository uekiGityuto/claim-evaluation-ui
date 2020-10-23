import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

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
  prevButtonVisibility: string;
  nextButtonVisibility: string;

  // 検索用
  searchControl: FormGroup;
  param: TargetClaimList;

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

  // 認可処理
  authorize(): void {
    this.client.get().subscribe(
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
      console.log('バリデーションエラー');
      return;
    }

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
      console.log('reject prev');
      return;
    }
    console.log('accept prev');
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
    if (this.fromPages <= 0 || this.fromPages > this.totalNumber) {
      console.log('reject update');
      return;
    }
    console.log('accept update');
    this.param.displayFrom = String(this.fromPages);
    this.searchList(this.param);
  }

  // 事案一覧取得処理
  searchList(params: TargetClaimList): void {
    // 事案一覧を取得
    this.client.post(params).subscribe(
      response => {
        console.log('取得結果:', response);
        this.isError = false;

        // ビュー要素の初期化
        this.initializeViewElemnet();

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
      }, error => {
        console.log('検索エラーメッセージ表示');
        this.isError = true;
      }
    );
  };

  // ビュー要素の初期化処理
  initializeViewElemnet() {
    this.claims = [];
    this.order = null;
    this.fromPages = null;
    this.displayFromPages = null;
    this.toPages = null;
    this.totalNumber = null;
  }

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
