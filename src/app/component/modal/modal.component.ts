import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../service/modal-service';
import { Modal } from '../../model/Modal.model';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';

/**
 * Modal Dialog
 * @author SKK231099 李
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, AfterViewInit, OnDestroy {
  public model: Modal;

  constructor(private ms: ModalService) {
    this.model = new Modal();
    this.model.setModel(ms.model);
  }

  public ngOnInit(): void {
    const modalElement: HTMLInputElement = document.getElementById('modal-dialog') as HTMLInputElement;
    if (this.model.width > 0) { modalElement.style.width = this.model.width + 'em'; }
    if (this.model.height > 0) { modalElement.style.height = this.model.height + 'em'; }
    const header = document.getElementById('modal-header') as HTMLInputElement;
    header.style.display = this.ms.model.isHeader ? '' : 'none';
    const contents = document.getElementById('modal-contents') as HTMLInputElement;
    contents.style.display = this.ms.model.isMemo ? '' : 'none';
    const htmlContents = document.getElementById('modal-htmlContents') as HTMLInputElement;
    htmlContents.style.display = this.ms.model.htmlContents.length > 0 ? '' : 'none';
    const footer = document.getElementById('modal-footer') as HTMLInputElement;
    footer.style.display = this.ms.model.isFooter ? '' : 'none';
  }

  public ngAfterViewInit(): void {
    const htmlContents = document.getElementById('modal-htmlContents') as Element;
    this.checkEvent(htmlContents);
    const end = null;
  }

  private checkEvent(element: Element) {
    const childs: Array<Element> = Array.from(element.children);
    if (childs.length === 0) {
      return null;
    }
    const attrName = 'value';
    const skipTagNames = 'br,p,h';
    for (const child of childs) {
      const tagName = child.tagName.toLowerCase();
      if (skipTagNames.indexOf(tagName) > -1) {
        continue;
      }
      let strHTML = child.outerHTML.split(tagName)[1];
      if (strHTML.indexOf(attrName) < 0) {
        this.checkEvent(child);
      }
      strHTML = strHTML.substr(strHTML.indexOf(attrName) + attrName.length + 2);
      const fName = strHTML.substr(0, strHTML.indexOf('>') - 1);
      if (fName) {
        child.addEventListener('click', () => {
          this.callFunction(fName);
        });
      }
    }
  }

  public ngOnDestroy(): void {
  }

  public onSubmit(param: any): void {
    this.ms.submitModal(param);
  }

  public callFunction(param: string): void {
    this.ms.callFunction(param);
  }

  public close(): void {
    this.ms.closeModal();
  }

}

interface AfterViewInit {
  ngAfterViewInit(): void;
}
