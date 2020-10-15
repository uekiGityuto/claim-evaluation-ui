import { OnInit, Directive, ElementRef, Input } from '@angular/core';

/**
 * 要素にツールチップを付与するためのディレクティブ
 * @author SKK231527 植木
 */
@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit {
  @Input('appTooltip') data = '';

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    const style = window.getComputedStyle(element);
    const dataLength = this.calcDataSize(this.data, style);
    // dataのレングスが要素のレイアウト幅より大きければ、title属性とCSSクラスを追加
    if (element.clientWidth < dataLength) {
      element.classList.add('claim-list-ellipsis');
      element.setAttribute('title', this.data);
    }
  }

  // dataのレングス（レイアウト幅）を計算
  calcDataSize(data: string, style: CSSStyleDeclaration): number {
    // spanを生成
    const span = document.createElement('span');

    // 現在の表示要素に影響しないように、画面外に飛ばしておく
    span.style.position = 'absolute';
    span.style.top = '-1000px';
    span.style.left = '-1000px';

    // 折り返しはさせない
    span.style.whiteSpace = 'nowrap';

    // 計測したい文字を設定する
    span.innerHTML = data;

    // スタイルを適用する
    span.style.fontSize = style.getPropertyValue('font-size');
    span.style.padding = style.getPropertyValue('padding');

    // DOMに追加する（追加することで、ブラウザで領域が計算される）
    document.body.appendChild(span);

    // 横幅を取得する
    const dataLength = span.clientWidth;

    // 終わったらDOMから削除する
    span.parentElement.removeChild(span);

    return dataLength;
  }

}
