---
title: 'Extension Development'
description: 'Guide to developing extensions for EAUploader'
---

# EAUploader Extension Development Quick Start Guide

This document explains how to develop extensions for EAUploader.
For implementation details, please refer to the "Viewpoint Position Editor" extension that comes pre-installed with EAUploader.
The code for the implementation can be found under Packages/tech.uslog.eauploader/Editor/Resources/UI/TabContents/SetUp/Editor/ViewpointPositionEditor.

This document is based on the content of EAUploader version 1.2.0.

## Step 1: Create a folder for the package

Create a folder to store the source code and other files that will be created in the following steps.

Create the folder inside the Assets folder of your project or at the root level of the Packages folder.
The name of the folder can be anything you like.

## Step 2: Add the source code

### Sample source code

Add the following sample source code to the folder created in Step 1.
In the following sections, we will explain the code you should write when developing an extension based on this sample source code.
Please note that this code is an excerpt from the ViewpointPositionEditor.cs file and cannot be directly copied and pasted.
Please use it as a reference.

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

### Step 2-A: Make the extension recognized by EAUploader

To make the extension recognized by EAUploader, you need to write the following code.
Please note that the role of LanguageUtility.T7eFromJsonFile will be explained in detail later.

```csharp
    [EAUPlugin]
    private static void Initialize()
    {
      string editorName = LanguageUtility.T7eFromJsonFile("Viewpoint Position Editor", LOCALIZATION_FOLDER_PATH);
      string description = LanguageUtility.T7eFromJsonFile("A powerful viewpoint position editor for Unity.", LOCALIZATION_FOLDER_PATH);
      string requirementDescription = LanguageUtility.T7eFromJsonFile("The selected model must have a VRCAvatarDescriptor component.", LOCALIZATION_FOLDER_PATH);

      // Create the editor registration information
      var editorRegistration = new EditorRegistration
      {
        // The string displayed in Unity's menu
        // It must match the string specified in the MenuItem attribute in Step 2-B.
        MenuName = "EAUploader/ViewpointPositionEditor",
        // The name of the editor displayed in EAUploader
        EditorName = editorName,
        // The description of the editor displayed in EAUploader
        Description = description,
        // The version of the extension
        Version = "0.1.0",
        // The author of the extension
        Author = "USLOG",
        // If there is a support URL or other information for the extension, it can be specified here.
        Url = "<https://uslog.tech/eauploader>",
        // Specify the method that determines whether the extension can be used or not.
        // The specified method must return a bool variable indicating whether the extension can be used.
        // True: can be used, False: cannot be used
        Requirement = CheckAvatarHasVRCAvatarDescriptor,

        // Specify the message to be displayed to the user when the extension cannot be used.
        RequirementDescription = requirementDescription
      };

      // Add the editor registration information
      EAUploaderEditorManager.RegisterEditor(editorRegistration);
    }

```

1. Apply the EAUPlugin attribute to any method.
   1. In this sample code, the Initialize method is annotated with the EAUPlugin attribute. This method will be automatically called when EAUploader starts.
2. Inside the method with the attribute applied, generate the editor registration information and call the EAUploaderEditorManager.RegisterEditor method with it as an argument.
   1. By calling EAUploaderEditorManager.RegisterEditor, the extension will be added to EAUploader.
   2. Please refer to the comments in the above source code for details on the editor registration information.

### Step 2-B: Implement the method to be called from EAUploader

Specify the MenuItem attribute to any method that you want to be called when the user clicks the launch button for the extension in EAUploader.

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

By following Steps 2-A and 2-B, the extension launch button will be displayed in the EAUploader interface.

### Step 2-C: Implement CreateGUI and OnEnable methods as needed

Implement the CreateGUI and OnEnable methods as needed.

## Step 3: Create an assembly

Right-click on the folder created in Step 1 and select "Create - Assembly Definition".
This will create an .asmdef file inside the folder.

Configure the created .asmdef file as follows:

1. Uncheck the "Auto Referenced" option.
2. Add EAUploader.Editor to the Assembly Definition References.
3. Set the Platform based on the location of the source code.
4. Add Version Defines. The settings should be as follows. The values of Define and Expression can be changed as needed.
   1. Resource: tech.uslog.eauploader
   2. Define: EAUploader
   3. Expression: 1.2.0

By following Step 3, you will be able to perform conditional compilation. For example, by writing the following code, you can enable the code only if EAUploader version 1.2.0 or higher is present:

```csharp
#if EAUploader
  using EAUploader;
#endif
```

## EAUploader API Quick Reference

### Multilingual Support

EAUploader supports multiple languages by creating JSON files that map English strings to their corresponding translations. The JSON file is loaded at an appropriate time to provide multilingual support. All translations are based on English strings.

### JSON File Format

The JSON file should be stored in the following format. You need to add one JSON file for each language you want to support.

- (Folder)
  - ja.json
  - ko.json
  - [Language].json
  Each JSON file should have the following structure:

```json
{
  "name": "Japanese",
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

### Applying to rootVisualElement directly

You can directly apply the created JSON file to rootVisualElement.
To apply it, use the LanguageUtility.LocalizationFromJsonFile method.
Specify the rootVisualElement as the first argument and the folder path where the JSON file is stored as the second argument.
This method will replace all Text attributes of components (e.g., Label, Button) that have a TextElement class as their parent in the rootVisualElement according to the values specified in the JSON file. For example, the `text="Actual View"` in the following UXML will be replaced with `text="実際のビュー"` when the language setting is Japanese.

```xml
<ui:Label text="Actual View" class="self-center text-lg font-bold" />
```

However, please note that the explanation in the previous paragraph is just an image, and it does not actually rewrite the string in the UXML file. The LanguageUtility.LocalizationFromJsonFile method only replaces the values in the rootVisualElement.

The sample code includes the relevant code in the CreateGUI method.

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

### Retrieving any language string directly from the JSON file

You can use the LanguageUtility.T7eFromJsonFile method to retrieve the language-specific string based on an English string.
In the sample code, it is used in the Initialize method.

```csharp
    [EAUPlugin]
    private static void Initialize()
    {
      string editorName = LanguageUtility.T7eFromJsonFile("Viewpoint Position Editor", LOCALIZATION_FOLDER_PATH);
      string description = LanguageUtility.T7eFromJsonFile("A powerful viewpoint position editor for Unity.", LOCALIZATION_FOLDER_PATH);
      string requirementDescription = LanguageUtility.T7eFromJsonFile("The selected model must have a VRCAvatarDescriptor component.", LOCALIZATION_FOLDER_PATH);

```

Specify the English string as the first argument and the path to the folder where the JSON file is stored as the second argument.
It will return the string corresponding to the currently set language.

### Getting the currently set language

Use the LanguageUtility.GetCurrentLanguage method.
Example usage:

```csharp
string language = LanguageUtility.GetCurrentLanguage();

```

It will return the string representing the currently set language.

- ja: Japanese is set as the display language.
- ko: Korean is set as the display language.
- en: English is set as the display language.

### UI Related

EAUploader has custom UI components implemented in Editor/Resources/UI/Components.

s