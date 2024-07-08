---
title: 'Environment Setup'
description: 'How to set up the development environment for EAUploader'
---

You can set up the development environment using the following steps.

1. Create an empty Avatar project in VCC (VRChat Creator Companion).
  1. Note: If you have already installed EAUploader in VCC using the method for general users, make sure that Easy Avatar Uploader for VRChat is **Not Installed** in Manage Packages.
2. Create a folder named `tech.uslog.eauploader` under the `Packages` folder in the Unity project you created.
3. In the folder created in the previous step, enter the following commands:

  1. `git clone https://github.com/Project-EAUploader/EAUploader-for-VRChat.git .`
  2. Note: Do not forget the dot. If you forget the dot, another folder will be created under the `tech.uslog.eauploader` folder, and EAUploader will not work properly.
  3. Restart the Unity project, and if the EAUploader window appears automatically, the development environment has been set up.

There is no special build process required for Unity extension development. When you make changes to the source code, Unity will automatically build it.

