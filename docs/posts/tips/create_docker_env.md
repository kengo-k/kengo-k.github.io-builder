# ubuntu上のdockerにtcpアクセスできるようにしてwindowsから接続

## ubuntuの設定

ubuntu上で`/usr/lib/systemd/system/docker.service`を修正する。

before:
```
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
```

after:
```
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://192.168.111.111:2375 --containerd=/run/containerd/containerd.sock
```

上記のIP部分をDockerをインストールしたUbuntuのIPを指定する。修正後Dockerを再起動する。

```
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
```

## windowsの設定

windowsにdockerをインストールされている前提。まずは`docker-context`コマンドを使用して新しいcontextを作成する。

```
PS > docker context create <コンテキスト名> --docker host=tcp://192.168.111.111:2375
<コンテキスト名>
Successfully created context "<コンテキスト名>"
```

作成したコンテキストに切り替える。

```
PS > docker context use <コンテキスト名>
<コンテキスト名>
Current context is now "<コンテキスト名>"
```

Ubuntu上のDockerが使えるようになっているのでwindowsから実行してみる。

```
PS > docker run -it --rm alpine ash
/ #
```

コンテナが起動できることが確認できた。念のためUbuntu側で`docker ps`してalpineコンテナが存在することを確認しておく。

```
$ docker ps
CONTAINER ID IMAGE  COMMAND CREATED              STATUS              PORTS  NAMES
e81a820d34d6 alpine "ash"   About a minute ago   Up About a minute          amazing_shaw
```
