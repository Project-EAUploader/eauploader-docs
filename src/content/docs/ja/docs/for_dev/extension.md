---
title: '拡張機能開発'
description: 'EAUploaderの拡張機能開発について'
---

# EAUplaoder拡張機能開発クイックスタートガイダンス

本文書では、EAUplaoderの拡張機能を開発する方法を解説します。
実装の詳細につきましては、EAUploaderにデフォルトで搭載されている拡張機能である「ビューポイント位置エディタ」をご覧ください。
Packages/tech.uslog.eauploader/Editor/Resources/UI/TabContetns/SetUp/Editor/ViewpointPositionEditor配下に実装のコードが存在します。

本ドキュメントは、EAUplaoderv1.2.0の内容に準拠しています。

## 手順1:パッケージをつくるためのフォルダを作成する

以降の手順で作成する、ソースコード等を格納するフォルダを作成します。

プロジェクトのAssets内またはPackages直下に作成します。
名前は任意の名前で構いません。

## 手順2:ソースコードを追加する

### サンプルソース

手順1で追加したフォルダに次のようなソースコードを追加します。
以下、このサンプルソースをベースとして、拡張機能を開発するときに書くべきコードについて解説します。
※ViewpointPositionEditor.csから解説に必要な部分のソースコードを抜粋したものであるため、このままコピー＆ペーストしても動作しません。
あくまで参考用としてご覧ください。

ViewpointPositionEditor.cs

```csharp
using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;
using EAUploader.CustomPrefabUtility;
using System;

namespace EAUploader.UI.Setup
{
    public class ViewpointPositionEditor : EditorWindow
    {
        private const string LOCALIZATION_FOLDER_PATH = "Packages/tech.uslog.eauploader/Editor/Resources/UI/TabContents/Setup/Editor/ViewpointPositionEditor/Localization";
        private ViewpointPositionEditorUI _editorUI;
        private PreviewRenderer _previewRenderer;
        private GameObject _gameObject;

        [EAUPlugin]
        private static void Initialize()
        {
            string editorName = LanguageUtility.T7eFromJsonFile("Viewpoint Position Editor", LOCALIZATION_FOLDER_PATH);
            string description = LanguageUtility.T7eFromJsonFile("A powerful viewpoint position editor for Unity.", LOCALIZATION_FOLDER_PATH);
            string requirementDescription = LanguageUtility.T7eFromJsonFile("The selected model must have a VRCAvatarDescriptor component.", LOCALIZATION_FOLDER_PATH);

            var editorRegistration = new EditorRegistration
            {
                MenuName = "EAUploader/ViewpointPositionEditor",
                EditorName = editorName,
                Description = description,
                Version = "0.1.0",
                Author = "USLOG",
                Url = "<https://uslog.tech/eauploader>",
                Requirement = CheckAvatarHasVRCAvatarDescriptor,
                RequirementDescription = requirementDescription
            };

            EAUploaderEditorManager.RegisterEditor(editorRegistration);
        }

        [MenuItem("EAUploader/ViewpointPositionEditor")]
        public static void Popup()
        {
            ViewpointPositionEditor editor = GetWindow<ViewpointPositionEditor>();
            editor.titleContent = new GUIContent("Viewpoint Position Editor");
            editor.minSize = new Vector2(800, 600);
            editor.position = new Rect(100, 100, 1200, 600);
        }

        public void OnEnable()
        {
            _gameObject = PrefabManager.GetPrefab(EAUploaderCore.selectedPrefabPath);

            if (_gameObject == null)
            {
                return;
            }

            _previewRenderer = new PreviewRenderer(_gameObject);
        }

        public void CreateGUI()
        {
            if (_gameObject == null)
            {
                Close();
                return;
            }

            _editorUI = new ViewpointPositionEditorUI(_previewRenderer);
            rootVisualElement.Add(_editorUI.Root);

            // Localization file path
            var localizationFolderPath = "Packages/tech.uslog.eauploader/Editor/Resources/UI/TabContents/Setup/Editor/ViewpointPositionEditor/Localization";
            LanguageUtility.LocalizationFromJsonFile(rootVisualElement, localizationFolderPath);
        }

        private void OnDisable()
        {
            _previewRenderer?.Dispose();
            _editorUI?.Dispose();
        }

        private static bool CheckAvatarHasVRCAvatarDescriptor(string prefabPath)
        {
            GameObject gameObject = PrefabManager.GetPrefab(prefabPath);
            return Utility.CheckAvatarHasVRCAvatarDescriptor(gameObject);
        }
    }

```

