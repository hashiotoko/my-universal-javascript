# Linter と Formatter

## (前提)静的解析と動的解析

(静的解析)

* ソフトウェアのコードを読み込んで、その構造や予想される動作を解析すること
* 以下のあたりを検出するために使用する
  * コード上の欠陥
  * 設計上の問題(ex: コードの行数、複雑度、凝集度、結合度)
  * セキュリティ上の脆弱性
  * 似たようなコードの存在
  * オープンソースコードの存在

(動的解析)

* ソフトウェア(実行コード、テストコード)を動作させた際の動作を解析する
* 以下のあたりを検出するために使用する
  * メモリリーク、メモリ破壊
  * 並列処理上の問題
  * パフォーマンス上の問題
  * カバレッジの計測

(ref)

* https://monoist.itmedia.co.jp/mn/articles/1605/20/news004_2.html

## Linter とは

* プログラムの静的解析ツール
* 「Lint」という解析ツールの名前に由来

## Formatter とは

* コードのスタイルをチェックするツール
* プログラムの動作ではなく見た目に関わる内容を指摘、修正してくれる

## js における Linter と Formatter

Linterとして [eslint](https://eslint.org/) を使い、eslint にも存在するフォーマッター機能は無効化して、
Formatter としてより高機能な [prettier](https://prettier.io/) を併用するのがスタンダード

Linter と Formatter を兼ねたより処理が早い[biome](https://biomejs.dev/)も今後きそう


(ref)

* https://qiita.com/aoka/items/741a74c28f944ff91f81
* https://npmtrends.com/eslint-vs-jshint-vs-jslint-vs-prettier

## eslintrc

(ref)

* https://www.sunapro.com/eslint-settings/

### plugins と extends の違い

* `plugins`
  * eslint に拡張機能(ルールなど)を追加するプロパティ
  * この設定によって実際に実際に設定が適用するわけではない
  * これを設定した上で `rules` などを追加することで設定が完了する
* `extends`
  * shareable configs (特定のパッケージ[ex: react]における eslint の一連の共有設定)の設定を継承するプロパティ
    * shareable configs は `eslint-config-xxx` のような命名
  * これによって `plugins` や `rules` なども自動で設定できる
    * = この場合、同様の拡張機能の `plugins` への追加は不要

つまり、以下のような使い分けが良さそう

* 特定の shareable configs の設定を基本的にそのまま使いつつ微調整したい場合
  * => `extends` を設定して `rules` などを編集する
* 特定の拡張機能の中から一部のみを設定したい場合
  * => `plugins` を設定して適用したいもののみ `rules` などに追加する

### env

* 特定の実行環境などに存在するグローバル変数を使用する際に既に宣言されているものとして怒られないようにする設定
  * ex: `window` ("browser"), `$` ("jquery"), `__dirname` ("node")

(ref)

* https://zenn.dev/kimromi/articles/546923b7281dcb
* https://github.com/sindresorhus/globals/blob/main/globals.json

### parser, parserOption

* 構文解析においてソースコードから抽象構文木を生成するのに利用するパーサーの指定とそのオプション設定
* vue や typescript とかを使用する場合は必要( jsx はデフォルトのパーサーで対応できるらしい )
* parserOption
  * `ecmaVersion` ... ECMAScript`のバージョン指定
  * `sourceType` ... スクリプト or モジュール(基本こっち)
  * `ecmaFeatures.jsx` ... JSX構文の有効化

(ref)

* https://qiita.com/ibara1454/items/be73615df332564e7855#overrides

### overrides

* 全体の設定に対して一部のファイルや拡張子に合わせて個別で設定を上書きするためのプロパティ
  * `files` で拡張子やファイルを指定しては後は他のプロパティを使用する
