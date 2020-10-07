// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // restapi_url: 'api',
  // auth_url: 'http://localhost:3000/authorize',
  authorize_url: 'claim-evaluation/api/authorize/authorize',
  // scores_url: 'http://localhost:3000/scores',
  scores_url: 'claim-evaluation/api/scores',
  // claim_list_url: 'http://localhost:3000/claimList',
  transition_url: 'claim-evaluation/api/claims/transition',
  // claims_url: 'http://localhost:3000/claims',
  claims_url: 'claim-evaluation/api/claims/get',
  help_url: 'https://angular.jp/docs',
  priority_model: '特殊事案推定モデル',
  secondary_model: 'NC/PD推定モデル',
  chart_type: 'line',
  specialCase_bg_color: 'rgba(0, 0, 255, 0)',
  specialCase_border_color: 'rgba(20, 0, 255, 100)',
  ncpd_bg_color: 'rgba(135, 206, 250, 0)',
  ncpd_border_color: 'rgba(135, 206, 250, 100)',
  claimNumber: '1',
  insuredName: '2',
  contractorName: '3',
  department: '4',
  base: '5',
  insuranceKind: '6',
  lastUpdateDate: '7',
  lossDate: '8',
  claimCategory: '9',
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
