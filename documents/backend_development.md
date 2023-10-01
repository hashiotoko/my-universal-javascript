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
