---
title: IAMをちゃんと使えてますか？AWSセキュリティの基本を理解しよう
date: 2023-04-08
tags:
  - aws
  - cloud
thumbnail: aws
featureImage: ./top.jpg

description: AWS IAMを使用してセキュリティを向上させるための基本的なガイド。MFAの設定方法、IAMポリシーの書き方、ロールを使用した権限管理について紹介します。

summary: これまで業務でさんざんAWSを使ってきましたが、開発チームが用意した環境をただ使っていただけでした。個人でもAWSを安全に運用できるように、AWSのセキュリティの基本を理解していきたいと思います。今回はIAMの使用方法を中心に実際の手順を紹介していきます。
---

## 今回やること

これまで、個人でAWSを触るときは何も気にせずルートアカウントを使っていました。
本記事では最低限の権限を持つIAMユーザとロールを作成し、ルートアカウントを使わずに作業ができる環境を構築することを目指します。

{{%notice warning "注意事項" %}}
実務でAWSの権限管理をしたことがない素人が記事を書いております。
もちろん記事は実際に動作確認などを行なった上で掲載していますが、AWS運用のベストプラクティスに従っていない内容を含んでいる可能性もあります。
IAMを利用した権限管理の基本的な作業フローを把握するためのもの、という程度の認識で見てもらえると助かります(言い訳)。
{{% /notice %}}

## ルートアカウントにMFAを設定する

本題に入る前に、最初にルートアカウントにMFA(マルチファクタ認証)を設定します。
MFAはパスワードだけではなく追加の認証要素（例えば携帯電話に送られたワンタイムパスワードなど）を必要とする認証方法です。
MFAを設定することで、パスワードが盗まれたとしても攻撃者がアカウントにアクセスするのを防ぐことができます。

次の手順でMFAを設定します。

- AWSのルートアカウントでAWSマネジメントコンソールにログインします。
- 画面右上のアカウント名の部分をクリックしてメニューを表示し、「セキュリティ認証情報」をクリックします。

{{< i prefix="1-" method="resize" height=480 >}}

- 「セキュリティ認証情報(ルートユーザ)」画面の「MFAを割り当てる」ボタンをクリックします。

{{< i prefix="2-" method="resize" width=720 >}}

「MFAデバイスを選択」画面にて必要な情報を入力します。
- 「デバイス名」に任意の名前を設定します。ここではgoogle-authenticatorと設定しました。
- 「MFAデバイス」に「認証アプリケーション」を選択します。
- 「次へ」をクリックします。

{{< i prefix="3-" method="resize" height=480 >}}

デバイスの設定画面が開きます。

{{< i prefix="4-" method="resize" width=720 >}}

表示されたQRコードを読み取るための認証アプリケーションをインストールします。

ここではChrome拡張機能の「Authenticator」を使用します。

{{< i prefix="5-" method="resize" width=720 >}}

↑をインストールします。

Authenticatorを使用して先ほどのQRコードを読み取ります。
- Chromeのアドレスバーの右にあるQRコードのアイコンをクリックします。
- 表示されたウィンドウ内の赤枠で囲ったボタンをクリックします。
- 範囲選択するモードになるのでQRコードを選択し読み取ります。

{{< i prefix="6-" method="resize" height=480 >}}

QRコードの読み取りに成功すると次のダイアログが表示されます。

{{< i prefix="7-" method="resize" width=720 >}}

Authenticatorを使用してデバイスの設定画面に二つのMFAコードを入力します。

MFAコードを入力したら「MFAを追加」ボタンをクリックします。

{{< i prefix="8-" method="resize" width=720 >}}

セキュリティ認証情報(ルートユーザー)画面に戻ります。
多要素認証(MFA)一覧に新しいデバイスが追加されていればOKです。

{{< i prefix="9-" method="resize" width=1280 >}}

## ルートアカウントのアクセスキーを削除する

ルートアカウントにアクセスキーを設定している場合は削除します。
ルートアカウントは全てのリソースにアクセスできる特権を持つため、アクスセスキーの盗難や操作ミスによる事故が起きた時の被害を最小限にとどめるため、ルートアカウントはアクセスキーを持たないようにします。

ルートアカウントにアクセスキーが設定されているとIAMダッシュボードに警告が表示されます。

