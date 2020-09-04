import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Chart, ChartData, ChartOptions } from 'chart.js';

// import { Claim } from '../../model/Claim.model';
// import { FraudScore } from '../../model/FraudScore.model';
// import { ScoreDetail } from '../../model/ScoreDetail.model';
// import { Reason } from '../../model/Reason.model';
import { Result } from '../../model/Result.model';
import { environment } from '../../../environments/environment';
import { ObservableClientService } from '../../service/ObservableClientService';
import { UserInfoContainerService } from '../../service/user-info-container.service';

interface Claim {
  claimNumber: string;
  insuredNameKanji: string;
  insuredNameKana: string;
  contractorNameKanji: string;
  contractorNameKana: string;
  insuranceKind: string;
  lossDate: Date;
  updateDate: Date;
  fraudScoreHistory: FraudScore[];
}

interface FraudScore {
  scoringDate: Date;
  claimCategory: string;
  scoreDetails: ScoreDetail[];
}

interface ScoreDetail {
  modelType: string;
  rank: string;
  score: string;
  reasons: Reason[];
}

interface Reason {
  reason: number;
  featureName: string;
  featureDescription: string;
}

/**
 * Detail Component
 * @author SKK231527 植木
 */
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {

  // 推論結果取得用
  claimNumber: string;
  uri = environment.restapi_url;
  claim: Claim;

  // ビュー表示用
  userId: string;
  authFlag: boolean;
  insuredName: string;
  contractorName: string;
  insurancetype: string;
  accidentDate: string;
  updateDate: string;
  claimCategory: string;
  diplayFraudScore: FraudScore;
  reasons: { rReason: Reason[], gReason: Reason[]; }[];

  // chart用
  @ViewChild('claimCategoryChart')
  elementRef: ElementRef;
  chartData = { labels: [], series1: [], series2: [] };
  chartOptions: ChartOptions;
  context: CanvasRenderingContext2D;
  chart: Chart;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private clientService: ObservableClientService,
    private userInfo: UserInfoContainerService
  ) { }

  ngOnInit(): void {
    // ユーザ情報取得
    this.authFlag = this.userInfo.authFlag;
    this.userId = this.userInfo.userId;

    // 事案情報取得
    this.getScoreInfo();
  }

  ngAfterViewInit(): void {
    // // console.log('message');
    // // canvasの取得
    // this.context = this.elementRef.nativeElement.getContext('2d');
    // // チャートの作成
    // console.log('this.chartData.series1', this.chartData.series1);
    // this.chart = new Chart(this.context, {
    //   type: 'line',
    //   data: {
    //     labels: this.chartData.labels,
    //     datasets: [{
    //       label: '特殊事案モデル',
    //       data: this.chartData.series1,
    //       backgroundColor: ['rgba(0, 0, 255, 0)'],
    //       borderColor: ['rgba(20, 0, 255, 100)'],
    //       steppedLine: true,
    //       borderWidth: 4,
    //     }, {
    //       label: 'NC/PDモデル',
    //       data: this.chartData.series2,
    //       backgroundColor: ['rgba(135, 206, 250, 0)'],
    //       borderColor: ['rgba(135, 206, 250, 100)'],
    //       steppedLine: true,
    //       borderWidth: 2,
    //     }],
    //   },
    //   options: this.chartOptions,
    // });
    // console.log('this.chartData.series1', this.chartData.series1);
  }

  // 事案情報取得
  getScoreInfo(): void {
    // 事案情報取得用のuri作成
    const scoreUri = this.uri + 'scores';
    const param = { userId: this.userId, claimNumber: this.claimNumber };

    // 事案情報を取得
    // const observer = this.clientService.rxClient(claimUri, 'post', param);// 本番用
    const observer = this.clientService.rxClient(scoreUri, 'get', null);// モック用
    observer.subscribe((result: Result) => {
      if (result.isSuccess) {
        // 取得結果をシャーローコピー
        this.claim = { ...result.data['claim'.toString()] };
        // console.log('claim:', this.claim);

        // ビュー表示情報取得
        this.claimNumber = this.claim.claimNumber;
        this.insuredName = this.claim.insuredNameKana;
        this.contractorName = this.claim.contractorNameKana;
        this.insurancetype = this.claim.insuranceKind;

        // 日付フォーマット変換
        const accidentDate = new Date(this.claim.lossDate);
        this.accidentDate = `${accidentDate.getFullYear()}/${accidentDate.getMonth()}/${accidentDate.getDate()}`;
        const updateDate = new Date(this.claim.updateDate);
        this.updateDate = `${updateDate.getFullYear()}/${updateDate.getMonth()}/${updateDate.getDate()}`;

        // 最新の推論結果を取得
        const end = this.claim.fraudScoreHistory.length - 1;
        this.diplayFraudScore = this.claim.fraudScoreHistory[end];

        // 推論結果の要因をソート
        this.reasonSort();

        // チャート作成
        this.chartCreate();
      } else {
        // Todo: errorページに遷移
        console.log('errorページに遷移');
      }
    });
  }

  // 推論結果の要因をソート
  reasonSort(): void {
    // 推論結果の詳細を表示
    // モデル毎に上昇要因と減少要因に分けて、絶対値の降順に並び変える
    this.reasons = [];
    this.diplayFraudScore.scoreDetails.forEach((scoreDetail, i) => {
      const reasons = scoreDetail.reasons.slice();
      const descReason = reasons.sort((a, b) => {
        return (a.reason > b.reason ? -1 : 1);
      });
      const gReason = descReason.filter(val => val.reason >= 0);
      const rReason = descReason.reverse().filter(val => val.reason < 0);
      this.reasons[i] = { gReason, rReason };
    });
    console.log('this.reasons', this.reasons);
  }

  // チャート作成
  chartCreate(): void {
    // チャートデータのセット
    this.chartData.labels = [];
    this.chartData.series1 = [];
    this.chartData.series2 = [];

    this.claim.fraudScoreHistory.forEach((fraudScore, i) => {
      const scoringDate = new Date(fraudScore.scoringDate);
      this.chartData.labels[i] =
        `${scoringDate.getFullYear()}/${scoringDate.getMonth()}/${scoringDate.getDate()}`;
      this.chartData.series1[i] = fraudScore.scoreDetails[0].score;
      this.chartData.series2[i] = fraudScore.scoreDetails[1].score;
      // console.log('this.chartData.series1', this.chartData.series1);
    });

    // チャートオプションのセット
    this.chartOptions = {
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
              max: 100,
            },
          }],
      },
      events: ['click'],
      onClick: (event, elements) => {
        console.log('onClick event:', event);
        console.log('onClick elements :', elements);
      }
    };

    // canvasの取得
    this.context = this.elementRef.nativeElement.getContext('2d');
    // チャートの作成
    console.log('this.chartData.series1', this.chartData.series1);
    this.chart = new Chart(this.context, {
      type: 'line',
      data: {
        labels: this.chartData.labels,
        datasets: [{
          label: '特殊事案モデル',
          data: this.chartData.series1,
          backgroundColor: ['rgba(0, 0, 255, 0)'],
          borderColor: ['rgba(20, 0, 255, 100)'],
          steppedLine: true,
          borderWidth: 4,
        }, {
          label: 'NC/PDモデル',
          data: this.chartData.series2,
          backgroundColor: ['rgba(135, 206, 250, 0)'],
          borderColor: ['rgba(135, 206, 250, 100)'],
          steppedLine: true,
          borderWidth: 2,
        }],
      },
      options: this.chartOptions,
    });
  }

  // 表示対象の日付変更
  // Todo: 作成する
  changeDate(event): void {
    console.log('event:', event);
    console.log('getElement:', this.chart.getElementAtEvent(event)[0]);
    console.log('getElements:', this.chart.getElementsAtEvent);
  }

  // 事案一覧ページに遷移
  displayList(): void {
    console.log('事案一覧ページへ遷移');
    this.router.navigate(['list']);
  }

}
