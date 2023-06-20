---
title: 'そろそろRustデビュー目指すか・・・開発環境を作ってHelloWorld +αする！'
date: '2023-06-03'
tags:
  - rust
  - programming
summary: "Rust入門をやります。みなさんは新しいプログラミング言語、学習してますか？(と言ってもRustは結構昔から、Wikipediaによると2010年から、あるらしい)。いったん一つの言語を身につけて、ご飯を食べるようになると今さら新しい言語なんて・・・ってなるよね。でもこの業界に身を置くなら常にアンテナ張って新しいものにチャレンジしていかないと、と(最近になってようやく)思うのです。そんなわけで私はRustを学びたい！一緒にお勉強してみませんか？"

thumbnail: "rust"
featureImage: "./top.jpg"
---


Rustは性能やメモリ安全性を目指して設計された言語うんぬん・・・とかこのブログで書いてもあんまり意味はないのでさっさと手を動かしていきます。
Rustがどんな言語なのかは公式サイトかWikipediaを見てください。簡単に言うとGoと比較されることが多いです。
Goよりも高速に動きますが(Goも十分高速な部類だとは思いますが)、Goよりも難しいです(少なくとも自分には)。

### Rustをインストールする

公式サイトに記載してあるcurlのインストールスクリプトを実行することで
`rustup`というコマンドがインストールされます。これはRustのバージョンを管理して簡単に切り替えるものでasdfみたいなものです(ちなみにasdfでRustをインストールすることもできます)。

rustupをインストールしたらバージョンを指定してRustのインストールを行います。

{{<q>}}
$ rustup install stable
info: syncing channel updates for 'stable-x86_64-apple-darwin'
...中略...
  stable-x86_64-apple-darwin installed - rustc 1.70.0 (90c541806 2023-05-31)
{{</q>}}

先ほどインストールしたRustのバージョンをデフォルトのバージョンとして設定します。

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

プロジェクトルートに`rust-toolchain`ファイルを作成しバージョン番号を記載しておくことで自動的にプロジェクト内で利用するRustのバージョンを固定できます。

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

Rustには(先ほどバージョン番号の確認の際に使用した)、`rustc`というソースファイルをコンパイルするコマンドがありますが**基本的にこのコマンドは使いません**。通常は`cargo`というコマンドだけを使って開発を進めることができます(多分)。cargoでビルド、テスト、ドキュメンテーション生成、パッケージ公開など開発のライフサイクル全体をカバーできます。cargoを使用して新しいプロジェクトを作成するには次のコマンドを実行します。

{{<q>}}
$ cargo new hello_world
{{</q>}}

hello_worldという名前の新しいディレクトリが作成され、その中に初期設定ファイルとサンプルコードが生成されます。

{{<q>}}
$ tree hello_world
hello_world
├── Cargo.toml
└── src
　　　└── main.rs

2 directories, 2 files
{{</q>}}

### HelloWorldを作成して実行する

新しいプロジェクトを作成すると、src/main.rsというファイルが作成されます。ここには既に"Hello, world!"と出力するサンプルコードが書かれています。以下のようになっているはずです：

```rust
fn main() {
    println!("Hello, world!");
}
```

Rustのコードを実行するには、ターミナルで以下のコマンドを実行しましょう：

{{< q >}}
$ cargo run
{{< /q >}}

正常に実行されるとターミナルに"Hello, world!"と表示されます。

### Cargo.tomlファイルの簡単な解説

"Hello,World!"が表示できたので入門は完了！では記事としてあまりにも寂しい・・・のでもう少し突っ込んでみようと思います。
プロジェクトルートに`Cargo.toml`というファイルがあります。これはプロジェクトの設定と依存関係を管理するためのファイルです。以下は基本的な構造です：

{{<q>}}
[package]
name = "hello_world"
version = "0.1.0"
edition = "2021"
　
# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
{{</q>}}

`package`セクションには、パッケージの名前、バージョン、エディションが記載されます。`dependencies`セクションにはプロジェクトが依存するライブラリを記述します。実際の開発では間違いなくライブラリを使用することになるため依存ライブラリを設定する方法を見ておきます。例えばRustの構造体をJSON形式に変換するためのライブラリ「serde」および「serde_json」を使いたい場合、dependenciesセクションに以下のように追記します：

{{<q>}}
[dependencies]
serde = { version = "1.0.126", features = ["derive"] }
serde_json = "1.0.64"
{{</q>}}

### 追加したライブラリを使うコードを書いてみる

main.rsを以下のように書き換えます：

```rust
use serde::{Serialize, Deserialize};
use serde_json::Result;

#[derive(Serialize, Deserialize)]
struct Person {
    name: String,
    age: u8,
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

他の言語、例えばNodeJSではnpm installコマンドによって自動的にpackage.jsonに依存ライブラリの記述が追加されます。


`cargo-edit`コマンドを使うことでNodeJSと同様にCargo.tomlを直接編集せずに依存ライブラリを追加・削除・更新できます。
まず以下のコマンドでcargo-editをインストールします：

{{<q>}}
$ cargo install cargo-edit
{{</q>}}

以降はCargo.tomlを直接編集せずに以下のコマンドで依存ライブラリを追加することができます。

{{<q>}}
$ cargo add <ライブラリ名>
{{</q>}}

Cargo.tomlのdependenciesセクションに指定したライブラリが自動的に追加されます。

{{% notice note "Note" %}}
私の環境(MacOSX)ではcargo-editのインストール時にエラーが発生しました。コンソールの出力には、

{{<q>}}
error: failed to run custom build command for `openssl-sys v0.9.88`
{{</q>}}

というエラーが表示されました。この場合は`brew install openssl`によりopensslをインストールしてから
再度インストールを行うと正常にインストールが完了しました。
{{% /notice %}}

<!--
{{% notice note "Note" %}}
This is a standard "note" style.
{{% /notice %}}

The other three variants follow.

{{% notice info "Info" %}}
Here is the "info" style.
{{% /notice %}}

{{% notice tip "Tip" %}}
Here is a "tip" variant of a notice.
{{% /notice %}}

{{% notice warning "Warning" %}}
Here is the "warning" flavor of a notice.
{{% /notice %}}
-->

### cargo-testでテストを実行する

先ほど書いた構造体をJSONに変換するプログラムのテストを書いてみます。まずはJSON変換のロジックを関数として切り出してテストしやすく変更します。main関数を次のように修正します。

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

main関数からJSON変換処理を切り出して`person_to_json`関数を作成しました。ではこの関数のテストを書いてみます。
main.rsにさらに次のコードを追加します。

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

そして`cargo test`コマンドを実行することでテストを実行します：

{{<q>}}
$ cargo test
    Finished test [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/main.rs (/Users/kurobane.kengo/hello_world/target/debug/deps/hello_world-997ec4338bdaff39)

running 1 test
test tests::test_person_to_json ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
{{</q>}}

以上で今回の内容、RustでHelloWorld+αまでは終了といたします。Rust自体のコード解説はほとんどしてこなかったので、
さっぱりわからなかった方もいるかもしれません。でも安心してください(？)、私もほとんどわかっていませんw

今回のコードもほとんどChatGPT4に書いてもらいました。今のところは雰囲気で何となく理解できていれば良いのではないかなと考えています。
(何らかのプログラミング経験があればわかるはずです。多分)

次回以降でRustの言語仕様についても細かく見ていければと考えております。
