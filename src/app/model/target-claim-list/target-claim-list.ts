import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';

import { ClaimCategory } from './claim-category';
import { InsuranceKind } from './insurance-kind';

import { environment } from '../../../environments/environment';

export class TargetClaimList {
  // REQ_USER_ID: string;
  private claimNumber: string;
  private claimCategoryInfo: ClaimCategory[];
  private insuranceKindInfo: InsuranceKind[];
  private fromLossDate: string;
  private toLossDate: string;
  private insuredNameKana: string;
  private insuredNameKanji: string;
  private contractorNameKana: string;
  private contractorNameKanji: string;
  private butenKanji: string;
  private kyotenKanji: string;
  labelType: string;
  order: string;
  displayFrom: string;

  constructor(form: FormGroup, datepipe: DatePipe,) {

    // フォームの全要素に対してnullを空文字に変換
    Object.keys(form.value)
      .forEach(key => {
        if (form.value[key] === null) form.value[key] = '';
      });

    // 単純に代入出来るフォームの内容をフィールドにセット
    this.claimNumber = form.value.claimNumber;
    this.fromLossDate = form.value.fromLossDate;
    this.toLossDate = form.value.toLossDate;
    this.insuredNameKana = form.value.insuredNameKana;
    this.insuredNameKanji = form.value.insuredNameKanji;
    this.contractorNameKana = form.value.contractorNameKana;
    this.contractorNameKanji = form.value.contractorNameKanji;

    // 日付の形式を変換
    this.fromLossDate = this.fromLossDate === '' ? '' : datepipe.transform(this.fromLossDate, 'yyyy-MM-dd');
    this.toLossDate = this.toLossDate === '' ? '' : datepipe.transform(this.toLossDate, 'yyyy-MM-dd');

    // フォームの事案カテゴリをフィールドにセット
    this.claimCategoryInfo = [];
    if (form.value.claimCategoryInfo && form.value.claimCategoryInfo.length > 0) {
      form.value.claimCategoryInfo.forEach(
        claimCategory => {
          this.claimCategoryInfo.push(new ClaimCategory(claimCategory));
        });
    } else {
      this.claimCategoryInfo.push(new ClaimCategory());
    }

    // フォームの保険種類をフィールドにセット
    this.insuranceKindInfo = [];
    if (form.value.insuranceKindInfo && form.value.insuranceKindInfo.length > 0) {
      form.value.insuranceKindInfo.forEach(
        insuranceKind => {
          this.insuranceKindInfo.push(new InsuranceKind(insuranceKind));
        });
    } else {
      this.insuranceKindInfo.push(new InsuranceKind());
    }

    // フォームの担当部・担当拠点をフィールドにセット
    if (form.value.butenKyotenRadio === 'buten') {
      this.butenKanji = form.value.butenKyoten;
      this.kyotenKanji = '';
    } else if (form.value.butenKyotenRadio === 'kyoten') {
      this.butenKanji = '';
      this.kyotenKanji = form.value.butenKyoten;
    } else {
      this.butenKanji = '';
      this.kyotenKanji = '';
    }

    // その他のフィールドをセット
    this.labelType = environment.lossDate;
    this.order = environment.desc;
    this.displayFrom = '1';

  }

}
