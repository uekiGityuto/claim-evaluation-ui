import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Chart, ChartData, ChartOptions } from 'chart.js';

import { CategoryClass } from '../../model/category-class';
import { CategoryMatrix } from '../../model/category-matrix';
import { CategoryMatrixClass } from '../../model/category-matrix-class';
import { RaiseLowerReason } from '../../model/raise-lower-reason';
import { ScoreCategory } from '../../model/score-category';
import { ScoreDetail } from '../../model/score-detail';
import { ScoreDetailView } from '../../model/score-detail-view';
import { FraudScore } from '../../model/fraud-score';

import { environment } from '../../../environments/environment';
import { UserInfoContainerService } from '../../service/user-info-container.service';

interface Scores {
  CLAIM: Claim;
}

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
  categoryMatrix: CategoryMatrix;
  scoreDetails: ScoreDetailView[];
  raiseLowerReasons: RaiseLowerReason[] = [];

  // ngClass用
  categoryClass: CategoryClass;

  // chart用
  @ViewChild('claimCategoryChart')
  elementRef: ElementRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private httpClient: HttpClient,
    private userInfo: UserInfoContainerService,
    private datepipe: DatePipe
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
    const params = { CLAIMNUMBER: claimNumber };
    const headers = { 'Content-Type': 'application/json' };

    // 事案情報を取得
    // 本番用
    this.httpClient.post<Scores>(scoresUri, params, {
      headers: headers
      // スタブ用
      // this.httpClient.get(scoresUri, {
      //   params: params
    }).subscribe(
      response => {
        // console.log('claim:', response);
        console.log('推論結果取得OK');
        this.isError = false;

        // 取得結果をシャーローコピー
        // this.claim = { ...response['CLAIM'.toString()] };
        console.log('response:', response);
        this.claim = { ...response.CLAIM };

        // 不正請求スコア履歴を算出日の古い順にソート
        this.fraudScoreSort(this.claim.FRAUDSCOREHISTORY);

        // 最新の推論結果を元にビュー要素を取得
        const end = this.claim.FRAUDSCOREHISTORY.length - 1;
        const fraudScoreView = this.claim.FRAUDSCOREHISTORY[end];
        this.getScoreInfo(fraudScoreView);

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
  getScoreInfo(fraudScoreView: FraudScore) {
    // 事案カテゴリをセット
    this.claimCategory = fraudScoreView.CLAIMCATEGORY;
    // 事案カテゴリの背景色をセット
    this.categoryClass = new CategoryClass('高', '中', '低', this.claimCategory);
    // 算出日のセット
    this.scoringDate = fraudScoreView.SCORINGDATE;
    // 事案カテゴリマトリクスをセット
    this.categoryMatrix = this.setCategoryMatrix(fraudScoreView.SCORECATEGORIES);
    // スコア詳細のセット
    this.scoreDetails = [];
    fraudScoreView.SCOREDETAIL.forEach((scoreDetail, i) => {
      // TODO: 大文字小文字を確認
      const categoryClass = new CategoryClass('high', 'middle', 'low', scoreDetail.RANK);
      this.scoreDetails[i] = { ...scoreDetail, categoryClass };
      // console.log('categoryClass', this.scoreDetails[i].categoryClass);
    });
    // 推論結果の要因をソート
    this.raiseLowerReasons = this.reasonSort(this.scoreDetails);
  }

  // 事案カテゴリマトリクスのセット
  setCategoryMatrix(scoreCategorys: ScoreCategory[]): CategoryMatrix {
    const categoryMatrix = new CategoryMatrix();

    scoreCategorys.forEach(scoreCategory => {
      switch (scoreCategory.TOKUSHUSCORECLASS) {
        case 'High':
          switch (scoreCategory.NCPDSCORECLASS) {
            case 'High':
              categoryMatrix.highHigh = scoreCategory.CLAIMCATEGORYTYPE;
              categoryMatrix.highHighColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.CLAIMCATEGORYTYPE);
              break;
            case 'Middle':
              categoryMatrix.highMiddle = scoreCategory.CLAIMCATEGORYTYPE;
              categoryMatrix.highMiddleColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.CLAIMCATEGORYTYPE);
              break;
            case 'Low':
              categoryMatrix.highLow = scoreCategory.CLAIMCATEGORYTYPE;
              categoryMatrix.highLowColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.CLAIMCATEGORYTYPE);
              break;
          }
          break;
        case 'Middle':
          switch (scoreCategory.NCPDSCORECLASS) {
            case 'High':
              categoryMatrix.middleHigh = scoreCategory.CLAIMCATEGORYTYPE;
              categoryMatrix.middleHighColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.CLAIMCATEGORYTYPE);
              break;
            case 'Middle':
              categoryMatrix.middleMiddle = scoreCategory.CLAIMCATEGORYTYPE;
              categoryMatrix.middleMiddleColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.CLAIMCATEGORYTYPE);
              break;
            case 'Low':
              categoryMatrix.middleLow = scoreCategory.CLAIMCATEGORYTYPE;
              categoryMatrix.middleLowColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.CLAIMCATEGORYTYPE);
              break;
          }
          break;
        case 'Low':
          switch (scoreCategory.NCPDSCORECLASS) {
            case 'High':
              categoryMatrix.lowHigh = scoreCategory.CLAIMCATEGORYTYPE;
              categoryMatrix.lowLowColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.CLAIMCATEGORYTYPE);
              break;
            case 'Middle':
              categoryMatrix.lowMiddle = scoreCategory.CLAIMCATEGORYTYPE;
              categoryMatrix.lowMiddleColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.CLAIMCATEGORYTYPE);
              break;
            case 'Low':
              categoryMatrix.lowLow = scoreCategory.CLAIMCATEGORYTYPE;
              categoryMatrix.lowLowColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.CLAIMCATEGORYTYPE);
              break;
          }
          break;
      }
    });
    return categoryMatrix;
  }

  // 推論結果の要因をソート
  reasonSort(scoreDetails: ScoreDetail[]): RaiseLowerReason[] {
    let raiseLowerReasons: RaiseLowerReason[] = [];
    // モデル毎に上昇要因と減少要因に分けて、絶対値の降順に並び変える
    scoreDetails.forEach((scoreDetail, i) => {
      const reasons = scoreDetail.REASONS.slice();
      const descReason = reasons.sort((a, b) => {
        return (a.REASON > b.REASON ? -1 : 1);
      });
      const raiseReason = descReason.filter(val => val.REASON >= 0);
      const lowerReason = descReason.reverse().filter(val => val.REASON < 0);
      const raizeLowerReason = new RaiseLowerReason(raiseReason, lowerReason);
      raiseLowerReasons.push(raizeLowerReason);
    });
    return raiseLowerReasons;
  };

  // チャート作成
  chartCreate(history: FraudScore[]): void {

    // canvasの取得
    const context: CanvasRenderingContext2D = this.elementRef.nativeElement.getContext('2d');
    // context.scale(2,2);

    // グローバル設定セット
    Chart.defaults.global.defaultFontColor = '#000000';
    Chart.defaults.global.defaultFontFamily = '"Meiryo UI", "Meiryo", "Yu Gothic UI", "Yu Gothic", "YuGothic"';
    Chart.defaults.global.defaultFontSize = 12;

    // ラベルとデータセットのセット
    const labels: Array<string[]> = [];
    const series1: number[] = [];
    const series2: number[] = [];
    history.forEach((fraudScore, i) => {
      const scoringDate = new Date(fraudScore.SCORINGDATE);
      labels[i] =
        [this.datepipe.transform(scoringDate, 'M/d'), fraudScore.CLAIMCATEGORY];
      series1[i] = parseFloat(fraudScore.SCOREDETAIL[0].SCORE);
      series2[i] = parseFloat(fraudScore.SCOREDETAIL[1].SCORE);
    });

    // チャートデータのセット
    const chartData: ChartData = {
      labels: labels,
      datasets: [{
        label: this.scoreDetails[0].MODELTYPE,
        type: 'line',
        fill: false,
        data: series1,
        backgroundColor: [environment.specialCase_bg_color],
        borderColor: [environment.specialCase_border_color],
        yAxisID: 'y-axis-1',
        steppedLine: true,
        borderWidth: 4
      }, {
        label: this.scoreDetails[1].MODELTYPE,
        type: 'line',
        fill: false,
        data: series2,
        backgroundColor: [environment.ncpd_bg_color],
        borderColor: [environment.ncpd_border_color],
        yAxisID: 'y-axis-1',
        steppedLine: true,
        borderWidth: 2
      }],
    };

    // チャートオプションのセット
    const chartOptions: ChartOptions = {
      tooltips: {
        mode: 'nearest',
        intersect: false,
      },
      responsive: true,
      layout: {
        padding: {
          left: 25,
          right: 0,
          top: 16,
          bottom: 0
        }
      },
      legend: {
        display: true,
        position: 'right',
        fullWidth: true,
      },
      scales: {
        xAxes: [{
          position: 'top',
          ticks: {
            callback: (value, index, values) => {
              return '';
            }
          },
          gridLines: {
            display: false,
          },
        }],
        yAxes: [{
          id: 'y-axis-1',
          type: 'linear',
          position: 'left',
          ticks: {
            max: 120,
            min: 0,
            stepSize: 20,
            callback: (value, index, values) => {
              return (value === 100 || value === 0) ? value : '';
            }
          },
          scaleLabel: {
            display: false
          },
        }, {
          id: 'y-axis-2',
          type: 'linear',
          display: false,
          ticks: {
            max: 120,
            min: 0,
            stepSize: 20
          },
          gridLines: {
            drawOnChartArea: false
          }
        }],
      },
      // TODO: tooltipがclickをトリガーに表示されるようになり、
      // 他のポイントをクリックしないと消えなくなるので要検討
      events: ['click'],
      onClick: (event, elements) => {
        this.changeDate(elements, history);
      }
    };

    // チャートの作成
    const chartLines = new Chart(context, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });

    // データセット描写後処理
    Chart.plugins.register({
      afterDatasetsDraw: (chart, easing) => {
        // 縦軸ラベル描写
        context.font = '12px "Meiryo UI"';
        context.fillStyle = '#000000';
        context.fillText('スコア', 2, Math.floor(chart.height / 2) + 20);
        console.log('「スコア」設定後のcontext:', context);
        // 日付ラベルと事案カテゴリラベルの表示位置を決める情報をセット
        let nLeft = 62;
        const nRight = 170;
        const nMove = (chart.width - nLeft - nRight) / chartLines.data.labels.length;
        nLeft += nMove / 2;
        chartLines.data.labels.forEach(label => {
          // 日付ラベル表示
          context.font = '16px "Meiryo UI"';
          context.fillStyle = '#000000';
          let nTextWidth = context.measureText(label[0]).width;
          context.fillText(label[0], nLeft - (nTextWidth / 2), 10);
          // 事案カテゴリラベル表示
          context.font = '16px "Meiryo UI"';
          if (label[1] === '高') {
            context.fillStyle = '#f0554e';
          } else if (label[1] === '中') {
            context.fillStyle = '#f3ca3e';
          } else if (label[1] === '低') {
            context.fillStyle = '#2ac940';
          }
          nTextWidth = context.measureText(label[1]).width;
          context.fillText(label[1], nLeft - (nTextWidth / 2), 30);
          nLeft += nMove;
        });
      }
    });
  };

  // 表示対象の日付変更
  changeDate(elements, history: FraudScore[]) {
    if (!elements || elements.length === 0) {
      console.log('要素が選択出来ていません');
    } else {
      const element = elements[0];
      console.log('onClick._index:', element['_index'.toString()]);
      const fraudScoreView = history[element['_index'.toString()]];
      this.getScoreInfo(fraudScoreView);
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
