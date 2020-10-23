import { OnInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDatasetHeight]'
})
export class DatasetHeightDirective implements OnInit {

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    const claimListCardHeight = document.getElementById('claim-list-card').offsetHeight;
    const claimListHeaderHeight = document.getElementById('claim-list-header').offsetHeight;
    const claimListDatasetHeight = (claimListCardHeight - claimListHeaderHeight) / 10;

    const element = this.elementRef.nativeElement;
    element.style.height = claimListDatasetHeight + 'px';
  }

}
