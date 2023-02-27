# dnsmasqを使用して内部DNSを構築する

Dockerを使用してdnsmasqコンテナを起動する。まずは下記の内容で`Dockerfile`を作成する。

```Dockerfile
FROM alpine:3.17

RUN \
  apk update; \
  apk add dnsmasq;

COPY dnsmasq.conf /etc/dnsmasq.conf
COPY hosts-dnsmasq /etc/hosts-dnsmasq

CMD ["dnsmasq", "-k"]
```

上記Dockerfile内で設定ファイルを`COPY`しているため設定ファイルを作成する。下記の内容でdnsmasq.confを作成する。

```
port=53
no-hosts
addn-hosts=/etc/hosts-dnsmasq
expand-hosts
domain=mynet
domain-needed
bogus-priv
```

続いてホストとIPの対応を定義したhostsファイルをhosts-dnsmasqという名前で作成する。

```
192.168.11.1 host-1
192.168.11.2 host-2
```

# DNSの起動と設定

- Dockerfileと設定ファイル、hostsファイルを作成したらDockerコンテナを起動する
- ルーターの設定画面のDNSサーバ設定に起動したコンテナのIPを設定する
- クライアント側でWifiをOFF→ONしてDNSのIPがコンテナのIPに切り替わることを確認する
