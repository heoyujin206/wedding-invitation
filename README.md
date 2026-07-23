# 개선된 모바일 청첩장

해결한 항목:
1. 오시는 길, 지도, 대중교통, 주차 안내
2. 실제 사진용 로컬 경로와 lazy loading
3. RSVP 및 방명록 서버 저장 구조
4. 인트로 최초 1회, 3초 자동 진입, 이미지 오류 대응
5. Web Share API와 URL 복사 대체
6. label, fieldset, aria, ESC 닫기, 포커스 복귀
7. 아이보리·더스티 핑크 디자인 통일

추가해야 할 파일:
- images/hero.jpg
- images/gallery-01.jpg ~ gallery-06.jpg

script.js의 backendUrl을 실제 Google Apps Script Web App URL로 바꾸세요.
index.html의 지도 URL과 교통·주차 문구는 실제 예식장 정보로 수정하세요.

## Google Sheets 연동

RSVP와 방명록을 실제 Google Sheets에 저장하려면 `GOOGLE_SHEETS_SETUP.md`를 따라 설정하세요. Apps Script 코드는 `google-apps-script.gs`에 포함되어 있습니다.


## v7 수정사항
- 축하 메시지 등록 실패 시 Apps Script 버전/응답 오류를 화면에 구체적으로 표시합니다.
- 구버전 Apps Script 저장 방식에 대한 호환 재시도를 추가했습니다.
- RSVP 전달사항 입력란을 삭제했습니다.
- 수정·삭제까지 정상 사용하려면 최신 `google-apps-script.gs`로 새 버전을 배포해야 합니다.