{{< i prefix="10-" method="resize" width=1280 >}}

「アクセスキーを管理」から登録されているアクセスキーを削除します。

{{< i prefix="11-" method="resize" width=1280 >}}

700日以上前からルートアカウントのアクセスキーがずっと設定されていたようです（恐ろしい)。
アクセスキーの削除後に警告が消えていればOKです。

{{< i prefix="12-" method="resize" width=1280 >}}

ルートアカウントに対して最低限の設定をすることができました。
本記事の以降に紹介する設定を行うことで、IAMユーザ(およびロール)のみで日常的な作業を完結できるようになるため、
ルートアカウントを使用する機会を極力減らすことができるようになります。

ということでここからが本題になります。

## 作成するリソースを検討する

作業の手順としては、最初にポリシーを作成し、次に作成したポリシーをユーザー/グループ/ロールにアタッチしていくことになります。
まずは作成すべきポリシーを洗い出すために、どのようなユーザ/グループ/ロールが必要になるかを検討します。

### ユーザの検討

開発者用ユーザdev-userを作成します。dev-userには直接ポリシーを設定しません。
代わりに必要なポリシーを設定したグループを作成し、dev-userはそのグループに所属します。ユーザーに直接ポリシーを設定することも可能ですが、
ユーザが増えた場合、個々のユーザに対し都度ポリシーを設定する作業が必要になります。

### グループの検討

下記の二つのグループを作成します。

- developer
- developer-base

developerグループは開発対象の具体的なサービス(今回はLambdaとS3を想定)に関するポリシーを設定します。

developer-baseグループには開発全般で必要となる基本的なポリシーを設定します。具体的には、

1. MFAを設定できる
1. アクセスキーを作成できる
1. ロールの引き受けができる
1. ロールの移譲ができる
1. ロールを一覧表示できる

上記の操作を実行できるようにします。1&2は特に解説する必要がないと思いますが、3〜5については軽く触れておきます。

まず「ロールの引き受け」とはマネージメントコンソール画面での「ロールの切り替え」ボタンのクリックに相当するものです。
本番環境のリソースにアクセスする際に、一時的に本番用ロールに切り替えて作業をした経験がある方は多いと思います。英語の表現的には
ロールをAssumeする(引き受ける)、と言うようです。

次に「ロールの委譲」についてですが、文字通りの意味でロールを渡すことができるようになります。
これが必要になる例としてはLambda関数の作成時があります。
例えばLambda関数がS3にアクセスするためには、S3にアクセスするためのロールをLambdaに渡さなければなりません。
ロールを渡すためにはLambda関数を作成するユーザが「ロールを委譲」する権限を持たなければなりません。

最後に「ロールの一覧表示」ですが、こちらもLambda関数の作成時を例にします。
マネージメントコンソールからLambda関数を作成する時にLambdaに渡すロールをロール一覧の中から選択できます。
その際にロールの一覧表示をする権限が必要となります。

### ロールの検討

下記の二つのロールを作成します。

- admin
- exec-lambda

adminロールは開発以外の管理系の作業を行うためのロールです。ロールではなく別ユーザを用意しても構いません。
ただし、結局操作するのは自分ひとりしかいないため、今回はロールにすることにしました。
別ユーザにしてしまうとログアウトして入り直すという作業が必要になるので手間が増えるためです。

exec-lambdaロールはLambda実行時のロールです。
Lambda関数の作成時にLambdaに渡します。
S3へアクセスする最小の権限を設定します。

### ポリシーを作成する

