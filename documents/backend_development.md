# バックエンド開発(with graphql)

## nodejs フレームワーク

### そもそも nodejs についておさらい

* もともと js はブラウザで実行できるプログラミング言語して始まったらしい
  * js を実行するための機構を「javascriptエンジン」と呼ぶ
* nodejs はブラウザ以外でも js を利用できるように開発されたランタイム(実行)環境
  * google chrome にも搭載されているV8エンジンを nodejs でも使用している
  * ブラウザと実行場所が違うため、一部のAPIは実装されていないが逆にサーバー側で実行されるからこそのAPI(ex: ファイルシステムの操作...)が存在する

(ref)
* https://www.hexabase.com/column/javascript-engine-summary/

### 主なフレームワーク

* [Express](https://expressjs.com/)
  * 軽量なフレームワーク(バージョン上がるたびに軽量化されているらしい)
  * ミドルウェアが豊富
  * 一番使われている
  * 故にドキュメントが多い
* [Fastify](https://fastify.dev/)
  * Express と Hapi インスパイア
  * とにかく動作が速いらしい
  * Express よりもフレームワークとして提供している機能が多い
  * ドキュメントが少ない
* [Nest](https://nestjs.com/)
  * Express ベースで作られているため Express の機能は Nest でも使えることが多い
  * typescript で記述されている
  * コアとしてデフォルトで Express を使用しているが、 Fastify も選択可能
  * アプリケーション構築に独自のCLIが使用できる

(ref)
* https://qiita.com/ymasaoka/items/3db3f44990911a181ffc
* https://2022.stateofjs.com/en-US/other-tools#backend_frameworks

## GraphQLサーバー

### ライブラリを使用して自分でサーバーを書く場合の候補

* [graphql-http](https://github.com/graphql/graphql-http)
  * [express-graphql](https://github.com/graphql/express-graphql)の後継
  * シンプルなGQLの実行環境を提供する
  * 様々なランタイムあるいはそのフレームワーク上で動作する
* [Apollo Server](https://www.apollographql.com/docs/apollo-server)
  * 機能やカスタマイズ性が高いのか、痒い所に手が届きそうな印象
  * 多くの実行環境をサポートしている
  * クライアント側で用いられがちな Apollo Client との親和性が高い
  * 一番使われているっぽい
* [GraphQl Yoga](https://the-guild.dev/graphql/yoga-server)
  * Apollo と比較するとセットアップが簡単らしい
  * 開発が活発そう
    * 多くの実行環境をサポートしている(Apollo は cloudflare workers を切り捨てようとしているが yoga が継続)
    * [bun との統合の記述も既にある](https://the-guild.dev/graphql/yoga-server/docs/integrations/integration-with-bun)
  * [Apollo 煽りがすごいw](https://the-guild.dev/graphql/yoga-server/docs/comparison)
* [mercurius](https://github.com/mercurius-js/mercurius)
  * Fastify が提供しているGQLアダプター

(ref)
* https://2022.stateofgraphql.com/en-US/libraries/servers/#graphql_servers_experience_ranking
* https://npmtrends.com/apollo-server-vs-apollo-server-express-vs-graphql-http-vs-graphql-yoga-vs-mercurius
* https://spin.atomicobject.com/2021/11/19/choosing-best-graphql-server/

ちなみに go なら [gqlgen](https://github.com/99designs/gqlgen) とかがあるらしい

### マネージドサービスを使用する場合の候補

* [AWS AppSync](https://aws.amazon.com/jp/appsync/)
* [Hasura](https://hasura.io/docs/latest/index/)

(ref)
* https://qiita.com/sho-hata/items/2dbd41be42662007071e

## ORM for nodejs

### ORMが採用しているデザインパターン

* Active Record
  * Entity が自身に関わるドメインロジックと永続化ロジックを持つ
  * (pros)1オブジェクトにまとまるのでコードが書きやすく、簡潔になりやすい
  * (cons)単一責任の原則に反し、Entity が肥大化しやすい
* Data Mapper
  * Entity を永続化する機能を Entity 以外に持たせる
  * (pros/cons) Active Record の逆
* ちなみに Repository
  * Data Mapper が単一の Entity を永続化するためのオブジェクト
  * Repository は複数の Entity を永続化するためのオブジェクトらしい

### ORM主要候補

* [Sequelize](https://sequelize.org/)
  * 古参のORM
  * Active Record パターンを採用
  * typescript が登場する前に開発されてたことで typescript との相性がそこまで良くなかったらしい
    * 故に typescript との相性が良い他のORMに流れた感
* [TypeORM](https://typeorm.io/)
  * Active Record と Data Mapper (Repository)の両方を採用
  * 名前の通り typescript で書くことを前提にした設計になっている
    * ゆえにモデルにおけるカラムの定義(typescript のデコレータ機能を使用)やマイグレーションもtsファイルで記述
  * DBの型がデコレータに依存しているので、クラスの方と異なり型安全性が担保されない
  * 自動マイグレーションと手動マイグレーションが用意されている
* [prisma](https://www.prisma.io/)
  * 公式では新たな Data Mapper ORM と言われているらしい
    * が Data Mapper というよりは Table Data Gateway っぽい
  * 独自定義のスキーマファイルを作成することで、自動で型やマイグレーションファイルを生成してくれる(差分マイグレーションも可能)
  * スキーマを参照したモデルの読み書きを行うので完全に型安全

(ref)
* https://npmtrends.com/objection-vs-prisma-vs-sequelize-vs-typeorm
* https://orkhan.gitbook.io/typeorm/docs/active-record-data-mapper
* https://scrapbox.io/dojineko/Sequelize_%E3%81%8B%E3%82%89_TypeORM_%E3%81%AB%E7%A7%BB%E8%A1%8C%E3%81%97%E3%81%A6%E3%81%BF%E3%81%9F
* https://speakerdeck.com/yasaichi/architecture-decision-for-the-next-10-years-at-pixta
* https://qiita.com/okeyaki/items/37eb4b66bd8ef62c1fe8


### [memo] TypeORM

* [ormconfig option](https://github.com/typeorm/typeorm/blob/0.3.17/docs/data-source-options.md)

## Seed

(前提&意見)どのようなデータをSeedとして投入すべきか

* 主な観点としてテストに対する影響があり、Seedを変更することでテストが軒並み落ちるということが発生しうる
* ゆえに極力データ数が変わらない普遍的なデータのみはSeedとして挿入するのが基本的には良さそう
   * ex: 国、都道府県、性別、血液型...

※ このアプリではあくまでプレイグランドの立ち位置なのでそのあたりはスルーしている部分もある(後で整備するかも)

### 候補

* [migration ファイルと同列に対応する](https://sushilkbansal.medium.com/how-to-seed-typeorm-d9637a5948cc)
  * pros
    * 依存関係を操作しやすい
  * cons
    * migration とは別で挿入したい場合には使えない
* [typeorm-seeding](typeorm-seeding)
  * pros/cons
    * migration ファイルの逆
    * [typeorm-factory](https://github.com/jorgebodega/typeorm-factory)との親和性高さそう
