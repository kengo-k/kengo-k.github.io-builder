---
title: そろそろRustデビュー目指すか・・・開発環境を作ってHelloWorld +αする！
date: 2023-06-03
tags:
  - rust
  - programming
thumbnail: rust
featureImage: ./top.jpg

description: Rustの開発を始めるための手引き。Rustのインストール、ライブラリの追加、Cargo.tomlの編集方法、テストコードの実行、モジュールを使ってコードを分割する方法などを理解するための情報を提供します。

summary: Rust入門をやります。みなさんは新しいプログラミング言語、学習してますか？(と言ってもRustは結構昔から、Wikipediaによると2010年から、あるらしい)。いったん一つの言語を身につけて、ご飯を食べるようになると今さら新しい言語なんて・・・ってなるよね。でもこの業界に身を置くなら常にアンテナ張って新しいものにチャレンジしていかないと、と(最近になってようやく)思うのです。そんなわけで私はRustを学びたい！一緒にお勉強してみませんか？
---



## Rustの始めの一歩を踏み出す

Rustは性能やメモリ安全性を目指して設計された言語うんぬん・・・とかこのブログで書いてもあんまり意味はないので省きます。Rustがどんな言語なのかは公式サイトかWikipediaを見てください(何かとGoと比較されているイメージありますがGoよりもはるかに難しい印象)。

今回の記事ではRustの言語仕様については踏み込みません(次回以降にやります。多分)。

今回やること：

- Rustのインストール
- HelloWold
- ライブラリを追加
- 周辺ツールのインストール
- テストを実行
- ビルド構成を理解する

この記事の内容を理解することで、開発のスタートラインに立てることを目的とします。

### Rustをインストールする

公式サイトに記載してあるcurlのインストールスクリプトを実行することで`rustup`というコマンドがインストールされます。これはRustのバージョンを管理して簡単に切り替えるものでasdfみたいなものです(asdfでRustをインストールすることもできます)。ちなみにMacの場合はHomebrewでもrustupをインストールできます。私はHomeberwを使いました。

rustupをインストールしたらバージョンを指定してRustのインストールを行います。最新の安定版であるstableを指定します。

{{<q>}}
$ rustup install stable
info: syncing channel updates for 'stable-x86_64-apple-darwin'
...中略...
  stable-x86_64-apple-darwin installed - rustc 1.70.0 (90c541806 2023-05-31)
{{</q>}}

インストールしたRustのバージョンをデフォルトに設定します。

{{<q>}}
$ rustup default stable
info: using existing install for 'stable-x86_64-apple-darwin'
info: default toolchain set to 'stable-x86_64-apple-darwin'

  stable-x86_64-apple-darwin unchanged - rustc 1.70.0 (90c541806 2023-05-31)
{{</q>}}

現在のRustのバージョンを確認します。

{{<q>}}
$ rustc -V
rustc 1.70.0 (90c541806 2023-05-31)
{{</q>}}

現在インストールされているRustのバージョン一覧を確認します。

{{<q>}}
$ rustup toolchain list
stable-x86_64-apple-darwin (default)
nightly-x86_64-apple-darwin
1.68.2-x86_64-apple-darwin
1.70.0-x86_64-apple-darwin
{{</q>}}

プロジェクトルートに`rust-toolchain`ファイルを作成しバージョン番号を記載しておくとプロジェクト内で利用するRustのバージョンを固定できます。

{{<q>}}
# 現在のバージョンを確認
$ rustc -V
rustc 1.70.0 (90c541806 2023-05-31)
　
# rust-toolchainファイルを作成
$ echo 1.68.2 > rust-toolchain
　
# 再度現在のバージョンを確認
$ rustc -V
rustc 1.68.2 (9eb3afe9e 2023-03-27)
{{</q>}}

### プロジェクトを作成する

Rustには`rustc`というソースファイルをコンパイルするコマンド(すでにバージョン番号の確認に使用しました)がありますが**基本的にこのコマンドは使いません**。通常は`cargo`というコマンドを使って開発を行います。cargoでビルド、テスト、ドキュメント生成、パッケージ公開など開発のライフサイクル全体をカバーできます。cargoを使用して新しいプロジェクトを作成するには次のコマンドを実行します。

{{<q>}}
$ cargo new hello_world
{{</q>}}

hello_worldという名前の新しいディレクトリに初期設定ファイルとサンプルコードが生成されます。

{{<q>}}
$ tree hello_world
hello_world
|-- Cargo.toml
|-- src
　|--main.rs
　
2 directories, 2 files
{{</q>}}

### HelloWorldを実行する

