---
title: '확장 기능 개발'
description: 'EAUploader 확장 기능 개발에 대해'
---

# EAUploader 확장 기능 개발 퀵 스타트 가이드

이 문서에서는 EAUploader의 확장 기능을 개발하는 방법에 대해 설명합니다.
구현의 자세한 내용은 EAUploader에 기본으로 탑재된 확장 기능인 "뷰포인트 위치 편집기"를 참조하십시오.
Packages/tech.uslog.eauploader/Editor/Resources/UI/TabContetns/SetUp/Editor/ViewpointPositionEditor 폴더에 구현 코드가 있습니다.

이 문서는 EAUploader v1.2.0의 내용을 기준으로 작성되었습니다.

## 단계 1: 패키지를 위한 폴더 생성

이후 단계에서 생성할 소스 코드 등을 저장할 폴더를 생성합니다.

프로젝트의 Assets 폴더 또는 Packages 폴더 바로 아래에 생성합니다.
이름은 임의로 지정해도 됩니다.

## 단계 2: 소스 코드 추가

### 샘플 소스 코드

단계 1에서 추가한 폴더에 다음과 같은 소스 코드를 추가합니다.
다음은 이 샘플 소스 코드를 기반으로 확장 기능을 개발할 때 작성해야 할 코드에 대해 설명합니다.
※ViewpointPositionEditor.cs에서 설명에 필요한 부분의 소스 코드를 추출한 것이므로, 그대로 복사하여 붙여넣어도 작동하지 않습니다.
참고용으로만 확인해주시기 바랍니다.

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

### 단계 2-A: 확장 기능을 EAUploader에서 인식하도록 설정

EAUploader에서 확장 기능을 인식하려면 다음 코드를 작성해야 합니다.
※LanguageUtility.T7eFromJsonFile의 역할에 대한 자세한 설명은 나중에 설명합니다.

```csharp
    [EAUPlugin]
    private static void Initialize()
    {
      string editorName = LanguageUtility.T7eFromJsonFile("Viewpoint Position Editor", LOCALIZATION_FOLDER_PATH);
      string description = LanguageUtility.T7eFromJsonFile("A powerful viewpoint position editor for Unity.", LOCALIZATION_FOLDER_PATH);
      string requirementDescription = LanguageUtility.T7eFromJsonFile("The selected model must have a VRCAvatarDescriptor component.", LOCALIZATION_FOLDER_PATH);

      // 에디터 등록 정보 생성
      var editorRegistration = new EditorRegistration
      {
        // Unity에서 표시되는 메뉴 문자열
        // 단계 2-B에서 지정하는 MenuItem 속성 문자열과 일치해야 합니다.
        MenuName = "EAUploader/ViewpointPositionEditor",
        // EAUploader에서 표시되는 에디터 이름
        EditorName = editorName,
        // EAUploader에서 표시되는 에디터 설명
        Description = description,
        // 확장 기능의 버전
        Version = "0.1.0",
        // 확장 기능의 작성자
        Author = "USLOG",
        // 확장 기능의 지원 URL 등이 있다면 여기에 기술할 수 있습니다.
        Url = "<https://uslog.tech/eauploader>",
        // 확장 기능을 사용할 수 있는지 여부를 판단하는 메서드를 지정합니다.
        // 지정하는 메서드는 확장 기능의 사용 가능 여부를 나타내는 bool 형 변수를 반환해야 합니다.
        // True: 사용 가능, False: 사용 불가능
        Requirement = CheckAvatarHasVRCAvatarDescriptor,

        // 확장 기능을 사용할 수 없는 경우 사용자에게 표시할 메시지를 지정합니다.
        RequirementDescription = requirementDescription
      };

      // 에디터 등록 정보 추가
      EAUploaderEditorManager.RegisterEditor(editorRegistration);
    }

```

1. 임의의 메서드에 EAUPlugin 속성을 추가합니다.
   1. 이 샘플 코드에서는 Initialize 메서드에 EAUPlugin 속성을 추가했습니다. 이 속성이 추가된 메서드는 EAUploader가 시작될 때 자동으로 호출됩니다.
2. 속성이 추가된 메서드 내에서 에디터 등록 정보를 생성하고, 이를 인수로하여 EAUploaderEditorManager.RegisterEditor 메서드를 호출합니다.
   1. EAUploaderEditorManager.RegisterEditor를 호출함으로써 EAUploader에 확장 기능이 추가됩니다.
   2. 에디터 등록 정보에 대한 자세한 내용은 위의 소스 코드 주석을 참조하십시오.

### 단계 2-B: EAUploader에서 호출할 메서드 구현

다음과 같이 MenuItem 속성을 임의의 메서드에 지정합니다.
사용자가 확장 에디터 실행 버튼을 누를 때 호출되는 메서드가 됩니다.

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

단계 2-A, 단계 2-B의 단계를 따르면 EAUploader 화면에 확장 기능 실행 버튼이 표시됩니다.

### 단계 2-C: 필요에 따라 CreateGUI, OnEnable 메서드 등 구현

필요에 따라 CreateGUI 메서드나 OnEnable 메서드를 구현하십시오.

## 단계 3: 어셈블리 생성

단계 1에서 생성한 폴더를 마우스 오른쪽 버튼으로 클릭하고 "Create - Assembly Deffinition"을 클릭하십시오.
폴더 내에 .asmdef 파일이 생성됩니다.

생성한 .asmdef 파일에 다음 설정을 수행하십시오.

