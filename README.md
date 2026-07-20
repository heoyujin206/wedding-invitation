# 모바일 청첩장 프로젝트

## 실행 방법

1. 이 폴더를 VS Code에서 엽니다.
2. `index.html`을 우클릭합니다.
3. `Open with Live Server`를 선택합니다.
4. 브라우저에 이전 내용이 남으면 `Ctrl + Shift + R`로 새로고침합니다.

## 파일 구성

- `index.html`: 화면에 표시되는 문구와 HTML 구조
- `styles.css`: 색상, 글꼴, 레이아웃, 봉투/편지 애니메이션
- `script.js`: 갤러리, 계좌 복사, 참석 여부, 방명록, 인트로 제어

## 한글 문구 수정

대부분의 한글 문구는 `index.html`에서 수정할 수 있습니다.

계좌번호와 이름은 `script.js`의 `accounts` 객체에서 수정합니다.

## 별도 추가 파일

현재 버전은 추가 이미지 파일 없이 실행됩니다.
영웅 영역과 갤러리 사진은 Unsplash 외부 주소를 사용하므로 인터넷 연결이 필요합니다.

사진을 직접 넣으려면:

1. 프로젝트 안에 `images` 폴더를 만듭니다.
2. 사진을 `images/hero.jpg`, `images/gallery-01.jpg`처럼 저장합니다.
3. `styles.css`의 `.hero` 배경 URL과 `script.js`의 `galleryImages` 값을 로컬 경로로 변경합니다.

예시:

```css
background:
  linear-gradient(...),
  url("images/hero.jpg") center / cover no-repeat;
```

```js
const galleryImages = [
  "images/gallery-01.jpg",
  "images/gallery-02.jpg"
];
```

## 외부 연결이 필요한 항목

- Google Fonts: 인터넷 연결 필요
- Unsplash 이미지: 인터넷 연결 필요
- RSVP Google Sheets 저장:
  `script.js`의 `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL`을 실제 Web App URL로 교체해야 합니다.

## 권장 폴더 구조

```text
wedding_invitation_project/
├── index.html
├── styles.css
├── script.js
└── images/                 # 직접 사진을 넣을 때 생성
    ├── hero.jpg
    ├── gallery-01.jpg
    └── gallery-02.jpg
```


## 첫 접속 카드 이미지

첫 화면 이미지는 아래 파일입니다.

```text
images/intro-card.png
```

다른 이미지로 교체할 때는 새 파일 이름도 `intro-card.png`로 맞추면 HTML 수정 없이 바로 적용됩니다.