### 手順2-A:拡張機能をEAUploader側に認識させる

拡張機能をEAUploader側に認識させるために、下記のコードを書く必要があります。
※LanguageUtility.T7eFromJsonFileの役割については、後ほど詳細に解説します。

```csharp
        [EAUPlugin]
        private static void Initialize()
        {
            string editorName = LanguageUtility.T7eFromJsonFile("Viewpoint Position Editor", LOCALIZATION_FOLDER_PATH);
            string description = LanguageUtility.T7eFromJsonFile("A powerful viewpoint position editor for Unity.", LOCALIZATION_FOLDER_PATH);
            string requirementDescription = LanguageUtility.T7eFromJsonFile("The selected model must have a VRCAvatarDescriptor component.", LOCALIZATION_FOLDER_PATH);

            // エディタ登録情報の生成
            var editorRegistration = new EditorRegistration
            {
                // Unity上で表示されるメニューの文字列
                // 手順2-Bで指定するMenuItem属性の文字列と一致させる必要があります。
                MenuName = "EAUploader/ViewpointPositionEditor",
                // EAUploader上で表示されるエディタの名前
                EditorName = editorName,
                // EAUploader上で表示されるエディタの説明
                Description = description,
                // 拡張機能のバージョン
                Version = "0.1.0",
                // 拡張機能の作者
                Author = "USLOG",
                // 拡張機能のサポートURL等あれば、ここに記述できます。
                Url = "<https://uslog.tech/eauploader>",
                // 拡張機能を使用できるかどうか判断するメソッドを指定します。
                // 指定するメソッドは、拡張機能の使用可否を表すbool型の変数を返す必要があります。
                // True:使用できる、False:使用できない
                Requirement = CheckAvatarHasVRCAvatarDescriptor,

                // 拡張機能を使用できない場合に、ユーザーに表示するメッセージを指定します。
                RequirementDescription = requirementDescription
            };

            // エディタ登録情報の追加
            EAUploaderEditorManager.RegisterEditor(editorRegistration);
        }

```

1. 任意のメソッドにEAUPlugin属性を付与する。
   1. 本サンプルコードでは、Initializeメソッドに対しEAUPlugin属性を付与しています。この属性を付与したメソッドは、EAUploader起動時に自動的に呼び出されます。
2. 前手順で属性を付与したメソッド内でエディタ登録情報を生成しそれを引数として、EAUploaderEditorManager.RegisterEditorメソッドを呼び出す。
   1. EAUploaderEditorManager.RegisterEditorを呼び出すことで、EAUploader側に拡張機能が追加されます。
   2. エディタ登録情報の詳細は上記ソースコードのコメントをご覧ください。

### 手順2-B:EAUploader側から呼び出すメソッドを実装する

下記のようにMenuItem属性を任意のメソッドに指定します。
ユーザーが拡張エディタの起動ボタンを押した際、呼び出されるメソッドとなります。

```csharp
        [MenuItem("EAUploader/ViewpointPositionEditor")]
        public static void Popup()
        {
            ViewpointPositionEditor editor = GetWindow<ViewpointPositionEditor>();
            editor.titleContent = new GUIContent("Viewpoint Position Editor");
            editor.minSize = new Vector2(800, 600);
            editor.position = new Rect(100, 100, 1200, 600);
        }

```

手順2-A,手順2-Bの手順を踏むことで、EAUploaderの画面に拡張機能起動ボタンが表示されるようになります。

### 手順2-C:他必要に応じてCreateGUI,OnEnableメソッド等を実装する

必要に応じてCreateGUIメソッドやOnEnableメソッドを実装してください。

## 手順3:アセンブリの作成

手順1で作成したフォルダを右クリックし、「Create - Assembly Deffinition」をクリックしてください。
フォルダ内に.asmdefファイルが作成されます。

作成した.asmdefファイルに対し、次の設定を行ってください。

1. Auto Referencedのチェックを外す
2. Assembly Definition ReferencesにEAUploader.Editorを追加する
3. ソースコードが置かれている場所によって、Platformを設定する。
4. Version Definesを追加する。設定値は下記である。Define、Expressionの値は、適宜変更して適用すること。
   1. Resource:tech.uslog.eauploader
   2. Define:EAUploader
   3. Expression:1.2.0

上記手順3によって、条件付きコンパイルを行えるようになります。
例えば、次のように記述することで、Ver1.2.0以上のEAUploaderが存在する場合にのみ、コードを有効にするといった動作が可能になります。

```csharp
#if EAUploader
    using EAUploader;
#endif
```

