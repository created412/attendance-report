# 출결신고서 전자 제출

학교 출결신고서 양식(HWP)을 그대로 재현한 웹 양식입니다. 학생이 휴대폰으로 빈칸을 채우고 학생·보호자가 손가락으로 서명해 제출하면, 담임은 월별로 모아 보고 원본 양식 그대로 A4로 인쇄합니다.

- 첫 화면: `index.html` — 학생/교사 선택 (교사는 비밀번호 입력 후 입장)
- 학생 작성: `student.html`
- 교사 수합: `admin.html` (로그인하지 않으면 비밀번호 화면만 보임)
- 서버 연결: `config.js` (학교명은 `config.js`에 고정, 학년·반·번호·성명·날짜는 학생이, 담임 이름·확인서는 교사 화면에서 입력)
- 데이터 보안 규칙: `firestore.rules` (Firebase 콘솔 → Firestore → 규칙에 붙여넣기, `TEACHER_EMAIL`을 담임 이메일로 교체)

`config.js`에 Firebase 설정이 없으면 **체험 모드**로 동작합니다. 이때 제출 내용은 그 기기 브라우저에만 저장되고, 교사 비밀번호는 `1234`입니다. Firebase 연결 후에는 Authentication에 등록한 담임 계정의 비밀번호가 교사 비밀번호가 됩니다(`config.js`의 `teacherEmail`에 그 이메일 입력).

## Firebase 연결 (무료 Spark 요금제)
1. https://console.firebase.google.com → 프로젝트 추가 (Google 애널리틱스는 꺼도 됨)
2. 빌드 → **Firestore Database** → 데이터베이스 만들기 → 위치 `asia-northeast3 (서울)` → 프로덕션 모드
3. 빌드 → **Authentication** → 시작하기 → **이메일/비밀번호** 사용 설정 → Users 탭 → 사용자 추가 (담임 이메일·비밀번호)
4. 프로젝트 설정(톱니) → 내 앱 → 웹(`</>`) 앱 추가 → 표시되는 `firebaseConfig`를 `config.js`의 `firebase:`에 붙여넣고, `teacherEmail`에 담임 이메일 입력
5. Firestore → 규칙 탭에 `firestore.rules` 내용을 붙여넣고 `TEACHER_EMAIL`을 담임 이메일로 바꾼 뒤 게시

학생 기록은 Firestore에만 저장되고, 이 저장소에는 올라가지 않습니다.
