---
title: '環境構築'
description: 'EAUploaderの開発環境を構築する方法'
---

下記の方法で、環境開発を構築できる。

1. VCC（VRChat Creator Companion）において空のAvaterプロジェクトを作成する
   1. 注意！：既に一般ユーザー向けの方法でEAUploaderをVCCに導入している場合、Manage PackagesにおいてEasy Avater Uploader for VRChatが\***\*Not Installed\*\***になっていることを確認してください。
2. 作成したUnityプロジェクト内に存在する、`Packages`フォルダ配下に`tech.uslog.eauploader`という名前のフォルダを作成してください。
3. 前手順で作成したフォルダにおいて、次のコマンドを入力してください。

   1. `git clone https://github.com/Project-EAUploader/EAUploader-for-VRChat.git .`
   2. 注意！：ドットを忘れないでください。ドットを忘れると、`tech.uslog.eauploader`フォルダの配下にさらにフォルダが作成され、EAUploaderが正常に動作しなくなります。
   3. Unityプロジェクトを再起動し、自動的にEAUploaderのウィンドウが表示されれば、開発環境は構築できています。

Unity拡張開発において、特別なビルド手順は必要ありません。ソースコードを変更すると、Unity側で自動的にビルドが行われます。