新しいプロジェクトを作成すると、src/main.rsというファイルが作成されています。そこには既に"Hello, world!"と出力するサンプルコードが書かれています。

```rust
fn main() {
    println!("Hello, world!");
}
```

実行するには、ターミナルで以下のコマンドを実行します。

{{< q >}}
$ cargo run
{{< /q >}}

正常に実行されるとターミナルに"Hello, world!"と表示されます。

### Cargo.tomlファイルの簡単な解説

プロジェクトルートに`Cargo.toml`というファイルがあります。これはプロジェクトの設定と依存関係を管理するためのファイルです。プロジェクト生成時のデフォルトの内容は以下のようになっています。

{{<q>}}
[package]
name = "hello_world"
version = "0.1.0"
edition = "2021"
　
# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
{{</q>}}

`package`セクションには、パッケージの名前、バージョン、エディションが記載されます。`dependencies`セクションにはプロジェクトが依存するライブラリを記述します。実際の開発では間違いなくライブラリを使用するため、依存ライブラリを設定する方法を見ておきます。例えばRustの構造体をJSON形式に変換するためのライブラリ「serde」および「serde_json」を使いたい場合、dependenciesセクションに以下のように追記します。

{{<q>}}
[dependencies]
serde = { version = "1.0.126", features = ["derive"] }
serde_json = "1.0.64"
{{</q>}}

### 追加したライブラリを使うコードを書いてみる

main.rsを以下のように書き換えます。

```rust
use serde::{Serialize, Deserialize};
use serde_json::Result;

#[derive(Serialize, Deserialize)]
struct Person {
    name: String,
    age: i32,
}

fn main() -> Result<()> {
    let john = Person { name: String::from("John"), age: 30 };
    let john_json = serde_json::to_string(&john)?;
    println!("{}", john_json);
    Ok(())
}
```

これによりjohnというPersonオブジェクトがJSON形式に変換され、その結果が出力されます。

{{<q>}}
$ cargo run
{"name":"John","age":30}
{{</q>}}

### cargo-editを使って依存ライブラリを登録する

他の言語、例えばNodeJSではnpm installコマンドによって自動的にpackage.jsonに依存ライブラリを追加できます。しかしRustにはデフォルトでnpm installに相当するコマンドがないため手動でCargo.tomlを編集する必要があります。これは少しだけ面倒です。


`cargo-edit`コマンドを使うことでnpm installと同様にCargo.tomlを直接編集せずに依存ライブラリを追加・削除・更新できます。以下のコマンドでcargo-editをインストールします。

{{<q>}}
$ cargo install cargo-edit
{{</q>}}

cargo addコマンドでCargo.tomlを直接編集せずに依存ライブラリを追加できます。

{{<q>}}
$ cargo add <ライブラリ名>
{{</q>}}

コマンド実行後、Cargo.tomlのdependenciesセクションに指定したライブラリが自動的に追加されます。

{{% notice note "cargo-editのインストールに失敗する場合" %}}
私の環境(MacOSX)ではcargo-editのインストール時にエラーが発生しました。コンソールの出力には、

{{<q>}}
error: failed to run custom build command for `openssl-sys v0.9.88`
{{</q>}}

というエラーが表示されました。この場合は`brew install openssl`によりopensslをインストール後、再度インストールを行うと正常にインストールできました。
{{% /notice %}}

### cargo-testでテストを実行する

上で実装した構造体をJSONに変換するプログラムのテストを書いてみます。まずはJSON変換のロジックを関数として切り出してテストしやすくします。次のように修正します。

```rust
fn person_to_json(person: &Person) -> Result<String> {
    let json = serde_json::to_string(person)?;
    Ok(json)
}

fn main() -> Result<()> {
    let john = Person { name: String::from("John"), age: 30 };
    let john_json = person_to_json(&john)?;
    println!("{}", john_json);
    Ok(())
}
```

