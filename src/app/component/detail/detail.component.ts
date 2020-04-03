import { Component, OnInit, ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObservableClientService } from '../../service/ObservableClientService';
import { Result } from '../../model/Result.model';
import { environment } from '../../../environments/environment';
import { AppComponent } from '../../app.component';
import { Modal } from 'src/app/model/Modal.model';
import { FilterPipe } from '../../module/filter.pipe';
import { Score } from 'src/app/model/Score.model';
import { Feedback } from 'src/app/model/Feedback.model';
import { Comment } from '../../model/Comment.model';
import { User } from '../../model/User.model';

/**
 * 詳細画面
 * @author SKK231099 李
 */
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit, OnDestroy {
  public score: Score;
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
    this.score = new Score();
    this.errMsgList = [];
    this.riskListLimit = 5;
    this.noLimit = -1;
    this.rFactors = [];
    this.gFactors = [];
    this.rFactorsAll = [];
    this.gFactorsAll = [];
  }

  public getScoreInfo() {
    const uri = environment.restapi_url + "/score/detail";
    const param = {claimId: this.score.claimId};
    const method = 'get';
    this.score = new Score();
    this.errMsgList = [];

    const observer = this.ob.rxClient(uri , method, param);
    observer.subscribe(
      (result: Result) => {
        if (result.isSuccess) {
          this.score.setRequestsData(result.data["score"]);
         } else {
           this.errMsgList = result.errMsgList;
         }
        this.setActiveEstimation(this.score.feedback.isCorrect);
        this.setFactors(this.score.reasons);
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
    this.openModal(this.score.fraudScoreId, this.score.feedback.comment);
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

  public submitMemo(param: any) {
    // TODO: get User Information from Session
    const user = new User('GNO0971', 'Yamamoto naoko', '1234', 4);
    
    const idx = this.score.claim.commentList.length + 1;
    const txt = param.sideMemoTxt.value;
    let comment = new Comment(this.score.claim.claimId, idx, txt, user.userId, user.name);
    this.submitRightSideComment(comment);
  }

  private castToScore(object: Score): void {
    this.score = object;
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
      if (params['claimId'.toString()]) {
        this.score.claimId = params['claimId'.toString()];
      } else if (params['claim'.toString()]) {
        const object = JSON.parse(params['claim'.toString()]);
        if (object) {
          this.castToScore(object);
        }
      }
    });
    this.getScoreInfo();
  }

  ngOnDestroy(): void {
    this.clearModalInfo();
  }

  private openModal(id, memo) {
    let modal = new Modal();
    if (this.appCmpt.ms.model.id != id) {
      modal.memo = memo;
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
    modal.callback = this.submitRiskScoreFeedback;
    modal.ob = this.ob;
    modal.obj = this.score.feedback;
    this.appCmpt.openModal(modal);
  }
  private clearModalInfo() {
    this.appCmpt.ms.model.id = "";
    this.appCmpt.ms.model.memo = "";
  }

  private selectIcon(event: Event) {
    const id = (event.target as Element).id;
    const before_agreement = this.score.feedback.isCorrect;
    this.score.feedback.isCorrect = id === 'd-icon-done' ? true : false;
    const another_id = this.score.feedback.isCorrect ? 'd-icon-clear' : 'd-icon-done';
    const clickedIcon: HTMLInputElement = <HTMLInputElement>document.getElementById(id);
    const anotherIcon: HTMLInputElement = <HTMLInputElement>document.getElementById(another_id);
    clickedIcon.classList.add('active');
    anotherIcon.classList.remove('active');
    if (before_agreement != this.score.feedback.isCorrect) {
      this.updateFeedback();
      // console.log(this.score.feedback.isCorrect);
    }
  }

  private updateFeedback() {
    const uri = environment.restapi_url + "/score/updateFeedback";
    const method = 'post';
    this.errMsgList = [];
    if (this.score.feedback.comment == undefined) {
      this.score.feedback.comment = this.appCmpt.ms.model.memo;
    }
    const observer = this.ob.rxClient(uri , method, {feedback: JSON.stringify(this.score.feedback)});
    observer.subscribe(
      (result: Result) => {
        if (result.isSuccess) {
          if(!result.data["update"]) {
            this.errMsgList.push("Update Error", "Update Fail");
          }
         } else {
           this.errMsgList = result.errMsgList;
         }
      }
    );
  }
  
  private submitRiskScoreFeedback(modalModel: Modal = null) {
    if (modalModel != null) {
      const memo = modalModel.memo;
      let feedback = new Feedback();
      feedback.setRequestData(modalModel.obj);
      feedback.comment = memo;
      
      const uri = environment.restapi_url + "/score/updateFeedback";
      const method = 'post';
      let errMsgList = [];
      const observer = modalModel.ob.rxClient(uri , method, {feedback: JSON.stringify(feedback)});
      observer.subscribe(
        (result: Result) => {
          if (result.isSuccess) {
            if(!result.data["update"]) {
              errMsgList.push("Update Error", "Update Fail");
            }
          } else {
            errMsgList = result.errMsgList;
          }
        }
      );
    }
  }

  private submitRightSideComment(comment: Comment) {
    const uri = environment.restapi_url + "/score/updateComment";
    const method = 'post';
    this.errMsgList = [];
    const observer = this.ob.rxClient(uri , method, {comment: JSON.stringify(comment)});
    observer.subscribe(
      (result: Result) => {
        if (result.isSuccess) {
          const data = result.data["update"];
          if (data) {
            this.score.claim.commentList.push(data);
          } else {
            this.errMsgList.push("Update Error", "Update Fail");
          }
        } else {
          this.errMsgList = result.errMsgList;
        }
      }
    );
  }
}
