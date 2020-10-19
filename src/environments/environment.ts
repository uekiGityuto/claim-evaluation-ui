// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  authorize_url: '../api/authorize/authorize',
  scores_url: '../api/scores',
  transition_url: '../api/claims/transition',
  claims_url: '../api/claims/get',
  help_url: 'https://angular.jp/docs',
  priority_model: '特殊事案推定モデル',
  secondary_model: 'NC/PD推定モデル',
  chart_font_color: '#000000',
  chart_font_familiy: '"Meiryo UI", "Meiryo", "Yu Gothic UI", "Yu Gothic", "YuGothic"',
  chart_font_size: 12,
  chart_specialCase_bg_color: 'rgba(0, 0, 255, 0)',
  chart_specialCase_border_color: 'rgba(20, 0, 255, 100)',
  chart_ncpd_bg_color: 'rgba(135, 206, 250, 0)',
  chart_ncpd_border_color: 'rgba(135, 206, 250, 100)',
  chart_label_font: '12px "Meiryo UI"',
  chart_date_label_font: '12px "Meiryo UI"',
  chart_category_label_font: '16px "Meiryo UI"',
  chart_category_high_font_color: '#f0554e',
  chart_category_middle_font_color: '#f3ca3e',
  chart_category_low_font_color: '#2ac940',
  form_size: '40px',
  claimNumber: '1',
  insuredName: '2',
  contractorName: '3',
  base: '4',
  insuranceKind: '5',
  lastUpdateDate: '6',
  lossDate: '7',
  claimCategory: '8',
  asc: '00',
  desc: '01'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
