---
title: 'Serverlessで効率アップ！AWS Lambdaを簡単デプロイ'
date: '2023-06-02'
tags:
  - aws
  - cloud
  - devops

summary: "Serverless Frameworkを使ってAWS Lambdaをデプロイする方法を調べました。まずはAWS Management Consoleから手動でデプロイを行い、同じことをServerless Frameworkにより実現します。最後にlocalstackを使ったローカル環境での動作確認の方法までを試してみました。ついでに気になるLambdaの課金体系についても調べました。"

thumbnail: aws
featureImage: "./top.jpg"
---

### AWS LambdaとAPI Gatewayを手動で設定

まずは、AWS LambdaとAPI Gatewayを手動で設定してみましょう。

#### Lambda 関数の作成

- AWS マネージメントコンソールにログインし、「Lambda」を検索し、選択します。
- 「関数の作成」ボタンをクリックします。
- 「関数の作成」を選択し、以下の設定を行います：
  - 関数名: 任意の名前を入力します（例："myFirstLambda"）。
  - ランタイム: 使用したいプログラミング言語を選択します（例："Node.js 14.x"）。
- 「関数の作成」ボタンをクリックします。

#### API Gateway の設定

- AWS マネージメントコンソールに戻り、「API Gateway」を検索し、選択します。
- 「HTTP API」を選択し、「ビルド」をクリックします。
- 以下の設定を行います：
  - API 名: 任意の名前を入力します（例："myAPIGateway"）。
  - ルートの作成: 「/myFirstLambda」を入力します。
  - メソッド: 「GET」を選択します。
  - 統合先: 先ほど作成したLambda 関数の名前（"myFirstLambda"）を入力します。
- 次へ」をクリックし、レビュー画面で設定内容を確認した後、「作成」をクリックします。

[Page bundles](https://gohugo.io/content-management/page-bundles/) are an optional way to [organize page resources](https://gohugo.io/content-management/page-resources/) within Hugo.

You can opt-in to using page bundles in Hugo Clarity with `usePageBundles` in your site configuration or in a page's front matter. [Read more about `usePageBundles`.](https://github.com/chipzoller/hugo-clarity#organizing-page-resources)

With page bundles, resources for a page or section, like images or attached files, live **in the same directory as the content itself** rather than in your `static` directory.

Hugo Clarity supports the use of [leaf bundles](https://gohugo.io/content-management/page-bundles/#leaf-bundles), which are any directories within the `content` directory that contain an `index.md` file. Hugo's documentation gives this example:

```text
content
├── about
│   ├── index.md
├── posts
│   ├── my-post
│   │   ├── content1.md
│   │   ├── content2.md
│   │   ├── image1.jpg
│   │   ├── image2.png
│   │   └── index.md
│   └── my-other-post
│       └── index.md
│
└── another-section
    ├── ..
    └── not-a-leaf-bundle
        ├── ..
        └── another-leaf-bundle
            └── index.md
```

<blockquote>
In the above example `content` directory, there are four leaf
bundles:

**about**: This leaf bundle is at the root level (directly under
    `content` directory) and has only the `index.md`.

**my-post**: This leaf bundle has the `index.md`, two other content
    Markdown files and two image files. **image1** is a page resource of `my-post`
    and only available in `my-post/index.md` resources. **image2** is a page resource of `my-post`
    and only available in `my-post/index.md` resources.

**my-other-post**: This leaf bundle has only the `index.md`.

**another-leaf-bundle**: This leaf bundle is nested under couple of
    directories. This bundle also has only the `index.md`.

_The hierarchy depth at which a leaf bundle is created does not matter,
as long as it is not inside another **leaf** bundle._
</blockquote>

### Advantages to using page bundles

The image below is part of the bundle of this page, and is located at `content/post/bundle/building.png`. Because it's within this page's bundle, the markup for the image only has to specify the image's filename, `building.png`.

![A building](building.png)

If you ever change the name of the directory in which this Markdown file and the image reside, the reference to the image would not need to be updated.

In addition to more cleanly organizing your content and related assets, when using page bundles, **Hugo Clarity will automatically generate markup for modern image formats**, which are smaller in file size.

For instance, when you reference an image like `building.png`, Hugo Clarity will check to see if the same image (based on filename) exists in [WebP](https://en.wikipedia.org/wiki/WebP), [AVIF](https://en.wikipedia.org/wiki/AVIF) or [JXL](https://en.wikipedia.org/wiki/JPEG_XL) formats. If you inspect the image above, you'll see a `<source>` element for `building.webp`, because that file is also present. Hugo Clarity will only include the markup if these images exist.

Browsers that [support these formats and the `<picture>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture#the_type_attribute) will load them, while browsers that do not will fall-back to the default image. [Read more about this process.](https://github.com/chipzoller/hugo-clarity#support-for-modern-image-formats)

Finally, note that page assets can be further managed and refined [within the page's front matter](https://gohugo.io/content-management/page-resources/#page-resources-metadata) if you wish, and are not limited to images alone.

### Disadvantages to using page bundles

Page resources in a bundle are only available to the page with which they are bundled &#8212; that means you can't include an image with one page and then reference it from another.

Images that are being used in multiple places are more appropriate for your [Hugo `assets` directory](https://gohugo.io/hugo-pipes/introduction/). Unlike files in the Hugo `static` directory, files in the `assets` directory can be run through Hugo Pipes, which [includes image processing](https://gohugo.io/content-management/image-processing/).
