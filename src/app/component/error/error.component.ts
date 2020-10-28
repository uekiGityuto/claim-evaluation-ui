import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

/**
 * CE-S02事案一覧画面＜認可エラー＞のコンポーネント
 * @author SKK231527 植木
 */
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private title: Title) { }

  ngOnInit(): void {
    // HTMLのTitleタグの内容を更新
    this.title.setTitle('事案一覧');
  }

}
