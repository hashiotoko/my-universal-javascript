# モノレポにおけるパッケージ管理

## 重要な概念

* モノレポ
  * 複数のパッケージを1つのリポジトリで管理する手法
* ワークスペース(workspaces)
  * 複数のパッケージ(`package.json`)の依存関係などを管理する機能
  * ルートから各パッケージの npm scripts の一括実行なども行える
* ホイスティング(hoisting、巻き上げ)
  * ざっくりいうとワークスペースで被っている npm パッケージはルートでインストールしてそれを個々のワークスペースから使うようにする仕組み
  * 詳しくは[この記事](https://tars0x9752.com/posts/yarn-hoisting)とかが参考になりそう

## パッケージ管理ツールの例

* [yarn workspaces](https://chore-update--yarnpkg.netlify.app/ja/docs/workspaces)
  * 基本的なモノレポでのパッケージ管理を行ってくれる機能
  * v1から導入されているっぽい
* [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
  * yarn と同様
  * v7から導入されており、yarnの後続
  * ref. https://azukiazusa.dev/blog/Starting--monorepol-with-npm-workspace/
* [lerna](https://lerna.js.org/)
  * もともと npm workspaces がなかったときに npm を使用してモノレポのパッケージ管理を可能にする機能を提供するために作られたっぽい？
    * いや、普通にホイスティングがより柔軟に行えたり的な感じだ(`lerna bootstrap` のこと)
  * が、 yarn の方が npm より高速だったりするので、設定ファイル( `lerna.json` )で yarn を使うようにすることも可能
    * pnpm の方がより高速だったりするっぽいが、対応していないパッケージなどがあるっぽくて yarn を使う人が多いのかな？(ref. https://zenn.dev/hibikine/articles/27621a7f95e761 )
  * v4までは個人で開発していたっぽいが、v5からは他のモノレポパッケージ管理ツールである `Nx` を提供していた同社が引き継ぎ、各種キャッシュ機能が追加されより高速化された
    * v6 から使えるっぽい(?) nx cloud を使えばクラウド上にキャッシュされるのでチーム内やCI上などでもキャッシュの共有とかができる！！！
  * ref. https://weseek.co.jp/tech/4153/

## 結論

* lerna + yarn workspaces 良さそうだし、使っている人も多いみたい
  * lerna は各種パッケージマネージャとの互換性があり、機能の種類や使いやすさの面で良い
  * どのパッケージマネージャを使うかに関しては比較的バランスの取れている yarn を選択するのが良さそうという感じ

## 追記

* `lerna bootstrap` コマンドはv7で削除された。
  * 代わりに各種パッケージマネージャの `xxx install` を使ってとのこと。(ref. https://lerna.js.org/docs/legacy-package-management )
  * yarn もある程度柔軟にホイスティングできるようになっているっぽい？(ref. https://yarnpkg.com/configuration/yarnrc#nmHoistingLimits)
  * それでもv7で同コマンドを使いたい場合は [@lerna/legacy-package-management](https://github.com/lerna/lerna/tree/main/packages/legacy-package-management)をインストールすれば使えるとのこと。
* ゆえに実質、キャッシュとかの機能のために lerna 使う感じか？
