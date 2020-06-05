import { Component, OnInit, ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObservableClientService } from '../../service/ObservableClientService';
import { Result } from '../../model/Result.model';
import { environment } from '../../../environments/environment';
import { AppComponent } from '../../app.component';
import { Modal } from 'src/app/model/Modal.model';
import { FilterPipe } from '../../module/filter.pipe';
import { Score } from 'src/app/model/score.model';
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
  public riskListLimit: number;
  public noLimit: number;
  public rFactors: {factor: string, effect: number}[];
  public gFactors: {factor: string, effect: number}[];
  public user: User;
  public rFactorsAll: {factor: string, effect: number}[];
  public gFactorsAll: {factor: string, effect: number}[];
  private fp: FilterPipe;
  private canSubmit;

  constructor(private ob: ObservableClientService,
              private route: ActivatedRoute,
              private appCmpt: AppComponent) {
    this.score = new Score();
    this.riskListLimit = 5;
    this.noLimit = -1;
    this.rFactors = [];
    this.gFactors = [];
    this.rFactorsAll = [];
    this.gFactorsAll = [];
    this.user = new User();
    this.canSubmit = true;
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
    this.getUserInfo();
  }

  ngOnDestroy(): void {
    this.clearModalInfo();
  }

  public getScoreInfo() {
    const uri = environment.restapi_url + '/scores/' + this.score.claimId;
    const param = null;
    const method = 'get';
    this.score = new Score();

    const observer = this.ob.rxClient(uri , method, param);
    observer.subscribe(
      (result: Result) => {
        if (result.isSuccess) {
          this.score.setRequestsData(result.data);
          if (this.score.feedback) {
            this.setActiveEstimation(this.score.feedback.isCorrect);
          }
          if (this.score.reasons) {
            this.setFactors(this.score.reasons);
          }
        } else {
          this.appCmpt.result.errMsgList = result.errMsgList;
        }
      }
    );
  }

  public getAllRiskList() {
    this.riskListLimit = this.noLimit;
    this.setFactors();
    const element: HTMLInputElement = document.getElementById('btnShowAllRiskList') as HTMLInputElement;
    element.style.display = 'none';
  }

  public riskScoreFeedback(event: Event) {
    this.openModalFeedback(this.score.fraudScoreId, this.score.feedback.comment);
    this.selectIcon(event);
  }

  public filterSideMemoList(id: string) {
    const elements = Array.from(document.getElementsByClassName('side-memo'));
    for (let i=0; i<elements.length; i++) {
      const em = elements[i] as HTMLInputElement;
      if (em.id === id) {
        if (!em.classList.contains('active')) {
          em.classList.add('active');
        }
      } else {
        em.classList.remove('active');
      }
    }

    // Need filtering side comment list?
    // then please add filtering funtion to todolist
    console.log('filtering: ' + id);
  }

  public changeComment(id: number) {
    const btnUpdate = document.getElementById('btn-cmt-update-' + id) as HTMLElement;
    const textarea = document.getElementById('txtarea-cmt-' + id) as HTMLInputElement;
    if (btnUpdate.innerHTML === '修正') {
      btnUpdate.innerHTML = '保存';
      textarea.readOnly = false;
      if (!textarea.classList.contains('active')) {
        btnUpdate.classList.add('active');
        textarea.classList.add('active');
      }
    } else {
      btnUpdate.innerHTML = '修正';
      textarea.readOnly = true;
      if (textarea.classList.contains('active')) {
        btnUpdate.classList.remove('active');
        textarea.classList.remove('active');
      }
      let cmt = new Comment();
      let beforeComment: string;
      for (let i=0; i<this.score.claim.commentList.length; i++) {
        cmt.setRequestsData(this.score.claim.commentList[i]);
        if (cmt.id === id) {
          beforeComment = cmt.comment;
          cmt.comment = textarea.value;
          break;
        }
      }
      this.updateRightSideComment(cmt, textarea, beforeComment);
    }
  }

  removeComment(id: number) {
    if (confirm('このコメントを削除しますか？')) {
      const cmt = new Comment();
      for (let i=0; i<this.score.claim.commentList.length; i++) {
        cmt.setRequestsData(this.score.claim.commentList[i]);
        if (cmt.id === id) {
          break;
        }
      }
      this.removeRightSideComment(cmt);
    }

  }

  checkSubmit(event: Event) {
    if (!this.canSubmit) {
      event.stopImmediatePropagation();
      return false;
    }
    return true;
  }
  recoveryCanSubmit() {
    this.canSubmit = true;
  }

  public submitMemo(param: any, event: Event) {
    if (!this.checkSubmit(event)) {
      return false;
    }
    const txt = param.sideMemoTxt.value;
    if (txt) {
      const comment = new Comment(-1, this.score.claim.claimId, txt, this.user.userId, this.user.name);
      this.submitRightSideComment(comment);
    }
  }

  private castToScore(object: Score): void {
    this.score = object;
  }

  private setFactors(factors: {factor: string, effect: number}[] = []) {
    this.rFactors = [];
    this.gFactors = [];

    if (factors.length > 0) {
      for (const f of factors) {
        if (f.effect > 0) {
          this.rFactorsAll.push(f);
        } else if (f.effect < 0) {
          this.gFactorsAll.push(f);
        }
      }
      this.fp.transform(this.rFactorsAll, 'sort', ['effect', 'desc']);
      this.fp.transform(this.gFactorsAll, 'sort', ['effect', 'asc']);
    }

    for (let i = 0; i < this.rFactorsAll.length && (i < this.riskListLimit || this.riskListLimit === this.noLimit); i++) {
      const f = this.rFactorsAll[i];
      this.rFactors.push(f);
    }
    for (let i = 0; i < this.gFactorsAll.length && (i < this.riskListLimit || this.riskListLimit === this.noLimit); i++) {
      const f = this.gFactorsAll[i];
      this.gFactors.push(f);
    }
  }

  private setActiveEstimation(estimationAgreement: boolean) {
    if (estimationAgreement === true) {
      const iconDone: HTMLInputElement = document.getElementById('d-icon-done') as HTMLInputElement;
      iconDone.classList.add('active');
    } else if (estimationAgreement === false) {
      const iconClear: HTMLInputElement = document.getElementById('d-icon-clear') as HTMLInputElement;
      iconClear.classList.add('active');
    }
  }

  private getUserInfo() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  private selectIcon(event: Event) {
    const id = (event.target as Element).id;
    const beforeAgreement = this.score.feedback.isCorrect;
    this.score.feedback.isCorrect = id === 'd-icon-done' ? true : false;
    const anotherId = this.score.feedback.isCorrect ? 'd-icon-clear' : 'd-icon-done';
    const clickedIcon: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
    const anotherIcon: HTMLInputElement = document.getElementById(anotherId) as HTMLInputElement;
    clickedIcon.classList.add('active');
    anotherIcon.classList.remove('active');
    if (beforeAgreement !== this.score.feedback.isCorrect) {
      this.updateFeedback();
      // console.log(this.score.feedback.isCorrect);
    }
  }

  private updateFeedback() {
    const uri = environment.restapi_url + '/scores/' + this.score.claim.claimId + '/updateFeedbackComment';
    const method = 'post';
    this.appCmpt.result.errMsgList = [];
    const observer = this.ob.rxClient(uri , method, this.score.feedback);
    observer.subscribe(
      (result: Result) => {
        if (result.isSuccess) {
          if (result.data) {
            this.appCmpt.ms.model.obj = result.data;
            this.score.feedback = result.data;
          } else {
            this.appCmpt.result.addErrList([{key: 'Update Error', value: 'Update Fail'}]);
          }
        }
        if (result.errMsgList.length > 0) {
          this.appCmpt.result.addErrList(result.errMsgList);
        }
      }
    );
  }

  private submitRightSideComment(comment: Comment) {
    const uri = environment.restapi_url + '/scores/' + this.score.claim.claimId + '/updateComment';
    const method = 'post';
    this.appCmpt.result.errMsgList = [];
    const observer = this.ob.rxClient(uri , method, comment);
    observer.subscribe(
      (result: Result) => {
        if (result.isSuccess) {
          const data = result.data;
          if (data) {
            this.score.claim.commentList.push(data);
            const textarea: HTMLInputElement = document.getElementById('sideMemoTxt') as HTMLInputElement;
            textarea.value = '';
            this.recoveryCanSubmit();
          }
        }
        if (result.errMsgList.length > 0) {
          this.appCmpt.result.addErrList(result.errMsgList);
        }
      }
    );
  }

  private updateRightSideComment(comment: Comment, textarea: HTMLInputElement, beforeComment: string) {
    const uri = environment.restapi_url + '/scores/' + this.score.claim.claimId + '/updateComment';
    const method = 'post';
    this.appCmpt.result.errMsgList = [];
    const observer = this.ob.rxClient(uri , method, comment);
    observer.subscribe(
      (result: Result) => {
        if (result.isSuccess) {
          const data = result.data;
          if (data) {
            const list = this.score.claim.commentList;
            let idx = 0;
            for (const cmt of list) {
              if (cmt['id'] === data['id']) {
                break;
              }
              idx += 1;
            }
            list.splice(idx, 1);
            list.push(data);
            this.fp.transform(list, 'sort', ['id', 'asc']);
          } else {
            this.appCmpt.result.addErrList([{key: 'Update Error', value: 'Update Fail'}]);
            textarea.value = beforeComment;
          }
        }
        if (result.errMsgList.length > 0) {
          this.appCmpt.result.addErrList(result.errMsgList);
        }
      }
    );
  }

  private removeRightSideComment(comment: Comment) {
    const uri = environment.restapi_url + '/scores/' + this.score.claim.claimId + '/removeComment';
    const method = 'post';
    this.appCmpt.result.errMsgList = [];
    const observer = this.ob.rxClient(uri , method, comment);
    observer.subscribe(
      (result: Result) => {
        if (result.isSuccess) {
          const data = result.data;
          if (data) {
            const list = this.score.claim.commentList;
            let idx = 0;
            for (const cmt of list) {
              if (cmt['id'] === data) {
                break;
              }
              idx += 1;
            }
            list.splice(idx, 1);
            this.fp.transform(list, 'sort', ['id', 'asc']);
          } else {
            this.appCmpt.result.addErrList([{key: 'Remove Error', value: 'Remove Fail'}]);
          }
        }
        if (result.errMsgList.length > 0) {
          this.appCmpt.result.addErrList(result.errMsgList);
        }
      }
    );
  }

  private clearModalInfo() {
    this.appCmpt.ms.model.id = '';
    this.appCmpt.ms.model.memo = '';
  }

  private openModalFeedback(id, memo) {
    const modal = new Modal();
    if (this.appCmpt.ms.model.id !== id) {
      modal.memo = memo;
    } else {
      modal.memo = this.appCmpt.ms.model.memo;
    }
    modal.id = id;
    modal.isMemo = true;
    modal.title = 'リスクスコアフィードバック';
    modal.header = '<span>リスクスコアに同意する理由を詳しく説明して、</span><br><span>チームメイトが状況を把握できるようにしてください。</span>';
    modal.btnName = '申し出る';
    modal.width = 25;
    modal.height = 20;
    modal.isMemo = true;
    modal.isHeader = true;
    modal.ob = this.ob;
    modal.obj = this.score.feedback;
    this.appCmpt.openModal(modal);
    this.appCmpt.result.errMsgList = [];
    this.appCmpt.subscription = this.appCmpt.ms.ob.subscribe(
      (param) => {
        this.appCmpt.result.data = JSON.parse(param);
        if (this.appCmpt.result.data !== 'close') {
          const modalModel = this.appCmpt.ms.model;
          if (modalModel != null) {
            modalModel.memo = (this.appCmpt.result.data as Modal).memo;
            const feedback = new Feedback();
            feedback.setRequestData(modalModel.obj);
            feedback.comment = modalModel.memo;
            const uri = environment.restapi_url + '/scores/' + feedback.claimId + '/updateFeedbackComment';
            const method = 'post';
            this.appCmpt.result.errMsgList = [];
            const observer = modalModel.ob.rxClient(uri , method, feedback);
            observer.subscribe(
              (result: Result) => {
                if (result.isSuccess) {
                  if (result.data) {
                    this.score.feedback = result.data;
                  } else {
                    this.appCmpt.result.errMsgList.push({key: 'Update Error', value: 'Update Fail'});
                  }
                } else {
                  this.appCmpt.result.addErrList(result.errMsgList);
                }
              }
            );
          }
        }
        this.appCmpt.modalCmpt = null;
        this.appCmpt.closeModal();
      }
    );
  }

  public openModalCompleteInvestigation() {
    const modal = new Modal();
    modal.isMemo = false;
    modal.title = '調査を終了する';
    modal.header = '<span>調査結果をお知らせください。</span><br><span>システムが将来よりスマートな予測を行うのに役立ちます。</span>';
    modal.htmlContents = '<div class="flex-col-center w100 h100">' +
                         '<div class="btn btn-wt flex-col-center" value="judgingAsFraud">詐欺</div><br/>' +
                         '<div class="btn btn-wt flex-col-center" value="judgingAsNoFraud">詐欺ではない</div><br/>' +
                         '<div class="btn btn-wt flex-col-center" value="judgingAsSubCritical">決定的でない</div></div>';
    modal.width = 25;
    modal.height = 20;
    modal.isMemo = false;
    modal.isHeader = true;
    modal.isFooter = false;
    this.appCmpt.openModal(modal);
    this.appCmpt.result.errMsgList = [];
    this.appCmpt.subscription = this.appCmpt.ms.ob.subscribe(
      (param) => {
        this.appCmpt.result.data = JSON.parse(param);
        if (this.appCmpt.result.data !== 'close') {
          switch (this.appCmpt.result.data) {
            case 'judgingAsFraud':
              alert('詐欺として終了');
              break;
            case 'judgingAsNoFraud':
              alert('詐欺でないとして終了');
              break;
            case 'judgingAsSubCritical':
              alert('決定的でないとして終了');
              break;
          }
        }
        this.appCmpt.modalCmpt = null;
        this.appCmpt.closeModal();
      }
    );
  }

}
