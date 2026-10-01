/* ▼ 우리 반 설정 — 이 파일만 고치면 됩니다. */
window.APP_CONFIG = {
  school: '양지고등학교',
  grade: 2,
  cls: 10,
  teacher: '강미희',

  // 교사 화면에 로그인할 이메일 (Firebase Authentication 에 등록한 계정)
  teacherEmail: '',

  // Firebase 콘솔 → 프로젝트 설정 → 내 앱(웹) 의 firebaseConfig 를 그대로 붙여넣기
  firebase: null
};

/* ---- 아래는 수정하지 마세요 ---- */
(function () {
  var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
  window.APP_CFG = Object.assign({}, window.APP_CONFIG, {
    year: d.getFullYear(),
    today: d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())
  });
  window.apiReady = new Promise(function (ok) { window.__apiResolve = ok; });
})();
