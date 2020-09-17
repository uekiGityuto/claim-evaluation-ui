import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import cssVars from 'css-vars-ponyfill';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

/**
 * IE11対応でcss variableをponyfillで使用できる設定。
 *
 * css-vars-ponyfillを使用。
 */
cssVars({
  include: 'style',
  onlyLegacy: false,
  watch: true
});
