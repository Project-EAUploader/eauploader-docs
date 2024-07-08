---
title: '환경 구성'
description: 'EAUploader 개발 환경 구성 방법'
---

다음 방법으로 개발 환경을 구성할 수 있습니다.

1. VCC(VRChat Creator Companion)에서 빈 Avatar 프로젝트를 생성합니다.
  1. 주의! 이미 일반 사용자를 위한 방법으로 EAUploader를 VCC에 설치한 경우, Manage Packages에서 Easy Avatar Uploader for VRChat이 **Not Installed**로 표시되는지 확인하세요.
2. 생성한 Unity 프로젝트 내에 `Packages` 폴더 아래에 `tech.uslog.eauploader`라는 이름의 폴더를 생성하세요.
3. 이전 단계에서 생성한 폴더에서 다음 명령을 입력하세요.

  1. `git clone https://github.com/Project-EAUploader/EAUploader-for-VRChat.git .`
  2. 주의! 점(.)을 빠뜨리지 마세요. 점을 빠뜨리면 `tech.uslog.eauploader` 폴더 아래에 또 다른 폴더가 생성되어 EAUploader가 정상적으로 작동하지 않을 수 있습니다.
  3. Unity 프로젝트를 다시 시작하면 EAUploader 창이 자동으로 표시되면 개발 환경이 구성됩니다.

Unity 확장 개발에서 특별한 빌드 절차는 필요하지 않습니다. 소스 코드를 수정하면 Unity에서 자동으로 빌드됩니다.