必要なポリシーの洗い出しができたので実際にポリシーを作成していきます。
そもそもポリシーとはなんぞやですが、ポリシーは「あるリソースに対する操作を許可するか拒否するか」を記述したもので以下のような形式を持つJSONです。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "lambda:*",
            "Resource": "arn:aws:lambda:ap-northeast-1:<account-id>:function:<function-name>"
        }
    ]
}
```

作成したポリシーはユーザ/グループ/ロールに付与(アタッチ)することで機能します。

Actionには操作を指定します。上記の例ではLambdaに関連するすべての操作(lambda:*)を意味します。
Lambdaの場合、関数の作成/実行/削除/etcといったことを表します。そしてEffectでその操作を許可(Allow)するか拒否(Deny)するかを指定します。

ResourceにはActionで指定した操作の対象となるリソース名を指定します。Resourceに指定するリソースの種類はActionに対応するものになります。つまりActionがS3であればバケット名、LambdaであればFunction名という感じです。リソース名の記述にはARNという形式を使います。ARNは一般的に以下のような形式を持ちます：

{{<q>}}
arn:aws:<サービス名>:<リージョン名>:<アカウントID>:・・・
{{</q>}}

実際には個々のサービスによって「:」で区切られた要素の数や種類は異なります。例えばS3バケットのARNは

{{<q>}}
arn:aws:s3:::<バケット名>
{{</q>}}

となり、リージョン名やアカウントIDは指定しません。これはS3のバケット名が全世界で一意になる必要があるからです。

それでは実際にポリシーを実装していきます。

#### enable-mfa

MFAを設定可能にするポリシーです。ルートアカウントだけでなくログイン操作をする全てのユーザはMFAを設定するべきです。
そのため、これから作成するユーザもMFAを設定可能にしておきます。

IAMの画面を開き「ポリシー」を選択します。

{{< i prefix="13-" method="resize" height=300 >}}

ポリシ一の一覧画面から「ポリシーを作成」ボタンをクリックします。

{{< i prefix="14-" method="resize" width=1280 >}}

ポリシー作成画面が開きます。「JSON」をクリックしJSONエディターから直接JSONを編集します。

{{< i prefix="15-" method="resize" width=1280 >}}

JSONエディターに以下の内容のJSONを設定します。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateVirtualMFADevice",
                "iam:DeleteVirtualMFADevice",
                "iam:ListVirtualMFADevices"
            ],
            "Resource": "arn:aws:iam::<account-id>:mfa/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:EnableMFADevice",
                "iam:ResyncMFADevice",
                "iam:ListMFADevices"
            ],
            "Resource": "arn:aws:iam::<account-id>:user/${aws:username}"
        },
        {
            "Effect": "Allow",
            "Action": "iam:DeactivateMFADevice",
            "Resource": "arn:aws:iam::<account-id>:user/${aws:username}",
            "Condition": {
                "BoolIfExists": {
                    "aws:MultiFactorAuthPresent": "true"
                }
            }
        }
    ]
}
```

個々のActionで記述した厳密な意味はほとんど理解していません(ごめんなさい)。基本的にChatGPTに書いてもらっています。
「名前を見た感じMFAデバイスを削除したり一覧表示したりするのに必要なものだろうなー」くらいの感覚です(今はそれで十分だろうと思ってます)。

上記JSONの`<account-id>`は、自分が使用している実際のアカウントIDで置き換えてください。JSONの編集後、JSONエディタの下部にある「次へ」をクリックし確認画面を表示します。ポリシー名を入力し、画面下部の「ポリシーの作成」ボタンをクリックします。

{{< i prefix="16-" method="resize" width=1280 >}}

以上の操作でポリシーが作成されます。

#### enable-accesskey

アクセスキーの作成を可能にします。操作手順については、先ほどと同様ですので、以降はJSONのみを掲載します。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateAccessKey",
                "iam:DeleteAccessKey",
                "iam:ListAccessKeys",
                "iam:UpdateAccessKey"
            ],
            "Resource": "arn:aws:iam::<account-id>:user/${aws:username}"
        }
    ]
}
```

#### enable-role-assume

 ロールの引き受けを可能にします。管理用の作業を行う際に一時的にロールを切り替えるために使用します。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "arn:aws:iam::<account-id>:role/<role-name>"
        }
    ]
}
```
`<role-name>`には引き受けを許可するロール名を指定します。ここではadminを指定します。

{{% notice info "MEMO" %}}
ロール名にワイルドカード(*)を指定できます。ただしその場合、権限を渡しすぎている旨のワーニングが出ます。
{{% /notice %}}

#### enable-pass-role

ロールの委譲を可能にします。主にロールを必要とするサービス(EC2、Lambda、etc)に対しロールを渡すために使用します。

```json
{
	"Version": "2012-10-17",
	"Statement": [
        {
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": "arn:aws:iam::<account-id>:role/<role-name>"
        }
	]
}
```

