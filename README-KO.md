# NWT Linker

NWT Linker는 성경 구절 참조를 JW Library 또는 jw.org에서 《신세계역》을 여는 링크로 변환해 주는 Obsidian 커뮤니티 플러그인입니다.

노트에 성경 책 이름과 장/절 참조를 입력하면, 플러그인이 해당 구절을 《신세계역》에서 여는 링크로 변환합니다.

## 주요 기능

- 입력하는 대로 성경 구절 참조를 자동으로 링크로 변환
- jw.org의 《신세계역》 링크 생성
- JW Library가 설치되어 있으면 JW Library에서 열고, 그렇지 않으면 jw.org로 대체
- 설정 가능한 책 이름 별칭 지원
- WT Locale 프리셋에서 책 이름 별칭 불러오기
- 별칭 추가, 편집, 삭제, JSON 가져오기 및 내보내기
- 별칭이 프리셋에서 불러온 것인지 사용자 편집인지 추적
- 언어 로케일, 출판물, URL 템플릿 설정 가능
- 입력을 멈춘 후 짧은 지연 시간을 두고 변환하여 편집을 방해하지 않음

## 사용 방법

다음과 같이 성경 구절을 입력하세요.

```text
디도1:14
```

변환 후에는 다음과 같은 링크가 됩니다.

```md
[디도 1:14](https://www.jw.org/finder?srcid=jwlshare&wtlocale=KO&prefer=lang&bible=56001014&pub=nwtsty)
```

책 이름과 장 사이에 공백이 있어도 작동합니다.

```text
디도 1:14
```

## 책 이름 별칭

각 성경 책마다 별칭을 설정할 수 있습니다. 별칭은 **WT Locale** 설정에 따라 해당 프리셋에서 불러옵니다.

예를 들어 한국어(`KO`) 프리셋에는 다음과 같은 별칭이 포함되어 있습니다.

- `창세기`, `창` → 창세기
- `시편`, `시` → 시편
- `디도`, `디도` → 디도
- `요한`, `요` → 요한

이렇게 하면 평소 사용하는 약칭을 그대로 성경 구절 링크로 변환할 수 있습니다.

설정 화면의 **Book name aliases**에서 다음 작업을 할 수 있습니다.

- 별칭 추가
- 기존 별칭의 책 번호 변경
- 별칭 삭제
- JSON으로 일괄 가져오기 / 내보내기
- **Load aliases for current WT Locale**: 현재 WT Locale에 해당하는 프리셋으로 별칭을 교체합니다(예: `KO — 한국어`).

### 사용자 정의 별칭과 프리셋 다시 불러오기

별칭을 추가·편집·삭제·가져오기하면 별칭 목록은 **custom** 상태가 됩니다. 설정 화면에서는 현재 목록이 프리셋에서 불러온 것인지, 사용자 편집된 것인지 표시됩니다.

custom 상태에서 **Load aliases for current WT Locale**을 선택하면 사용자 정의 별칭을 실수로 덮어쓰지 않도록 확인 대화상자가 표시됩니다. 현재 로케일의 프리셋이 이미 불러와져 있다면 바로 다시 불러옵니다.

### 새로운 언어 프리셋 요청

지원되었으면 하는 WT Locale이 있다면 [GitHub](https://github.com/jwnetdotwork/nwt-linker)의 Issue 또는 Pull Request로 알려 주세요.

## 설정

설정 화면에서 다음 항목을 조정할 수 있습니다.

- 변환 기능 켜기 / 끄기
- 입력 중단 후 변환 대기 시간
- 열 출판물의 언어 로케일
- 열 출판물
- URL 템플릿

다른 WT Locale을 사용하는 경우, 언어 로케일 설정을 해당 언어에 맞게 변경하세요.

## 설치 방법

### 수동 설치

1. GitHub [Release 페이지](https://github.com/jwnetdotwork/nwt-linker/releases)에서 최신 릴리스의 `main.js`와 `manifest.json`을 다운로드합니다.
2. 해당 두 파일을 Vault의 다음 폴더에 넣습니다.

```text
<Vault>/.obsidian/plugins/obsidian-nwt-linker/
```

3. Obsidian을 다시 불러오고, **설정 → 커뮤니티 플러그인**에서 NWT Linker를 활성화합니다.

## 참고

- 지원하는 WT Locale 프리셋:
  - 일본어(`J`)
  - 영어(`E`)
  - 스페인어(`S`)
  - 중국어 번체(`CH`)
  - 중국어 간체(`CHS`)
  - 브라질 포르투갈어(`T`)
  - 프랑스어(`F`)
  - 독일어(`X`)
  - 한국어(`KO`)
  - 이탈리아어(`I`)
  - 러시아어(`U`)
- 설정한 WT Locale에 해당하는 프리셋이 없는 경우, 최초 설정 시 일본어(`J`) 프리셋으로 대체됩니다.
- 이 플러그인은 Obsidian 커뮤니티 플러그인입니다.
- 기본적으로 오프라인에서 작동합니다.
- jw.org 이용 약관을 준수하며 스크래핑을 하지 않습니다.
- 성경 구절 링크 변환은 노트 안에서만 이루어집니다.
- WT Locale 확인 방법
  - 사용하는 언어로 공유 링크를 만든 후 `wtlocale=` 뒤의 대문자 알파벳을 찾으세요. 해당 대문자 알파벳이 WT Locale입니다.
  - 예: `https://www.jw.org/finder?srcid=jwlshare&wtlocale=KO&prefer=lang&bible=40024045&pub=nwtsty`라는 공유 링크라면 WT Locale은 `KO`입니다.
