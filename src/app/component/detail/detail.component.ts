import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartData, ChartOptions } from 'chart.js';

// import { Claim } from '../../model/Claim.model';
// import { FraudScore } from '../../model/FraudScore.model';
// import { ScoreDetail } from '../../model/ScoreDetail.model';
// import { Reason } from '../../model/Reason.model';
import { Result } from '../../model/Result.model';
import { environment } from '../../../environments/environment';
import { ObservableClientService } from '../../service/ObservableClientService';

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

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {

  // 認可処理用
  param: string;
  userId: string;

  // 推論結果取得用
  claimNumber: string;
  uri = environment.restapi_url;
  claim: Claim;

  // ビュー表示用
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

  constructor(private route: ActivatedRoute, private httpClient: HttpClient,
    private router: Router, private clientService: ObservableClientService) { }

  ngOnInit(): void {
    // 暗号化パラメータ(param)が存在すれば、認可処理を実施
    this.param = this.route.snapshot.queryParamMap.get('param');
    if (this.param != null && this.param.length > 0) {
      this.auth(this.param);
    }

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

  // 表示対象の日付変更
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

  // 認可処理
  auth(param: string): void {
    // 認可処理用のuri作成
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    const authUri = this.uri + 'authorization?param=' + this.param + '&userId=' + this.userId;

    // 認可処理を実施
    const observer = this.clientService.rxClient(authUri, 'get', null);
    observer.subscribe((result: Result) => {
      if (!result.isSuccess) {
        // Todo: errorページに遷移
      }
      console.log('認可OK');
    });
  }

  // 事案情報取得
  getScoreInfo(): void {
    // 事案情報取得用のuri作成
    this.claimNumber = this.route.snapshot.queryParamMap.get('claimNumber');
    const scoreUri = this.uri + 'scores?claimNumber=' + this.claimNumber;

    // 事案情報を取得
    const observer = this.clientService.rxClient(scoreUri, 'get', null);
    observer.subscribe((result: Result) => {
      if (result.isSuccess) {
        // console.log('result:', result.data);
        this.claim = result.data['claim'.toString()];// ディープコピーすべきかもしれない(要検討)
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
    });
  }

}