`<role-name>`には委譲を許可するロール名を指定します。ここではexec-lambdaを指定します。

#### enable-list-roles

ロールの一覧表示を可能にします。コンソール画面でロールの一覧を表示する必要がある際に使用します。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "iam:ListRoles",
            "Resource": "*"
        }
    ]
}
```

#### manage-iam

IAMに関する全ての操作を行うことができる管理用のポリシーです。このポリシーは後に作成するadminロールに付与します。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "iam:*",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "access-analyzer:ValidatePolicy",
                "access-analyzer:ListPolicyGenerations"
            ],
            "Resource": "*"
        }
    ]
}
```

access-analyzerはポリシー生成をサポートしてくれる有益な情報を提供してくれるものです。
これらの権限がない場合、赤字で警告が出てくるため、とりあえず追加しておきました。

#### develop-lambda

Lambda開発に必要な権限を定義するポリシーです。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "lambda:*",
            "Resource": "*"
        }
    ]
}
```

#### develop-s3

S3開発に必要な権限を定義するポリシーです。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": "arn:aws:s3:::*/*"
        }
    ]
}
```

#### editable-s3-object

exec-lambdaロールに付与するポリシーです。
オブジェクトのCRUDのみを可能とする必要最低限の権限を持ちます。
バケットの作成権限はないので、マネージメントコンソールから手動でバケットを作成する前提とします。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::*/*"
        }
    ]
}
```

以上で全てのポリシーの作成が完了しました。

### グループの作成

ユーザーはグループに所属する必要があるため先にグループを作成します。

#### developerグループ

IAMのユーザーグループ画面から「グループを作成」をクリックします。

{{< i prefix="17-" method="resize" width=1280 >}}

ユーザーグループ作成画面が表示されます。グループ名を入力します。

{{< i prefix="18-" method="resize" width=500 >}}

画面を下にスクロールするとアタッチするポリシーの一覧が表示されます。

- develop-lambda
- develop-s3

をチェックし、画面最下部にある「グループを作成」ボタンをクリックします。

{{< i prefix="19-" method="resize" width=1280 >}}

以上の操作でグループを作成できます。

#### developer-baseグループ

上記と同じ操作でdeveloper-baseグループを作成します。ポリシーには

- enable-accesskey
- enable-list-roles
- enable-mfa
- enable-role-assume
- enable-role-pass

を指定します。

### ユーザの作成

IAMのユーザー画面から「ユーザーを追加」ボタンをクリックします。

{{< i prefix="19.1-" method="resize" width=1280 >}}

「ユーザー名」をdev-user、「AWSマネジメントコンソールへのユーザーアクセスを提供する」をチェックONにします。
パスワードの設定は任意の方法でOKです。今回は自動生成されたパスワードをそのまま使います。

{{< i prefix="19.2-" method="resize" width=1280 >}}

ユーザに権限を設定する方法を選択します。
事前に検討した通り、ここではユーザをグループに所属させることにしたので「ユーザーをグループに追加」を選択します。
そして下部に表示されている二つのグループのチェックをONにして「次へ」ボタンをクリックします。

{{< i prefix="19.3-" method="resize" width=1280 >}}

最後に確認画面が表示されるので作成ボタンをクリックしユーザーが正常に作成できればOKです。
「.csvファイルをダウンロード」をクリックし認証情報を記載したCSVファイルを必ずダウンロードしておきます。

{{< i prefix="19.4-" method="resize" width=1280 >}}


作成後のdev-userが以下の状態になっていればOKです。

{{< i prefix="20-" method="resize" width=1280 >}}

### ロールの作成

#### adminロール

IAMのロール画面から「ロールを作成」ボタンをクリックします。

{{< i prefix="21-" method="resize" width=1280 >}}

「信頼されたエンティティを選択」画面が表示されます。
adminロールはdev-userがロール切り替えするために使用するので、ここでは「AWSアカウント」を選択し「次へ」をクリックします。

{{< i prefix="22-" method="resize" width=1280 >}}

以降は、グループの時と同様にアタッチするポリシーを選択します。ここでは

- manage-iam

を選択します。

#### exec-lambdaロール

基本的な手順はadminロールの時と同様です。ただし「信頼されたエンティティを選択」画面では、エンティティタイプとして「AWSのサービス」、ユースケースでは「Lambda」を選択します。

{{< i prefix="23-" method="resize" width=1280 >}}

アタッチするポリシーは、

- editable-s3-object

を選択します。

## 動作確認

これで全ての作業が完了したので動作確認を行います。

### ログイン

まずはルートアカウントからログアウトしdev-userでログインします。
「IAMユーザ」を選択しアカウントIDを入力して「次へ」をクリックします。

{{< i prefix="24-" method="resize" height=300 >}}

dev-user作成時にダウンロードした認証情報のCSVに記載されているパスワードを入力し「サインイン」をクリックします。

{{< i prefix="25-" method="resize" height=300 >}}

ログインできればOKです。

### IAMを確認

dev-userはMFAの設定とアクセスキーの作成のみが行えて、それ以外は何もできないはずです。
「MFAを追加」ボタンが表示されていることが確認できました。
すでに紹介した手順なので割愛しますがルートアカウントだけではなくIAMユーザにもMFAを設定するようにしましょう。

{{< i prefix="26-" method="resize" width=1280 >}}

アクセスキーの作成ができることも確認できます。

{{< i prefix="27-" method="resize" width=1280 >}}


### S3を確認

バケット一覧を表示できることが確認できました。

{{< i prefix="28-" method="resize" width=1280 >}}

### Lambdaを確認

関数の作成画面にて「実行ロール」にexec-lambdaを設定します。

{{< i prefix="29-" method="resize" width=1280 >}}

関数の作成後にコードを修正します。
パラメータからバケット名とオブジェクト名を取得しオブジェクトに"Hello, World!"と書き込むだけのシンプルな処理です。

```js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

exports.handler = async (event) => {
  const s3Client = new S3Client({ region: "ap-northeast-1" });
  const params = {
    Bucket: event.bucketName,
    Key: event.objectName,
    Body: "Hello, World!",
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log("Success", data);
  } catch (err) {
    console.log("Error", err);
  }
};
```

ローカル開発環境上で上記コードとnode_modules一式をzipに固めてからアップロードします。

{{< i prefix="30-" method="resize" width=1280 >}}

使用したサンプルコードは[こちら](https://github.com/kengo-k/sample-lambda-nodejs)です。

アップロード完了後、コードが更新されていることを確認し、「Test」ボタンをクリックして実行します。

{{< i prefix="34-" method="resize" width=800 >}}

テスト実行する際にコード内で利用しているパラメータをテストイベントとして設定します。

{{< i prefix="35-" method="resize" width=800 >}}

実行後、S3のバケット内にオブジェクトhello.txtが作成されていれば成功です。

{{< i prefix="36-" method="resize" width=1280 >}}

### ロールの切り替え

dev-userからadminロールに切り替えることでIAMの管理作業を実施できることを確認します。
画面右上から「ロールの切り替え」をクリックします。

{{< i prefix="31-" method="resize" height=300 >}}

「アカウント」にアカウントID、「ロール」に"admin"、「表示名」に表示用の任意の名前を指定します。
ここではロール名と同じ"admin"と設定しました。入力後、「ロールの切り替え」ボタンをクリックします。

{{< i prefix="32-" method="resize" width=960 >}}

adminロールに切り替えたのでIAMを操作できるはずです。IAMの画面を表示してみます。

{{< i prefix="33-" method="resize" width=1280 >}}

一例のみですが、ポリシーの一覧を表示してみました。ルートアカウントの時と同様にポリシーを編集できることが確認できます。

## おわりに

荒削りですが、AWSの権限管理の基本的な手順を紹介しました。役に立つ情報になったでしょうか？
今回は手順を学ぶこと、そしてルートアカウントを使わずに済む状態を作ることがメインテーマであり、設定内容はかなりざっくりで行いました。

個人的にはポリシーのActionを(ワイルドカードを使わず)きめ細かく設定するのはかなり手間なのではと感じました。
そしてポリシーの粒度はどの程度にすべきなのか悩みました。ポリシーは最大10個までしかアタッチできないので、
何でもかんでも細かく定義すればいいわけではなさそう。
その辺りの勘所は実務で運用をしてみないとなかなか掴めないのかもしれません(有識者のご意見お待ちしております)。
