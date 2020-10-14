// デフォルト設定（environment.ts）を本番用にオーバライドする設定

export const environment = {
  production: true,
  authorize_url: '../api/authorize/authorize',
  scores_url: '../api/scores',
  transition_url: '../api/claims/transition',
  claims_url: '../api/claims/get',
  // TODO: ヘルプページのリンクは修正する
  help_url: 'https://angular.jp/docs'
};
