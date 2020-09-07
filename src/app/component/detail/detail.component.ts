import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Chart, ChartData, ChartOptions } from 'chart.js';

// import { Claim } from '../../model/Claim.model';
// import { FraudScore } from '../../model/FraudScore.model';
// import { ScoreDetail } from '../../model/ScoreDetail.model';
// import { Reason } from '../../model/Reason.model';
import { Result } from '../../model/result.model';
import { CategoryClass } from '../../model/category-class.model';
import { CategoryMatrixClass } from '../../model/category-matrix-class.model';
import { environment } from '../../../environments/environment';
import { ObservableClientService } from '../../service/observable-client.service';
import { UserInfoContainerService } from '../../service/user-info-container.service';
import { ClassService } from '../../service/class.service';

// Todo: interfaceをmodelとして切り離すか要検討

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

interface ScoreDetailForDisplay extends ScoreDetail {
  // ngClass用
  categoryClass: CategoryClass;
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

  // ビュー表示用（共通部分）
  userId: string;
  authFlag: boolean;
  insuredName: string;
  contractorName: string;
  insurancetype: string;
  accidentDate: Date;
  updateDate: Date;

  // ビュー表示用（任意のスコアリング日に応じて変化する部分）
  claimCategory: string;
  scoringDate: Date;
  scoreDetails: ScoreDetailForDisplay[];
  reasons: { rReason: Reason[], gReason: Reason[]; }[];

  // ngClass用
  categoryClass: CategoryClass;
  specialCaseHigh = new CategoryMatrixClass();
  specialCaseLow = new CategoryMatrixClass();
  specialCaseMiddle = new CategoryMatrixClass();
  ncpdHigh = new CategoryMatrixClass();
  ncpdMiddle = new CategoryMatrixClass();
  ncpdLow = new CategoryMatrixClass();

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
    private userInfo: UserInfoContainerService,
    private datepipe: DatePipe,
    private classService: ClassService
  ) { }

  ngOnInit(): void {
    // ユーザ情報取得
    this.authFlag = this.userInfo.authFlag;
    this.userId = this.userInfo.userId;

    // 受付番号取得
    this.claimNumber = this.route.snapshot.paramMap.get('claimNumber');

    // 事案情報取得
    this.getLatestClaimInfo();
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

  // 最新の事案情報取得
  getLatestClaimInfo(): void {
    // 事案情報取得用のuri作成
    const scoreUri = this.uri + 'scores';
    const param = { userId: this.userId, claimNumber: this.claimNumber };
    console.log('this.claimNumber', this.claimNumber);

    // 事案情報を取得
    // const observer = this.clientService.rxClient(claimUri, 'post', param);// 本番用
    const observer = this.clientService.rxClient(scoreUri + '?claimNumber=' + this.claimNumber, 'get', null);// モック用
    observer.subscribe((result: Result) => {
      if (result.isSuccess) {
        // 取得結果をシャーローコピー
        this.claim = { ...result.data['claim'.toString()] };
        // console.log('claim:', this.claim);

        // 共通部分のビュー要素を取得
        this.claimNumber = this.claim.claimNumber;
        this.insuredName = this.claim.insuredNameKana;
        this.contractorName = this.claim.contractorNameKana;
        this.insurancetype = this.claim.insuranceKind;
        this.accidentDate = this.claim.lossDate;
        this.updateDate = this.claim.updateDate;

        // 最新の推論結果を元にビュー要素を取得
        const end = this.claim.fraudScoreHistory.length - 1;
        const diplayFraudScore = this.claim.fraudScoreHistory[end];
        this.getScoreInfo(diplayFraudScore);

        // チャート作成
        this.chartCreate();

      } else {
        // Todo: errorページへの遷移を修正
        console.log('errorページに遷移');
        this.router.navigate(['/detail/error']);
      }
    });
  }

  // 特定算出日の推論結果を元にビュー要素を取得
  getScoreInfo(diplayFraudScore: FraudScore) {
    this.claimCategory = diplayFraudScore.claimCategory;
    this.categoryClass = this.classService.setCategoryClass('低', '中', '高', this.claimCategory);
    // console.log('this.claimCategoryClass', this.categoryClass);
    this.scoringDate = diplayFraudScore.scoringDate;
    // スコア詳細のセット
    this.scoreDetails = [];
    diplayFraudScore.scoreDetails.forEach((scoreDetail, i) => {
      const categoryClass = this.classService.setCategoryClass('low', 'middle', 'high', scoreDetail.rank);
      this.scoreDetails[i] = { ...scoreDetail, categoryClass };
      // console.log('categoryClass', this.scoreDetails[i].categoryClass);
    });
    // 事案カテゴリマトリクスの赤網掛け
    this.coverRed(this.scoreDetails);
    // 推論結果の要因をソート
    this.reasonSort(this.scoreDetails);
  }

  // 事案カテゴリマトリックスの赤網掛け
  coverRed(scoreDetails: ScoreDetail[]) {
    // 初期化
    this.specialCaseHigh.now = false;
    this.specialCaseMiddle.now = false;
    this.specialCaseLow.now = false;
    this.ncpdHigh.now = false;
    this.ncpdMiddle.now = false;
    this.ncpdLow.now = false;

    // 赤網掛けする場所を特定
    // Todo: 保守性が低いので修正
    if (scoreDetails[0].rank === 'high') {
      this.specialCaseHigh.now = true;
    } else if (scoreDetails[0].rank === 'middle') {
      this.specialCaseMiddle.now = true;
    } else if (scoreDetails[0].rank === 'low') {
      this.specialCaseLow.now = true;
    }
    if (scoreDetails[1].rank === 'high') {
      this.ncpdHigh.now = true;
    } else if (scoreDetails[1].rank === 'middle') {
      this.ncpdMiddle.now = true;
    } else if (scoreDetails[1].rank === 'low') {
      this.ncpdLow.now = true;
    }
  }

  // 推論結果の要因をソート
  reasonSort(scoreDetails: ScoreDetail[]): void {
    // 推論結果の詳細を表示
    // モデル毎に上昇要因と減少要因に分けて、絶対値の降順に並び変える
    this.reasons = [];
    scoreDetails.forEach((scoreDetail, i) => {
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
      // ラベルを日付と事案カテゴリの配列にする（日付\n事案カテゴリと表示される）
      this.chartData.labels[i] =
        [this.datepipe.transform(scoringDate, 'M/d'), fraudScore.claimCategory];
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
              max: 100
            },
          }],
        xAxes: [
          {
            ticks: {
              fontSize: 16,
              // fontColor: ['#f0554e', '#f3ca3e'],
              // callback: (tickValue, index, ticks) => {
              // return tickValue;
              // }
            },
          }],
      },
      events: ['click'],
      onClick: (event, elements) => {
        this.changeDate(elements);
      }
    };

    // canvasの取得
    this.context = this.elementRef.nativeElement.getContext('2d');
    // チャートの作成
    // console.log('this.chartData.series1', this.chartData.series1);
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
  changeDate(elements) {
    if (!elements || elements.length === 0) {
      console.log('要素が選択出来ていません');
    } else {
      const element = elements[0];
      console.log('onClick._index:', element['_index'.toString()]);
      const diplayFraudScore = this.claim.fraudScoreHistory[element['_index'.toString()]];
      this.getScoreInfo(diplayFraudScore);
    }
  }

  // 事案一覧ページに遷移
  displayList(): void {
    console.log('事案一覧ページへ遷移');
    this.router.navigate(['list']);
  }

  // ヘルプ表示
  displayHelp() {
    window.open(environment.help_url);
  }

}
