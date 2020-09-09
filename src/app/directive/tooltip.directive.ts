import { OnInit, Directive, ElementRef, Input } from '@angular/core';

/**
 * Add ToolTip Directive
 * @author SKK231527 植木
 */
@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit {
  @Input('appTooltip') data = '';
  @Input() maxSize = 0;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    // 本当は「element.offsetWidth < element.scrollWidth」で判定したかったが、
    // なぜか同じ大きさになってしまうので、文字数で判定するようにした。
    // if (element.offsetWidth < element.scrollWidth) {
    //   element.setAttribute('title', this.data);
    // }
    // console.log('max-size:', this.maxSize);
    if (this.data.length > this.maxSize) {
      element.setAttribute('title', this.data);
      // Todo: css側と省略の単位を統一する
      // 「element.offsetWidth < element.scrollWidth」が本当に出来なければ、
      // element.textContentにthis.data + '...'セットする等の処理を追加し、
      // css側の制御(text-overflow: ellipsis等)を消す
    }
  }

}
