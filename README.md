# git
`git clone <github uri>`  
`git config --global --add user.name <name>` ex> "Jesica"  
`git congig --global --add user.pasword <password>` ex> "12345678"  
`git pull origin master`  
`git add .`  
`git commit -m "description"` 
`git push origin master`

# install
`npm install`  
`npm install --save`  
`npm install --save-dev`

# 起動
`cd ...[your project]`  
`ng serve --proxy-config proxy.config.json`

# URL 
~~browserで次のURLで接続すると画面が表示される。
http://localhost:4200/~~  
テストドライバから画面にアクセスする。（テストドライバの使い方はtest-driverリポジトリのREADME.md参照）

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.  
[追記]ビルド時の--base-hrefオプションに'/www'をセットする。  
例）開発用の場合。
`ng build claim-evaluation --baseHref=/www/`

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
