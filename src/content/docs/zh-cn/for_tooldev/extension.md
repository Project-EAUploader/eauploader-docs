---
title: '扩展功能开发'
description: '关于EAUploader扩展功能开发的说明'
---

# EAUploader扩展功能开发快速入门指南

本文档将介绍如何开发EAUploader的扩展功能。
有关实现的详细信息，请参阅EAUploader默认提供的扩展功能“视点位置编辑器”。
实现代码位于Packages/tech.uslog.eauploader/Editor/Resources/UI/TabContetns/SetUp/Editor/ViewpointPositionEditor目录下。

本文档适用于EAUploader版本1.2.0。

## 步骤1：创建用于存储包的文件夹

在接下来的步骤中，将创建用于存储源代码等的文件夹。

可以在项目的Assets文件夹内或Packages文件夹下创建。
名称可以任意指定。

## 步骤2：添加源代码

### 示例源代码

将以下示例源代码添加到步骤1中创建的文件夹中。
以下将基于此示例源代码解释开发扩展功能时应编写的代码。
*请注意，此处提取的源代码是从ViewpointPositionEditor.cs中提取的，因此直接复制粘贴将无法正常工作。
仅供参考。

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

### 步骤2-A：使EAUploader识别扩展功能

为了使EAUploader识别扩展功能，需要编写以下代码。
*关于LanguageUtility.T7eFromJsonFile的作用将在稍后详细解释。

```csharp
    [EAUPlugin]
    private static void Initialize()
    {
      string editorName = LanguageUtility.T7eFromJsonFile("Viewpoint Position Editor", LOCALIZATION_FOLDER_PATH);
      string description = LanguageUtility.T7eFromJsonFile("A powerful viewpoint position editor for Unity.", LOCALIZATION_FOLDER_PATH);
      string requirementDescription = LanguageUtility.T7eFromJsonFile("The selected model must have a VRCAvatarDescriptor component.", LOCALIZATION_FOLDER_PATH);

      // 创建编辑器注册信息
      var editorRegistration = new EditorRegistration
      {
        // 在Unity中显示的菜单字符串
        // 必须与步骤2-B中指定的MenuItem属性字符串匹配。
        MenuName = "EAUploader/ViewpointPositionEditor",
        // 在EAUploader中显示的编辑器名称
        EditorName = editorName,
        // 在EAUploader中显示的编辑器描述
        Description = description,
        // 扩展功能的版本
        Version = "0.1.0",
        // 扩展功能的作者
        Author = "USLOG",
        // 如果有扩展功能的支持URL等信息，可以在此处添加。
        Url = "<https://uslog.tech/eauploader>",
        // 指定用于判断是否可以使用扩展功能的方法。
        // 指定的方法必须返回一个表示扩展功能是否可用的布尔变量。
        // True:可用，False:不可用
        Requirement = CheckAvatarHasVRCAvatarDescriptor,

        // 如果无法使用扩展功能，则指定要显示给用户的消息。
        RequirementDescription = requirementDescription
      };

      // 添加编辑器注册信息
      EAUploaderEditorManager.RegisterEditor(editorRegistration);
    }

```

1. 在任意方法上添加EAUPlugin属性。
   1. 在示例代码中，Initialize方法上添加了EAUPlugin属性。添加了此属性的方法将在EAUploader启动时自动调用。
2. 在添加了属性的方法内部生成编辑器注册信息，并将其作为参数调用EAUploaderEditorManager.RegisterEditor方法。
   1. 通过调用EAUploaderEditorManager.RegisterEditor，将扩展功能添加到EAUploader中。
   2. 有关编辑器注册信息的详细信息，请参阅上述源代码的注释。

### 步骤2-B：实现从EAUploader调用的方法

将MenuItem属性指定给任意方法。
当用户点击扩展编辑器的启动按钮时，将调用指定的方法。

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

通过执行步骤2-A和步骤2-B，EAUploader界面将显示扩展功能启动按钮。

### 步骤2-C：根据需要实现CreateGUI、OnEnable等方法

根据需要实现CreateGUI方法和OnEnable方法等。

## 步骤3：创建程序集

