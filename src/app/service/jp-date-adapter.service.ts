import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

/**
 * カレンダに表示する日付表記を(d日ではなく)dにするためのサービス
 * @author SKK231527 植木
 */
@Injectable({
  providedIn: 'root',
})
export class JPDateAdapter extends NativeDateAdapter {
  getDateNames(): string[] {
    // * '1'から'31'までの連番を配列で返す
    return Array.from(Array(31), (value, key) => `${key + 1}`);
  }
}
