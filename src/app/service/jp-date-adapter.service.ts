import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

/**
 * Angular MaterialのDatepickerの設定をオーバーライドするサービス
 * @author SKK231527 植木
 */
@Injectable({
  providedIn: 'root',
})
export class JPDateAdapter extends NativeDateAdapter {
  // カレンダの日付表記を(d日ではなく)dに変更する
  getDateNames(): string[] {
    // * '1'から'31'までの連番を配列で返す
    return Array.from(Array(31), (value, key) => `${key + 1}`);
  }

  // 出力する日付をyyyy/M/dに変更する
  format(date: Date, displayFormat: Object): string {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }
}
