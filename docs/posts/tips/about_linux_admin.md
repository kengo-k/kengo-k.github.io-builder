# Linux(主にUbuntu)関連の雑多なTips

## serviceコマンドとsystemctlコマンドの違い

ChatGPT先生の回答

```
Ubuntu 22.04では、serviceコマンドとsystemctlコマンドは両方ともサービスの管理に使用できますが、systemctlコマンドはより新しいシステムの管理方法を提供しています。

serviceコマンドは、旧式のシステムV initスクリプトに基づくサービスを管理するために使用されます。これらのスクリプトは、/etc/init.dディレクトリに格納され、通常はサービス名に基づいたコマンドで制御されます。たとえば、Apacheサーバーを起動するには、sudo service apache2 startコマンドを実行します。

一方、systemctlコマンドは、新しいsystemdシステム管理ツールに基づくサービスを管理するために使用されます。systemdは、Linuxディストリビューションの多くで既定のinitシステムとして採用されています。systemdは、サービスの依存関係、プロセスの監視、ログの取得など、より高度な機能を提供します。たとえば、Apacheサーバーを起動するには、sudo systemctl start apache2.serviceコマンドを実行します。

一般的に、新しいシステムではsystemctlコマンドが優先され、サポートされている場合はserviceコマンドは非推奨とされます。ただし、一部の古いシステムでは、serviceコマンドしか使用できない場合があります。
```

一応ファクトチェックを行ったところ嘘は行っていない模様。
