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

  // import 'web-animations-js';

/**
 * IE11対応：CSS共通化(ponyfill)
 * @author SKK231099 李
 */
cssVars({
  include: 'style',
  onlyLegacy: false,
  watch: true
});