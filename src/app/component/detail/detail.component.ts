import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Chart, ChartData, ChartOptions } from 'chart.js';

import { CategoryClass } from '../../model/category-class.model';
import { environment } from '../../../environments/environment';
import { UserInfoContainerService } from '../../service/user-info-container.service'
import { ClassService } from '../../service/class.service';

// interfaceをmodelとして切り離したいが、
// IF08APIとIF15APIのそれぞれ異なるフィールドを持つCLAIMオブジェクトを持っているので、
// コンポーネント内に記載

interface Claim {
  CLAIMNUMBER: string;
  INSUREDNAMEKANJI: string;
  INSUREDNAMEKANA: string;
  CONTRACTORNAMEKANJI: string;
  CONTRACTORNAMEKANA: string;
  INSURANCEKIND_EXT: string;
  LOSSDATE: Date;
  UPDATEDATE: Date;
  FRAUDSCOREHISTORY: FraudScore[];
}

interface FraudScore {
  SCORINGDATE: Date;
  CLAIMCATEGORY: string;
  SCOREDETAIL: ScoreDetail[];
}

interface ScoreDetail {
  MODELTYPE: string;
  RANK: string;
  SCORE: string;
  REASONS: Reason[];
}

interface ScoreDetailForDisplay extends ScoreDetail {
  // ngClass用
  categoryClass: CategoryClass;
}

interface Reason {
  REASON: number;
  FEATURENAME: string;
  FEATUREDESCRIPTION: string;
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

  // エラーメッセージ表示用
  isError = false;

  // ビュー表示用（共通部分）
  claimNumber: string;
  claim: Claim;
  userId: string;
  authFlag: boolean;

  // ビュー表示用（任意のスコアリング日に応じて変化する部分）
  claimCategory: string;
  scoringDate: Date;
  scoreDetails: ScoreDetailForDisplay[];
  reasons: { rReason: Reason[], gReason: Reason[]; }[];

  // ngClass用
  categoryClass: CategoryClass;

  // chart用
  @ViewChild('claimCategoryChart')
  elementRef: ElementRef;
  chartData = { labels: [], series1: [], series2: [] };
  chartOptions: ChartOptions;
  context: CanvasRenderingContext2D;
  chart: Chart;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private httpClient: HttpClient,
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
    // HTMLのTitleタグの内容を更新
    this.title.setTitle(this.claimNumber);

    // 事案情報取得
    this.getLatestClaimInfo(this.claimNumber);
  }

  // 最新の事案情報取得
  getLatestClaimInfo(claimNumber: string): void {
    // HTTPリクエストの各情報セット
    const scoresUri = environment.scores_url;
    const params = { userId: this.userId, claimNumber: claimNumber };
    const headers = { 'Content-Type': 'application/json' };

    // 事案情報を取得
    // 本番用
    // this.httpClient.post(scoresUri, params ,{
    //   headers: headers
    // スタブ用
    this.httpClient.get(scoresUri, {
      params: params
    }).subscribe(
      response => {
        // console.log('claim:', response);
        console.log('推論結果取得OK');
        this.isError = false;

        // 取得結果をシャーローコピー
        this.claim = { ...response['CLAIM'.toString()] };

        // 不正請求スコア履歴を算出日の古い順にソート
        this.fraudScoreSort(this.claim.FRAUDSCOREHISTORY);

        // 最新の推論結果を元にビュー要素を取得
        const end = this.claim.FRAUDSCOREHISTORY.length - 1;
        const diplayFraudScore = this.claim.FRAUDSCOREHISTORY[end];
        this.getScoreInfo(diplayFraudScore);

        // チャート作成
        this.chartCreate(this.claim.FRAUDSCOREHISTORY);

      }, error => {
        console.log('照会エラーメッセージ表示');
        this.isError = true;
      }
    );
  }

  // 不正請求スコア履歴を算出日の古い順（昇順）にソート
  fraudScoreSort(history: FraudScore[]): void {
    history.sort((a, b) => {
      return (new Date(a.SCORINGDATE) > new Date(b.SCORINGDATE) ? 1 : -1);
    });
  }

  // 特定算出日の推論結果を元にビュー要素を取得
  getScoreInfo(diplayFraudScore: FraudScore) {
    // 事案カテゴリをセット
    this.claimCategory = diplayFraudScore.CLAIMCATEGORY;
    // 事案カテゴリの背景色をセット
    this.categoryClass = this.classService.setCategoryClass('低', '中', '高', this.claimCategory);
    // 算出日のセット
    this.scoringDate = diplayFraudScore.SCORINGDATE;
    // スコア詳細のセット
    this.scoreDetails = [];
    diplayFraudScore.SCOREDETAIL.forEach((scoreDetail, i) => {
      const categoryClass = this.classService.setCategoryClass('low', 'middle', 'high', scoreDetail.RANK);
      this.scoreDetails[i] = { ...scoreDetail, categoryClass };
      // console.log('categoryClass', this.scoreDetails[i].categoryClass);
    });
    // 推論結果の要因をソート
    this.reasonSort(this.scoreDetails);
  }

  // 推論結果の要因をソート
  reasonSort(scoreDetails: ScoreDetail[]): void {
    this.reasons = [];
    // モデル毎に上昇要因と減少要因に分けて、絶対値の降順に並び変える
    scoreDetails.forEach((scoreDetail, i) => {
      const reasons = scoreDetail.REASONS.slice();
      const descReason = reasons.sort((a, b) => {
        return (a.REASON > b.REASON ? -1 : 1);
      });
      const gReason = descReason.filter(val => val.REASON >= 0);
      const rReason = descReason.reverse().filter(val => val.REASON < 0);
      this.reasons[i] = { gReason, rReason };
    });
    console.log('this.reasons', this.reasons);
  };

  // チャート作成
  chartCreate(history: FraudScore[]): void {
    // チャートデータのセット
    this.chartData.labels = [];
    this.chartData.series1 = [];
    this.chartData.series2 = [];

    history.forEach((fraudScore, i) => {
      const scoringDate = new Date(fraudScore.SCORINGDATE);
      // ラベルを日付と事案カテゴリの配列にする（日付\n事案カテゴリと表示される）
      this.chartData.labels[i] =
        [this.datepipe.transform(scoringDate, 'M/d'), fraudScore.CLAIMCATEGORY];
      this.chartData.series1[i] = fraudScore.SCOREDETAIL[0].SCORE;
      this.chartData.series2[i] = fraudScore.SCOREDETAIL[1].SCORE;
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
        this.changeDate(elements, history);
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
          backgroundColor: [environment.specialCase_bg_color],
          borderColor: [environment.specialCase_border_color],
          steppedLine: true,
          borderWidth: 4,
        }, {
          label: 'NC/PDモデル',
          data: this.chartData.series2,
          backgroundColor: [environment.ncpd_bg_color],
          borderColor: [environment.ncpd_border_color],
          steppedLine: true,
          borderWidth: 2,
        }],
      },
      options: this.chartOptions,
    });
  };

  // 表示対象の日付変更
  changeDate(elements, history: FraudScore[]) {
    if (!elements || elements.length === 0) {
      console.log('要素が選択出来ていません');
    } else {
      const element = elements[0];
      console.log('onClick._index:', element['_index'.toString()]);
      const diplayFraudScore = history[element['_index'.toString()]];
      this.getScoreInfo(diplayFraudScore);
    }
  }

  // 事案一覧ページに遷移
  displayList(): void {
    console.log('事案一覧ページへ遷移');
    this.router.navigate(['list']);
  };

  // ヘルプ表示
  displayHelp() {
    window.open(environment.help_url);
  }

}
