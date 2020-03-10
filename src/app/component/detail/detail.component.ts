import { Component, OnInit, ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__, OnDestroy } from '@angular/core';
import { Issue } from '../../model/Issue.model';
import { ActivatedRoute } from '@angular/router';
import { ObservableClientService } from '../../service/ObservableClientService';
import { Result } from '../../model/Result.model';
import { environment } from '../../../environments/environment';
import { AppComponent } from '../../app.component';
import { Modal } from 'src/app/model/Modal.model';
import { FilterPipe } from '../../module/filter.pipe';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit, OnDestroy {
  public issue: Issue;
  public errMsgList = [];
  public riskListLimit: number;
  public noLimit: number;
  public rFactors: {factor: string, effect: number}[];
  public gFactors: {factor: string, effect: number}[];
  private rFactorsAll: {factor: string, effect: number}[];
  private gFactorsAll: {factor: string, effect: number}[];
  private fp: FilterPipe;

  constructor(private ob: ObservableClientService,
              private route: ActivatedRoute,
              private appCmpt: AppComponent) {
    this.issue = new Issue();
    this.errMsgList = [];
    this.riskListLimit = 5;
    this.noLimit = -1;
    this.rFactors = [];
    this.gFactors = [];
    this.rFactorsAll = [];
    this.gFactorsAll = [];
  }

  public getIssueInfo() {
    const uri = environment.issue_url;
    const param = {receipt_no: this.issue.receipt_no};
    const method = 'get';
    this.issue = new Issue();
    this.errMsgList = [];

    const observer = this.ob.rxClient(uri , method, param);
    observer.subscribe(
      (result: Result) => {
        result.isSuccess ? this.issue.setRequestData(result.data[0]) : this.errMsgList = result.errMsgList;
        this.setFactors(this.issue.factors);
        this.setActiveEstimation(this.issue.estimation_agreement);
      }
    );
  }

  public getAllRiskList() {
    this.riskListLimit = this.noLimit;
    this.setFactors();
    const element: HTMLInputElement = <HTMLInputElement>document.getElementById('btnShowAllRiskList');
    element.style.display = 'none';
  }

  public riskScoreFeedback(event: Event) {
    this.openModal(this.issue.receipt_no, this.issue.estimation_memo);
    this.selectIcon(event);
  }

  public filterSideMemoList(id: string) {
    const elements = Array.from(document.getElementsByClassName('side-memo'));
    for (let i=0; i<elements.length; i++) {
      const em = <HTMLInputElement>elements[i];
      if (em.id === id) {
        if (!em.classList.contains('active')) {
          em.classList.add('active');
        }
      } else {
        em.classList.remove('active');
      }
    }

    // TODO: filtering side memo list
    console.log("filtering: " + id);
  }

  private castToIsuue(object: Issue): void {
    this.issue = object;
  }

  private setFactors(factors: {factor: string, effect: number}[] = []) {
    this.rFactors = [];
    this.gFactors = [];

    if (factors.length > 0) {
      for (let i=0; i<factors.length; i++) {
        const f = factors[i];
        if (f.effect > 0) {
          this.rFactorsAll.push(f);
        } else if (f.effect < 0) {
          this.gFactorsAll.push(f);
        }
      }
      this.fp.transform(this.rFactorsAll, 'sort', ['effect','desc']);
      this.fp.transform(this.gFactorsAll, 'sort', ['effect','asc']);
    }

    for (let i=0; i<this.rFactorsAll.length && (i < this.riskListLimit || this.riskListLimit === this.noLimit); i++) {
      const f = this.rFactorsAll[i];
      this.rFactors.push(f);
    }
    for (let i=0; i<this.gFactorsAll.length && (i < this.riskListLimit || this.riskListLimit === this.noLimit); i++) {
      const f = this.gFactorsAll[i];
      this.gFactors.push(f);
    }
  }

  private setActiveEstimation(estimation_agreement: boolean) {
    if (estimation_agreement === true) {
      const icon_done: HTMLInputElement = <HTMLInputElement>document.getElementById('d-icon-done');
      icon_done.classList.add('active');
    } else if (estimation_agreement === false) {
      const icon_clear: HTMLInputElement = <HTMLInputElement>document.getElementById('d-icon-clear');
      icon_clear.classList.add('active');
    }
  }

  ngOnInit(): void {
    this.fp = new FilterPipe();
    this.route.queryParams.subscribe(params => {
      if (params['receipt_no'.toString()]) {
        this.issue.receipt_no = params['receipt_no'.toString()];
      } else if (params['issue'.toString()]) {
        const object = JSON.parse(params['issue'.toString()]);
        if (object) {
          this.castToIsuue(object);
        }
      }
    });
    this.getIssueInfo();
  }

  ngOnDestroy(): void {
    this.clearModalInfo();
  }

  private openModal(id, memo) {
    let modal = new Modal();
    if (this.appCmpt.ms.model.id != id) {
      modal.memo = "";//memo;
    } else {
      modal.memo = this.appCmpt.ms.model.memo;
    }
    modal.id = id;
    modal.isMemo = true;
    modal.title = "リスクスコアフィードバック";
    modal.header = "<span>リスクスコアに同意する理由を詳しく説明して、</span><br><span>チームメイトが状況を把握できるようにしてください。</span>";
    modal.btnName = "申し出る";
    modal.width = 25;
    modal.height = 20;
    modal.isMemo = true;
    modal.isHeader = true;
    this.appCmpt.openModal(modal, this.submitRiskScoreFeedback, this);
  }
  private clearModalInfo() {
    this.appCmpt.ms.model.id = "";
    this.appCmpt.ms.model.memo = "";
  }

  private selectIcon(event: Event) {
    const id = (event.target as Element).id;
    const before_agreement = this.issue.estimation_agreement;
    this.issue.estimation_agreement = id === 'd-icon-done' ? true : false;
    const another_id = this.issue.estimation_agreement ? 'd-icon-clear' : 'd-icon-done';
    const clickedIcon: HTMLInputElement = <HTMLInputElement>document.getElementById(id);
    const anotherIcon: HTMLInputElement = <HTMLInputElement>document.getElementById(another_id);
    clickedIcon.classList.add('active');
    anotherIcon.classList.remove('active');
    if (before_agreement != this.issue.estimation_agreement) {

      // TODO: update estimation_agreement
      console.log(this.issue.estimation_agreement);
    }
  }

  private submitRiskScoreFeedback(param: any) {
    const modalModel: Modal = JSON.parse(param);
    const memo = modalModel.memo;
    
    // TODO: send mail memo to someone
    console.log(memo);
  }
}
