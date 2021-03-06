import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, HostListener  } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Chart, ChartData, ChartOptions } from 'chart.js';

import { CategoryClass } from '../../model/category-class';
import { CategoryMatrix } from '../../model/category-matrix';
import { CategoryMatrixClass } from '../../model/category-matrix-class';
import { RaiseLowerReason } from '../../model/raise-lower-reason';
import { ScoreDetailView } from '../../model/score-detail-view';
import { DetailClaim } from '../../model/scores/detail-claim';
import { FraudScore } from '../../model/scores/fraud-score';
import { ScoreDetail } from '../../model/scores/score-detail';
import { ScoreCategory } from '../../model/scores/score-category';

import { environment } from '../../../environments/environment';

import { ScoresClientService } from '../../service/scores-client.service';
import { UserInfoContainerService } from '../../service/user-info-container.service';

/**
 * CE-S01スコア詳細画面のコンポーネント
 * @author SKK231527 植木
 */
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit, AfterViewChecked {

  // 照会状態管理用
  normal = 0;
  error = 1;
  inquiring = 2;
  complete = 3;
  inquiryStatus = this.normal;

  // ビュー表示用（共通部分）
  claimNumber: string;
  claim: DetailClaim;
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
  claimCategoryChart: ElementRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private client: ScoresClientService,
    private userInfo: UserInfoContainerService,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    // 受付番号
    this.claimNumber = this.route.snapshot.paramMap.get('claimNumber');

    // ユーザ情報取得
    this.authFlag = this.userInfo.authFlag;
    this.userId = this.userInfo.userId;

    // HTMLのTitleタグの内容を更新
    this.title.setTitle(`スコア詳細: ${this.claimNumber}`);

    // スコア詳細取得
    this.getLatestClaimInfo(this.claimNumber);
  }

  ngAfterViewChecked(): void {
    if (this.inquiryStatus !== this.normal || this.claimCategoryChart === null) {
      return;
    }
    // チャート作成
    this.createChart(this.claim.fraudScoreHistory);
    this.inquiryStatus = this.complete;
  }

  // 最新のスコア詳細取得
  getLatestClaimInfo(claimNumber: string): void {
    // 照会中のレイアウトに変更
    this.inquiryStatus = this.inquiring;

    // スコア詳細取得
    this.client.post(claimNumber).subscribe(
      response => {
        // 照会結果表示のレイアウトに変更
        this.inquiryStatus = this.normal;

        // 取得結果をシャーローコピー
        this.claim = { ...response.claim };

        // モデルが1つしかない場合に対応するための処理
        this.claim.fraudScoreHistory = this.setModel(this.claim.fraudScoreHistory);

        // 不正請求スコア履歴を算出日の古い順にソート
        this.claim.fraudScoreHistory = this.sortFraudScoreHistoryInAsc(this.claim.fraudScoreHistory);

        // 最新の推論結果を元にビュー要素を取得
        const end = this.claim.fraudScoreHistory.length - 1;
        const fraudScoreView = this.claim.fraudScoreHistory[end];
        this.getScoreInfo(fraudScoreView);

      }, error => {
        this.inquiryStatus = this.error;
      }
    );
  }

  // モデルが存在すればmodelPresenceにtrueをセットし、
  // 存在しなければmodelPresenceにfalseがセットされたScoreDetailを追加
  setModel(history: FraudScore[]) {
    history.forEach(fraudScore => {
      if (fraudScore.scoreDetail.length === 1) {
        fraudScore.scoreDetail[0].modelPresence = true;
        const modelType = fraudScore.scoreDetail[0].modelType === environment.priority_model ?
          environment.secondary_model : environment.priority_model;
        fraudScore.scoreDetail.push(new ScoreDetail(modelType));
      } else {
        fraudScore.scoreDetail.forEach(scoreDetail => {
          scoreDetail.modelPresence = true;
        });
      }
    });
    return history;
  }

  // 不正請求スコア履歴を算出日の古い順（昇順）にソート
  sortFraudScoreHistoryInAsc(history: FraudScore[]): FraudScore[] {
    history.sort((a, b) => {
      return (new Date(a.scoringDate) > new Date(b.scoringDate) ? 1 : -1);
    });
    return history;
  }

  // 特定算出日の推論結果を元にビュー要素を取得
  getScoreInfo(fraudScoreView: FraudScore) {
    // 事案カテゴリをセット
    this.claimCategory = fraudScoreView.claimCategory;
    // 事案カテゴリの背景色をセット
    this.categoryClass = new CategoryClass('高', '中', '低', this.claimCategory);
    // 算出日のセット
    this.scoringDate = fraudScoreView.scoringDate;
    // 事案カテゴリマトリクスをセット
    this.categoryMatrix = this.setCategoryMatrix(fraudScoreView.scoreCategories);
    // モデルのソート
    fraudScoreView = this.sortModel(fraudScoreView);
    // スコア詳細のセット
    this.scoreDetails = [];
    fraudScoreView.scoreDetail.forEach((scoreDetail, i) => {
      const categoryClass = new CategoryClass('High', 'Middle', 'Low', scoreDetail.rank);
      this.scoreDetails[i] = { ...scoreDetail, categoryClass };
    });
    // 推論結果の要因をソート
    this.raiseLowerReasons = this.sortReasonInAbsoluteDesc(this.scoreDetails);
  }

  // 事案カテゴリマトリクスのセット
  setCategoryMatrix(scoreCategorys: ScoreCategory[]): CategoryMatrix {
    const categoryMatrix = new CategoryMatrix();

    scoreCategorys.forEach(scoreCategory => {
      switch (scoreCategory.tokushuScoreClass) {
        case 'High':
          switch (scoreCategory.ncpdScoreClass) {
            case 'High':
              categoryMatrix.highHigh = scoreCategory.claimCategoryType;
              categoryMatrix.highHighColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.claimCategoryType);
              break;
            case 'Middle':
              categoryMatrix.highMiddle = scoreCategory.claimCategoryType;
              categoryMatrix.highMiddleColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.claimCategoryType);
              break;
            case 'Low':
              categoryMatrix.highLow = scoreCategory.claimCategoryType;
              categoryMatrix.highLowColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.claimCategoryType);
              break;
          }
          break;
        case 'Middle':
          switch (scoreCategory.ncpdScoreClass) {
            case 'High':
              categoryMatrix.middleHigh = scoreCategory.claimCategoryType;
              categoryMatrix.middleHighColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.claimCategoryType);
              break;
            case 'Middle':
              categoryMatrix.middleMiddle = scoreCategory.claimCategoryType;
              categoryMatrix.middleMiddleColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.claimCategoryType);
              break;
            case 'Low':
              categoryMatrix.middleLow = scoreCategory.claimCategoryType;
              categoryMatrix.middleLowColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.claimCategoryType);
              break;
          }
          break;
        case 'Low':
          switch (scoreCategory.ncpdScoreClass) {
            case 'High':
              categoryMatrix.lowHigh = scoreCategory.claimCategoryType;
              categoryMatrix.lowHighColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.claimCategoryType);
              break;
            case 'Middle':
              categoryMatrix.lowMiddle = scoreCategory.claimCategoryType;
              categoryMatrix.lowMiddleColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.claimCategoryType);
              break;
            case 'Low':
              categoryMatrix.lowLow = scoreCategory.claimCategoryType;
              categoryMatrix.lowLowColor = new CategoryMatrixClass('高', '中', '低', scoreCategory.claimCategoryType);
              break;
          }
          break;
      }
    });
    return categoryMatrix;
  }

  // モデルのソート（特殊事案推定モデル、NC/PD推定モデルの順にソート）
  sortModel(fraudScoreView: FraudScore): FraudScore {
    fraudScoreView.scoreDetail.sort((a, b) => {
      return (a.modelType === environment.priority_model) ? -1 : 1;
    });
    return fraudScoreView;
  }

  // 推論結果の要因をソート
  sortReasonInAbsoluteDesc(scoreDetails: ScoreDetail[]): RaiseLowerReason[] {
    const raiseLowerReasons: RaiseLowerReason[] = [];
    // モデル毎に上昇要因と減少要因に分けて、絶対値の降順に並び変える
    scoreDetails.forEach((scoreDetail, i) => {
      if (scoreDetail.modelPresence) {
        const reasons = scoreDetail.reasons.slice();
        const descReason = reasons.sort((a, b) => {
          return (a.reason > b.reason ? -1 : 1);
        });
        const raiseReason = descReason.filter(val => val.reason >= 0);
        const lowerReason = descReason.reverse().filter(val => val.reason < 0);
        const raizeLowerReason = new RaiseLowerReason(raiseReason, lowerReason);
        raiseLowerReasons.push(raizeLowerReason);
      } else {
        raiseLowerReasons.push(null);
      }
    });
    return raiseLowerReasons;
  }

  // チャート作成
  createChart(history: FraudScore[]): void {

    // canvasの取得
    const context: CanvasRenderingContext2D = this.claimCategoryChart.nativeElement.getContext('2d');

    // グローバル設定セット
    Chart.defaults.global.defaultFontColor = environment.chart_font_color;
    Chart.defaults.global.defaultFontFamily = environment.chart_font_familiy;
    Chart.defaults.global.defaultFontSize = environment.chart_font_size;

    // ラベルとデータセットのセット
    const labels: Array<string[]> = [];
    const series1: number[] = [];
    const series2: number[] = [];
    history.forEach((fraudScore, i) => {
      const scoringDate = new Date(fraudScore.scoringDate);
      labels[i] =
        [this.datepipe.transform(scoringDate, 'M/d'), fraudScore.claimCategory];
      series1[i] = fraudScore.scoreDetail[0].score;
      series2[i] = fraudScore.scoreDetail[1].score;
    });

    // チャートデータのセット
    const chartData: ChartData = {
      labels: labels,
      datasets: [{
        label: this.scoreDetails[0].modelType,
        type: 'line',
        fill: false,
        data: series1,
        backgroundColor: [environment.chart_specialCase_bg_color],
        borderColor: [environment.chart_specialCase_border_color],
        yAxisID: 'y-axis-1',
        steppedLine: true,
        borderWidth: 4
      }, {
        label: this.scoreDetails[1].modelType,
        type: 'line',
        fill: false,
        data: series2,
        backgroundColor: [environment.chart_ncpd_bg_color],
        borderColor: [environment.chart_ncpd_border_color],
        yAxisID: 'y-axis-2',
        steppedLine: true,
        borderWidth: 2
      }],
    };

    // チャートオプションのセット
    const chartOptions: ChartOptions = {
      tooltips: {
        mode: 'nearest',
        intersect: true
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
            max: 1,
            min: 0,
            stepSize: 0.1,
            callback: (value, index, values) => {
              return (value === 1 || value === 0) ? value : '';
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
            max: 1,
            min: 0,
            stepSize: 0.1
          },
          gridLines: {
            drawOnChartArea: false
          }
        }],
      },
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
        context.font = environment.chart_label_font;
        context.fillStyle = environment.chart_font_color;
        context.fillText('スコア', 2, Math.floor(chart.height / 2) + 20);
        // 日付ラベルと事案カテゴリラベルの表示位置を決める情報をセット
        let nLeft = 62;
        const nRight = 170;
        const nMove = (chart.width - nLeft - nRight) / chartLines.data.labels.length;
        nLeft += nMove / 2;
        // const nLabel = chartLines.data.labels.length;
        chartLines.data.labels.forEach(label => {
          // 日付ラベル表示
          context.font = environment.chart_date_label_font;
          context.fillStyle = environment.chart_font_color;
          let nTextWidth = context.measureText(label[0]).width;
          context.fillText(label[0], nLeft - (nTextWidth / 2), 10);
          // 事案カテゴリラベル表示
          context.font = environment.chart_category_label_font;
          if (label[1] === '高') {
            context.fillStyle = environment.chart_category_high_font_color;
          } else if (label[1] === '中') {
            context.fillStyle = environment.chart_category_middle_font_color;
          } else if (label[1] === '低') {
            context.fillStyle = environment.chart_category_low_font_color;
          } else {
            label[1] = '-';
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
    } else {
      const element = elements[0];
      const fraudScoreView = history[element['_index'.toString()]];
      this.getScoreInfo(fraudScoreView);
    }
  }

  // 事案一覧ページに遷移
  displayList(): void {
    this.router.navigate(['list']);
  };

  // ヘルプ表示
  displayHelp() {
    window.open(environment.help_url);
  }

  // F5禁止
  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'F5') {
      event.preventDefault();
    }
  }

}