`person_to_json`関数を作成してmain関数から呼び出すように修正しました。つづいて関数のテストを書きます。main.rsにさらに次のコードを追加します。

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_person_to_json() {
        let alice = Person { name: String::from("Alice"), age: 25 };
        let json = person_to_json(&alice);
        assert!(json.is_ok());
        assert_eq!(json.unwrap(), "{\"name\":\"Alice\",\"age\":25}");
    }
}
```

そして`cargo test`コマンドを実行することでテストを実行します。

{{<q>}}
$ cargo test
    Finished test [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/main.rs
　
running 1 test
test tests::test_person_to_json ... ok
　
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
{{</q>}}

今回書いたテストでは、関数を定義したソースファイル内にテストコードを記述しました。この形式は「ユニットテスト」と呼ばれる形式になります。他にも独立したテストケースファイルを作成する「インテグレーションテスト」やコメントにテストコードを記載してテストを実行できる「ドキュメンテーションテスト」も作成できます。ここでは割愛しますが、[こちら](https://github.com/kengo-k/rust-simple-template)のリポジトリにサンプルコードがあるので確認してみてください。

### cargo-watchでソースを修正したタイミングで自動でビルドする

ソースコードを修正するたびにターミナルに戻ってcargo buildを実行するのは手間なのでファイルを保存したときに自動でビルドを実行できるようにします。これを実現するコマンドが`cargo-watch`になります。以下のコマンドでインストールを行います。

{{<q>}}
$ cargo install cargo-watch
{{</q>}}

{{% notice note "cargo-watchのインストールに失敗する場合" %}}
私の環境(MacOSX)ではcargo-watch のインストール時にエラーが発生しました。下記のエラーが表示されていました。

{{<q>}}
$ cargo install cargo-watch
    Updating crates.io index
  Installing cargo-watch v8.4.0
  (...中略...)
error: failed to run custom build command for `mac-notification-sys v0.5.6`  
{{</q>}}

mac-notification-sys v0.5.6のビルドで失敗しているようなのですが、原因がわからないので解決できませんでした。そのためcargo installコマンドにバージョン指定するオプションを追加して古いcargo-watchをインストールすることで対応しました。

{{<q>}}
$ cargo install cargo-watch --version 7.8.1
{{</q>}}

インストールしたバージョンをどうやって捜したかについてですが、cargoコマンドにはインストール可能なバージョンを一覧表示するサブコマンドが見当たらなかったため[GitHubリポジトリのリリース一覧](https://github.com/watchexec/cargo-watch/releases)を確認しました。とりあえず一つ前のメジャーバージョンの最新を使用しました。
{{% /notice %}}

cargo-watchのインストール後は以下のようにコマンドを実行します。

{{<q>}}
$ cargo watch -x build
{{</q>}}

"-x test"や"-x run"なども実行できます。

### Cargo.tomlとクレートについて

Rustについての解説ページを見ていると「クレート」という言葉が出てきます。見慣れない言葉ですが、どういう意味でしょうか。英単語としては「木箱」「かご」といった意味を持つようです。RustにおけるクレートとはRustプログラムのビルド単位となるものです。main.rsをビルドするとバイナリファイルが作成されます。つまりmain.rsはクレートです。この場合はバイナリクレートとなります。

Cargo.tomlにはクレートの設定を記述します。Cargo.tomlには複数のバイナリクレートと最大で1つのライブラリクレートを含めることができます。この記事の前半でCargo.tomlの内容を確認しましたが、下記のようになっていました。

{{<q>}}
[package]
name = "hello_world"
version = "0.1.0"
edition = "2021"
　
# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
{{</q>}}

このCargo.tomlにはクレートに関する設定は含まれていません。その場合は、デフォルトでmain.rsが定義されているものと見なされます。このファイルをビルドすると[package]セクションのnameで指定されたバイナリファイルが生成されます。つまりmain.rsはRustによって規定された特別な意味を持つファイル名です(同様にライブラリクレートのデフォルトのファイル名はlib.rsとなります)。

明示的にクレートの設定を追加することで、main.rsではない名前を使用したり、複数のバイナリクレートを定義できます。例えばsrc/main2.rsをバイナリクレートとして登録するには次のようにCargo.tomlを修正します。

{{<q>}}
[package]
name = "hello_world"
version = "0.1.0"
edition = "2021"
　
[[bin]]
name = "main2"
path = "src/main2.rs"
　
# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html
　
[dependencies]
{{</q>}}

src/main.rsとsrc/main2.rsが同時に存在する状態でcargo buildを実行すると、src/main.rsからhello_worldというバイナリを、src/main2.rsからmain2というバイナリをそれぞれ生成します。またsrc/binディレクトリ配下にmain関数を持つRustのソースファイルを配置した場合、Cargo.tomlに記述しなくても自動的にバイナリクレートとして扱われます。その場合、生成されるバイナリファイル名はソースファイルから拡張子を除いたものになります。

[こちら](https://github.com/kengo-k/rust-simple-template)のリポジトリにサンプルコードがあるので確認してみてください。ライブラリクレートの例もあります。

### モジュールについて

Runtにはモジュールと呼ばれる概念もあります。モジュールはクレート内に名前空間を導入するために使います。以下のコードをみてください。

```rust
pub mod my_mod {
  pub fn hello() {
    println!("Hello, World!!");
  }
}