1. Auto Referenced의 체크를 해제합니다.
2. Assembly Definition References에 EAUploader.Editor를 추가합니다.
3. 소스 코드가 위치한 위치에 따라 Platform을 설정합니다.
4. Version Defines를 추가합니다. 설정 값은 다음과 같습니다. Define, Expression의 값을 필요에 따라 변경하고 적용하십시오.
   1. Resource:tech.uslog.eauploader
   2. Define:EAUploader
   3. Expression:1.2.0

위의 단계 3을 통해 조건부 컴파일을 수행할 수 있게 됩니다.
예를 들어, 다음과 같이 작성함으로써 EAUploader 버전 1.2.0 이상이 있는 경우에만 코드를 활성화할 수 있습니다.

```csharp
#if EAUploader
  using EAUploader;
#endif
```

## EAUploaderAPI 간단한 참조

### 다국어 지원

EAUploader에서는 영어 문자열과 언어 문자열 대응이 기록된 JSON 파일을 작성하고, 해당 JSON 파일을 적절한 타이밍에 읽어들여 다국어 지원을 구현합니다. 언어 문자열은 모두 영어를 키로 하여 얻을 수 있습니다.

### 작성하는 JSON 파일의 형식

JSON 파일은 다음 형식으로 저장해야 합니다. 각 언어에 대해 하나의 JSON 파일을 추가해야 합니다.

- (임의의 폴더)
  - ja.json
  - ko.json
  - [언어를 나타내는 문자열].json
  각 JSON 파일은 다음과 같은 내용을 포함해야 합니다.

```json
{
  "name": "한국어",
  "items": [
  {
    "key": "Apply",
    "value": "적용"
  },
  {
    "key": "Close",
    "value": "닫기"
  },
  {
    "key": "Actual View",
    "value": "실제 보기"
  },
  {
    "key": "Viewpoint Position Editor",
    "value": "뷰포인트 위치 편집기"
  },
  {
    "key": "A powerful viewpoint position editor for Unity.",
    "value": "유니티용 강력한 뷰포인트 위치 편집기"
  },
  {
    "key": "The selected model must have a VRCAvatarDescriptor component.",
    "value": "선택한 모델에는 VRCAvatarDescriptor 구성 요소가 있어야 합니다."
  }
  ]
}
```

### rootVisualElement에 직접 적용

작성한 JSON 파일을 rootVisualElement에 직접 적용할 수 있습니다.
적용하려면 LanguageUtility.LocalizationFromJsonFile 메서드를 사용합니다.
첫 번째 인수에 적용하려는 rootVisualElement를, 두 번째 인수에 앞 단계에서 작성한 JSON 파일이 저장된 폴더 경로를 지정합니다.
이 메서드는 rootVisualElement 내에 있는 TextElement 클래스를 부모로 가지는 컴포넌트(예: Label, Button)의 Text 속성 값을, JSON 파일에 기록된 값에 따라 모두 대체합니다. 예를 들어 다음 UXML에서 `text="Actual View"`는 언어 설정이 한국어인 경우 `text="실제 보기"`로 대체되어 로드됩니다.

```xml
<ui:Label text="Actual View" class="self-center text-lg font-bold" />
```

그러나 앞의 설명은 이미지로서의 개념이며, 실제로 UXML 파일의 문자열을 변경하고 있는 것은 아니므로 주의하십시오. LanguageUtility.LocalizationFromJsonFile 메서드가 대체하는 것은 rootVisualElement 내의 값에 불과합니다.

샘플 코드에서는 CreateGUI 메서드에 해당 처리가 기술되어 있습니다.

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

### JSON 파일에서 임의의 언어 문자열 직접 가져오기

LanguageUtility.T7eFromJsonFile 메서드를 사용하면 영어 문자열을 지정하여 현재 설정된 언어에 따른 문자열을 가져올 수 있습니다.
샘플 코드에서는 Initialize 메서드에서 사용됩니다.

```csharp
    [EAUPlugin]
    private static void Initialize()
    {
      string editorName = LanguageUtility.T7eFromJsonFile("Viewpoint Position Editor", LOCALIZATION_FOLDER_PATH);
      string description = LanguageUtility.T7eFromJsonFile("A powerful viewpoint position editor for Unity.", LOCALIZATION_FOLDER_PATH);
      string requirementDescription = LanguageUtility.T7eFromJsonFile("The selected model must have a VRCAvatarDescriptor component.", LOCALIZATION_FOLDER_PATH);

```

첫 번째 인수에는 영어 문자열을 지정합니다. 두 번째 인수에는 JSON 파일이 저장된 폴더 경로를 지정합니다.
반환 값으로 현재 설정된 언어에 따른 문자열을 반환합니다.

### 현재 설정된 언어 가져오기

LanguageUtility.GetCurrentLanguage 메서드를 사용합니다.
사용 예제입니다.

```csharp
string language = LanguageUtility.GetCurrentLanguage();

```

반환 값으로 현재 설정된 언어를 나타내는 문자열을 반환합니다.

- ja: 표시 언어로 일본어가 설정되어 있음을 나타냅니다.
- ko: 표시 언어로 한국어가 설정되어 있음을 나타냅니다.
- en: 표시 언어로 영어가 설정되어 있음을 나타냅니다.

### UI 관련

Editor/Resources/UI/Components 폴더에는 EAUploader에서 독자적으로 구현된 UI 컴포넌트가 있습니다.

