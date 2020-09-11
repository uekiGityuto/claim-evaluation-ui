import { OnInit, Directive, ElementRef, Input } from '@angular/core';

/**
 * Add ToolTip Directive and claim-list-ellipsis CSSclass
 * @author SKK231527 植木
 */
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