fn main() {
  my_mod::hello();
}
```

main.rs内にインラインにモジュールmy_modを定義し、モジュール内の関数を呼び出しています。もちろん別ファイルとして切り出すことができます。my_mod.rsという名前で以下の内容を作成します。

```rust
pub fn hello() {
    println!("Hello, World!!");
}
```

main.rs内で定義した関数をそのまま移植しただけです。特にモジュール名の宣言は必要はありません。ファイル名がそのままモジュール名として扱われます。このモジュールを使うにはmain.rsを次のように修正します。

```rust
mod my_mod; // 同ディレクトリにあるmy_mod.rsを参照します

fn main() {
    my_mod::hello();
}
```

mod宣言をすると、指定したモジュール内にある要素にアクセスできますが、基本的に"モジュール名::名前"のようにフルパスで指定する必要があります。今回のように短いパスの場合は問題はありませんが、モジュールがネストした場合は冗長になります。その場合はuseを使うことで短い名前でアクセスできるようになります。次のようにmain.rsを修正します。

```rust
mod my_mod;

use my_mod::hello; // 追記

fn main() {
    hello(); // useしたのでモジュールパスを省略できる
}
```

プログラムが大きくなると機能別にディレクトリを分けたくなります。これから実際にモジュールをディレクトリに分割してみます。

モジュールを分割するには二つの方式があります。2018エディションから使用できる新しい形式と、それ以前の古い形式です。基本的には新しいエディションを使っている場合は新形式だけを使えば良いですが、どちらの書き方も理解しておく必要はあるため、両方とも紹介しておきます。

#### 新形式(2018エディションから)

親モジュール名と同名のディレクトリを作成し、ディレクトリ内にサブモジュールを作成します。この場合は既にmy_mod.rsがあるので、同名のディレクトリmy_modを作成します。my_modディレクトリ内に以下の内容でfoo.rsを作成します。

```rust
pub fn hello() {
    println!("Hello, foo!!");
}
```

そしてmy_mod.rs内にfooモジュールを公開する設定を追記します。

```rust
pub mod foo; // 追記。my_mod/foo.rsを参照する

pub fn hello() {
    println!("Hello, World!!!!");
}
```
最後に、main.rsからfooモジュールにある関数の呼び出しを追加します。

```rust
mod my_mod;

use my_mod::hello;

fn main() {
    hello();
    my_mod::foo::hello(); // 追記
}
```

cargo runを実行し、以下の出力が表示されればOKです。

{{<q>}}
Hello, World!!
Hello, foo!!
{{</q>}}

#### 旧形式

新形式ではモジュールmy_mod.rsが存在する時に、my_modモジュール内にサブモジュールを作成する方法として、親モジュールと同名のディレクトリmy_modを作成し、ディレクトリ配下にサブモジュールを作成しました。旧形式の場合は親モジュールのディレクトリのみが存在し、ディレクトリ内に親モジュールの内容を定義するmod.rsという名前のファイルを作成します。my_modモジュール内に旧形式でbarモジュールを、そしてbarモジュールのサブモジュールbazを作成します。

my_mod/bar/baz.rs:

```rust
pub fn hello() {
    println!("Hello, baz!!");
}
```

my_mod/bar/mod.rs:

```rust
pub mod baz;
```

そしてmy_mod.rsにモジュールbarを公開するように追記します。

```rust
pub mod foo;
pub mod bar; // 追記

pub fn hello() {
    println!("Hello, World!!");
}
```

最後にmain.rsにbazの呼び出しを追加します。

```rust
mod my_mod;

use my_mod::hello;

fn main() {
    hello();
    my_mod::foo::hello();
    my_mod::bar::baz::hello(); // 追記
}
```

下記の出力が表示されれば成功です。

{{<q>}}
Hello, World!!
Hello, foo!!
Hello, baz!!
{{</q>}}

ディレクトリ構成は以下のとおりです。

{{<q>}}
src
|-- main.rs
|-- my_mod
|　|-- bar
|　|　|-- baz.rs
|　|　|-- mod.rs
|　|-- foo.rs
|-- my_mod.rs
{{</q>}}

今回は例のためにわざと新形式と旧形式を混ぜて使っていますが2018以降の新しいエディションを使う場合、特別な理由がない限りは新形式だけを使うようにしましょう(わざわざ混ぜる意味はないので)。

## おわりに

以上で今回の記事、RustでHelloWorld+αは終了となります。いかがでしたでしょうか。Rust自体のコード解説はほとんどしてこなかったので、さっぱりわからなかった方もいるかもしれません。でも安心してください(？)、私もほとんどわかっていません。今は雰囲気レベルで何となく理解できれば良いと思います。何らかのプログラミング経験があればわかるはず、と信じています。今回の記事がRustの学習を始める方の役に立てば幸いです。
