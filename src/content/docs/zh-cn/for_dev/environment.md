---
title: '环境搭建'
description: 'EAUploader的开发环境搭建方法'
---

可以按照以下步骤搭建开发环境。

1. 在VCC（VRChat Creator Companion）中创建一个空的Avatar项目
  1. 注意！：如果您已经按照一般用户的方法将EAUploader导入VCC，请确保在“Manage Packages”中Easy Avatar Uploader for VRChat的状态为\***\*Not Installed\*\***。
2. 在创建的Unity项目中的`Packages`文件夹下创建一个名为`tech.uslog.eauploader`的文件夹。
3. 在前一步创建的文件夹中，输入以下命令。

  1. `git clone https://github.com/Project-EAUploader/EAUploader-for-VRChat.git .`
  2. 注意！：请不要忘记输入点号。如果忘记输入点号，将在`tech.uslog.eauploader`文件夹下创建另一个文件夹，导致EAUploader无法正常工作。
  3. 重新启动Unity项目，如果自动显示EAUploader窗口，则说明开发环境已经搭建完成。

在Unity扩展开发中，不需要特殊的构建步骤。修改源代码后，Unity会自动进行构建。

