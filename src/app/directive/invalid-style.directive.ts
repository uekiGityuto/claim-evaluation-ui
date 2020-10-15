import { OnInit, Directive, ElementRef, Input } from '@angular/core';

/**
 * 要素のエラースタイルを追加するためのディレクティブ
 * @author SKK231527 植木
 */
// TODO: 不要なら削除
@Directive({
  selector: '[appInvalidStyle]'
})
export class InvalidStyleDirective implements OnInit {
  @Input('appInvalidStyle') errors = null;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    console.log('errors', this.errors);
  }

}
