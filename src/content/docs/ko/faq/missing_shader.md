---
title: '셰이더를 찾을 수 없음 오류'
description: '셰이더를 찾을 수 없음 오류 해결 방법'
---

## 어떤 문제가 있나요?
아바타의 텍스처(외형)를 그리는 데 필요한 '셰이더'가 프로젝트에 없음을 나타냅니다. 따라서 아바타가 분홍색으로 그려져 있어, 이대로 업로드해도 아바타를 제대로 된 모양으로 사용할 수 없습니다.

## 솔루션
아바타에 필요한 셰이더를 프로젝트에 추가합니다. 이때 Unity를 종료할 필요는 없습니다.

## 필요한 셰이더를 찾는 방법
아바타가 판매/배포된 페이지나 다운로드한 아바타의 배포 폴더에 있는 매뉴얼을 확인합니다. '필요한 셰이더'나 사양란 등의 '셰이더'에 셰이더 이름이 적혀있는지 확인합니다.

### 찾는 요령
페이지 내에서 `Ctrl + F`를 누르면 페이지 내 문자를 검색할 수 있습니다. 거기에 '셰이더'를 입력하여 페이지 내 검색을 해보시기 바랍니다.

## 필요한 셰이더를 다운로드하거나 VCC에 추가하기
필요한 셰이더의 이름을 알았다면, 검색을 통해 배포처를 찾아보세요. 다만, 대부분의 경우 아바타는 [lilToon](https://lilxyzw.github.io/lilToon/#/) 또는 [Poiyomi Toon Shader](https://booth.pm/ja/items/4841309)로 만들어져 있으니, 어렵다면 여기를 클릭해 주세요.

### VCC에 추가하는 것을 추천합니다!
셰이더는 아바타와 마찬가지로 .unitypackage로도 배포되지만, EAUploader를 프로젝트에 추가한 것처럼 VCC에 등록하고 VCC에서 프로젝트에 셰이더를 추가하는 것을 강력히 추천합니다. 셰이더는 자주 업데이트되고 있으며, VCC에서 관리하면 쉽게 업데이트할 수 있고, 여러 개의 프로젝트를 생성한 경우에도 쉽게 추가할 수 있습니다.

## 프로젝트에 셰이더를 추가하고 Unity로 돌아가기
셰이더를 추가한 후 Unity로 돌아갑니다. 아바타에 설정된 셰이더가 프로젝트에 추가되면 자동으로 아바타에 셰이더가 적용됩니다. 셰이더 오류가 발생하지 않았는지 확인한 후 아바타를 업로드합니다!