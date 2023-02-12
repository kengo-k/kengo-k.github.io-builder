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
$ lxc launch ubuntu:22.04 default # ← 任意のコンテナ名
Creating default
Starting default
```

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

# コンテナにDockerをインストールする
