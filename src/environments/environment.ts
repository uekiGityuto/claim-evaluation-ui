// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  restapi_url: 'api',
  pre_token: 'fraud-detection-web_',
  token : '57A41BA987F1BFEFD33EDE675E4AE',
  err_401: '権限がありません。',
  err_403: 'サーバーから拒否されました。',
  err_404: 'ページが見つかりません。',
  err_500: 'サービスを利用できません。管理者にお問い合わせください。',
  err_504: 'Gateway Timeout。管理者にお問い合わせください。',
  err_510: '外部サービスを利用できません。管理者にお問い合わせください。',
  err_520: 'Data処理エラー。管理者にお問い合わせください。',
  err_521: 'Data処理エラー。管理者にお問い合わせください。',
  err_522: 'Data処理エラー。管理者にお問い合わせください。',
  err_523: 'Data処理エラー。管理者にお問い合わせください。',
  err_524: 'Data処理エラー。管理者にお問い合わせください。',
  err_525: 'Data処理エラー。管理者にお問い合わせください。',
  err_526: '画面情報が古いため更新されませんでした。画面を再表示してからもう一度行ってください。',
  score_high: 670,
  score_low: 330
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