## EAUploaderAPI簡易リファレンス

### 多言語対応

EAUploaderでは、英語の文字列と、任意の言語文字列の対応が記述されたJSONファイルを作成し、そのJSONファイルを適当なタイミングで読み込むことによって、多言語対応を実現しています。任意の言語文字列は、すべて英語をキーとして取得できます。

### 作成するJSONファイルの形式

JSONファイルは次の形式で格納する必要があります。対応する言語ごとに一つのJSONファイルを追加する必要があります。

- (任意のフォルダ)
  - ja.json
  - ko.json
  - [言語を表す文字列].json
    各JSONファイルは、例えば次のような内容になります。

```json
{
  "name": "日本語",
  "items": [
    {
      "key": "Apply",
      "value": "適用"
    },
    {
      "key": "Close",
      "value": "閉じる"
    },
    {
      "key": "Actual View",
      "value": "実際のビュー"
    },
    {
      "key": "Viewpoint Position Editor",
      "value": "ビューポイント位置エディタ"
    },
    {
      "key": "A powerful viewpoint position editor for Unity.",
      "value": "Unity用の強力なビューポイント位置エディタ"
    },
    {
      "key": "The selected model must have a VRCAvatarDescriptor component.",
      "value": "選択したモデルにはVRCAvatarDescriptorコンポーネントが必要です。"
    }
  ]
}
```

### rootVisualElementに直接適用

作成したJSONファイルをrootVisualElementに直接適用できます。
適用するには、LanguageUtility.LocalizationFromJsonFileメソッドを使用します。
第一引数に適用したいrootVisualElement、第二引数に前手順で作成したJSONファイルが格納されているフォルダパスを指定します。
本メソッドは、rootVisualElement中にあるTextElementクラスを親に持つコンポーネント（例：Label,Button）のText属性の値を、JSONファイルに記述された値にしたがって、すべて置換します。例えば次のUXML中の`text="Actual View"`は、言語設定が日本語である場合、`text="実際のビュー"`に置き換えられて読み込まれるのと同等の働きをします。

```xml
<ui:Label text="Actual View" class="self-center text-lg font-bold" />
```

もっとも、前文の説明はイメージであり、実際にUXMLファイルの文字列を書き換えているわけではない点に注意してください。LanguageUtility.LocalizationFromJsonFileメソッドが置き換えるのは、あくまでもrootVisualElement中の値です。

サンプルコードでは、CreateGUIメソッド中に該当の処理が記述されています。

```csharp
        public void CreateGUI()
        {
            if (_gameObject == null)
            {
                Close();
                return;
            }

            _editorUI = new ViewpointPositionEditorUI(_previewRenderer);
            rootVisualElement.Add(_editorUI.Root);

            // Localization file path
            var localizationFolderPath = "Packages/tech.uslog.eauploader/Editor/Resources/UI/TabContents/Setup/Editor/ViewpointPositionEditor/Localization";
            LanguageUtility.LocalizationFromJsonFile(rootVisualElement, localizationFolderPath);
        }

```

### 直接任意言語文字列をJSONファイルから取得する

LanguageUtility.T7eFromJsonFileメソッドを使用すると、英語の文字列を指定して、現在設定されている言語に応じた文字列を取得出来ます。
サンプルコードでは、Initializeメソッド内で使用されています。

```csharp
        [EAUPlugin]
        private static void Initialize()
        {
            string editorName = LanguageUtility.T7eFromJsonFile("Viewpoint Position Editor", LOCALIZATION_FOLDER_PATH);
            string description = LanguageUtility.T7eFromJsonFile("A powerful viewpoint position editor for Unity.", LOCALIZATION_FOLDER_PATH);
            string requirementDescription = LanguageUtility.T7eFromJsonFile("The selected model must have a VRCAvatarDescriptor component.", LOCALIZATION_FOLDER_PATH);

```

第一引数には、英語の文字列を指定します。第二引数には、JSONファイルが格納されたフォルダへのパスを指定します。
戻り値として、現在設定されている言語に応じた文字列を返します。

### 現在設定されている言語を取得する

LanguageUtility.GetCurrentLanguageメソッドを使用します。
使用例。

```csharp
string language = LanguageUtility.GetCurrentLanguage();

```

戻り値として、現在設定されている言語を表す文字列を返します。

- ja:表示言語として、日本語が設定されている。
- ko:表示言語として、韓国語が設定されている。
- en:表示言語として、英語が設定されている。

### UI関連

Editor/Resources/UI/Components配下に、EAUploaderで独自に実装されているUIコンポーネントが存在します。
