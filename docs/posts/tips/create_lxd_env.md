# LXDのインストール

- 環境: Ubuntu22.04

インストールパッケージはaptには存在しなかったのでsnapを利用してインストールを行う。

```
$ sudo snap install lxd
```

インストールが完了したら初期設定を行う。

```
$ sudo lxd init
Would you like to use LXD clustering? (yes/no) [default=no]:
Do you want to configure a new storage pool? (yes/no) [default=yes]:
Name of the new storage pool [default=default]:
Name of the storage backend to use (ceph, dir, lvm, zfs, btrfs) [default=zfs]: btrfs
Create a new BTRFS pool? (yes/no) [default=yes]:
Would you like to use an existing empty block device (e.g. a disk or partition)? (yes/no) [default=no]:
Size in GiB of the new loop device (1GiB minimum) [default=30GiB]: 64GiB
Would you like to connect to a MAAS server? (yes/no) [default=no]:
Would you like to create a new local network bridge? (yes/no) [default=yes]:
What should the new bridge be called? [default=lxdbr0]:
What IPv4 address should be used? (CIDR subnet notation, “auto” or “none”) [default=auto]:
What IPv6 address should be used? (CIDR subnet notation, “auto” or “none”) [default=auto]: none
Would you like the LXD server to be available over the network? (yes/no) [default=no]:
Would you like stale cached images to be updated automatically? (yes/no) [default=yes]:
Would you like a YAML "lxd init" preseed to be printed? (yes/no) [default=no]:
```

設定値を尋ねられるが基本的にはそのままエンターする。デフォルトから変えた箇所は

- ファイルシステムをzfsからbtrfsへ
- ストレージサイズを64GiBへ
- IPv6を使用しないように設定

インストールを行ったユーザはlxdグループに追加されている。

# コンテナを作成する

```
$ lxc launch ubuntu:22.04 default \
  -c security.nesting=true \
  -c security.privileged=true
Creating default
Starting default
```

ここでは任意のコンテナ名として`default`と指定している。`-c`オプションで渡している二つの引数は権限周りの設定でコンテナ内でdockerを実行するために指定している。

# コンテナ一覧を表示する

```
$ lxc list
+---------+---------+---------------------+------+-----------+-----------+
|  NAME   |  STATE  |        IPV4         | IPV6 |   TYPE    | SNAPSHOTS |
+---------+---------+---------------------+------+-----------+-----------+
| default | RUNNING | 10.211.78.98 (eth0) |      | CONTAINER | 0         |
+---------+---------+---------------------+------+-----------+-----------+
```

# コンテナに入る

```
$ lxc exec default bash
root@default:~#
```

# コンテナを削除する

停止してから削除を実行する。

```
$ lxc stop default
$ lxc delete default
```

# ネットワークの一覧を表示する

```
$ lxc network list
```

# トラブルシューティング: コンテナから外部へつながらない


```
# sudo nft list ruleset
```

でDROPの設定が入っている(らしい)※nftがなにかもよくわかってない。参考: https://zenn.dev/tantan_tanuki/articles/9a68acd97c58d8

知識がないので詳細が把握できていないが、コンテナ内で

```
# sudo iptables -P FORWARD ACCEPT
```

を実行することでコンテナから外部への接続できるようになった。

# コンテナをホストのネットワークに所属させる

参考URL: https://mickey-happygolucky.hatenablog.com/entry/2023/01/08/231239
         https://www.waguri-soft.com/2020/05/29/lxd%E3%81%AE%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF%E3%81%A7%E5%9B%BA%E5%AE%9Aip%E3%82%92%E6%8C%AF%E3%82%8B/
         https://chat.openai.com/chat/eba711b5-9a06-4d44-baf8-39cc3262e9ec
         https://chat.openai.com/chat/69c0c41c-6faa-47e9-a1b3-116f586686a5
         https://chat.openai.com/chat/872b5fb6-525a-42c1-bcad-d7a69f642842
         https://chat.openai.com/chat/eff9ad1d-9d77-400f-bc2b-a5e0097671bc


```yaml
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enp3s0:
      dhcp4: no
  bridges:
    br0:
      interfaces:
        - enp3s0
      dhcp4: yes
      parameters:
        forward-delay: 0
        stp: no
      optional: true
```



# コンテナにDockerをインストールする

TODO