右键单击步骤1中创建的文件夹，选择“Create - Assembly Deffinition”。
将在文件夹中创建.asmdef文件。

对创建的.asmdef文件进行以下设置。

1. 取消“Auto Referenced”的选中状态
2. 在“Assembly Definition References”中添加EAUploader.Editor
3. 根据源代码的位置设置Platform。
4. 添加Version Defines。设置如下值。请根据需要更改Define和Expression的值。
   1. Resource:tech.uslog.eauploader
   2. Define:EAUploader
   3. Expression:1.2.0

通过上述步骤3，可以进行条件编译。
例如，通过以下方式编写代码，只有存在Ver1.2.0以上的EAUploader时，才会启用代码。

```csharp
#if EAUploader
  using EAUploader;
#endif
```

## EAUploaderAPI简易参考

### 多语言支持

EAUploader通过创建包含英语字符串和与任意语言字符串对应关系的JSON文件，并在适当的时候加载该JSON文件，实现了多语言支持。任意语言字符串都可以通过英语作为键来获取。

### 创建JSON文件的格式

JSON文件应按以下格式存储。需要为每种语言添加一个JSON文件。

- (任意文件夹)
  - ja.json
  - ko.json
  - [表示语言的字符串].json
  每个JSON文件的内容如下所示。

```json
{
  "name": "日本語",
  "items": [
  {
    "key": "Apply",
    "value": "应用"
  },
  {
    "key": "Close",
    "value": "关闭"
  },
  {
    "key": "Actual View",
    "value": "实际视图"
  },
  {
    "key": "Viewpoint Position Editor",
    "value": "视点位置编辑器"
  },
  {
    "key": "A powerful viewpoint position editor for Unity.",
    "value": "一个强大的Unity视点位置编辑器"
  },
  {
    "key": "The selected model must have a VRCAvatarDescriptor component.",
    "value": "所选模型必须具有VRCAvatarDescriptor组件。"
  }
  ]
}
```

### 直接应用于rootVisualElement

可以直接将创建的JSON文件应用于rootVisualElement。
使用LanguageUtility.LocalizationFromJsonFile方法。
将rootVisualElement作为第一个参数，将包含JSON文件的文件夹路径作为第二个参数传递。
此方法将根据JSON文件中的内容替换rootVisualElement中所有具有TextElement类作为父级的组件（例如：Label、Button）的Text属性的值。例如，以下UXML中的`text="Actual View"`，如果语言设置为日语，则将替换为`text="实际视图"`。

```xml
<ui:Label text="Actual View" class="self-center text-lg font-bold" />
```

请注意，上述说明是一种想象，实际上并没有更改UXML文件的字符串。LanguageUtility.LocalizationFromJsonFile方法替换的只是rootVisualElement中的值。

示例代码中，在CreateGUI方法中编写了相应的代码。

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

### 直接从JSON文件获取任意语言字符串

使用LanguageUtility.T7eFromJsonFile方法，可以指定英语字符串并获取当前设置的语言对应的字符串。
示例代码中，在Initialize方法中使用了该方法。

```csharp
    [EAUPlugin]
    private static void Initialize()
    {
      string editorName = LanguageUtility.T7eFromJsonFile("Viewpoint Position Editor", LOCALIZATION_FOLDER_PATH);
      string description = LanguageUtility.T7eFromJsonFile("A powerful viewpoint position editor for Unity.", LOCALIZATION_FOLDER_PATH);
      string requirementDescription = LanguageUtility.T7eFromJsonFile("The selected model must have a VRCAvatarDescriptor component.", LOCALIZATION_FOLDER_PATH);

```

将英语字符串作为第一个参数传递，将包含JSON文件的文件夹路径作为第二个参数传递。
返回值是根据当前设置的语言获取的字符串。

### 获取当前设置的语言

使用LanguageUtility.GetCurrentLanguage方法。
使用示例。

```csharp
string language = LanguageUtility.GetCurrentLanguage();

```

返回值是表示当前设置的语言的字符串。

- ja：显示语言设置为日语。
- ko：显示语言设置为韩语。
- en：显示语言设置为英语。

### UI相关

在Editor/Resources/UI/Components目录中，包含了EAUploader中独有的UI组件。

