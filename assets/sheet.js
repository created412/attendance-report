/* 출결신고서 원본 양식(A4) 렌더러 + 서명패드 — 좌표는 원본 HWP→PDF에서 mm 단위로 추출 */
var AB = (function () {
  var W=[["출",33.53,48.01,20.04,1,"b"],["결",46.48,48.01,20.04,1,"b"],["신",59.48,48.01,20.04,1,"b"],["고",72.43,48.01,20.04,1,"b"],["서",85.39,48.01,20.04,1,"b"],["결재",104.14,47.24,14.04,1,"b"],["담임",123.66,40.0,9.96,1,"b"],["학년부장",137.92,40.0,9.96,1,"b"],["교감",159.05,40.0,9.96,1,"b"],["교장",176.7,40.0,9.96,1,"b"],["전결",159.05,49.53,9.96,0,"b"],["결재정보",104.56,64.69,9.96,1,"b"],["질병•미인정",125.31,60.28,8.04,0,"b"],["•인정(공결)",125.77,64.81,8.04,0,"b"],["담임-학년부장-교감(전결)",149.61,62.53,8.04,0,"b"],["기타",130.01,68.62,8.04,0,"b"],["담임-학년부장-교감-교장",149.73,68.62,8.04,0,"b"],["출",81.96,78.23,14.04,1,"b"],["결",91.69,78.23,14.04,1,"b"],["신",101.43,78.23,14.04,1,"b"],["고",108.67,78.23,14.04,1,"b"],["내",115.95,78.23,14.04,1,"b"],["용",123.23,78.23,14.04,1,"b"],["※",34.63,90.97,9.0,0,"b"],["해당사항에",38.65,90.97,9.0,0,"b"],["체크(√)하세요.",55.63,90.97,9.0,0,"b"],["출결현황",91.95,87.63,9.96,0,"b"],["질병□",119.21,87.88,12.0,1,"b"],["미인정□",133.65,87.88,12.0,1,"b"],["인정□",152.19,87.88,12.0,1,"b"],["기타□",166.62,87.88,12.0,1,"b"],["세부사항",91.95,94.57,9.96,0,"b"],["결석□",121.28,94.83,12.0,1,"b"],["지각□",135.72,94.83,12.0,1,"b"],["조퇴□",150.16,94.83,12.0,1,"b"],["결과□",164.59,94.83,12.0,1,"b"],["제",132.97,104.06,11.04,1,"b"],["번",177.63,104.06,11.04,1,"b"],["성",138.77,110.28,11.04,1,"b"],["명",144.48,110.28,11.04,1,"b"],[":",150.16,110.28,11.04,1,"b"],["본인은",24.72,122.68,9.96,0,"b"],["다음과",36.75,122.68,9.96,0,"b"],["같이",48.81,122.68,9.96,0,"b"],["출석",57.45,122.68,9.96,0,"b"],["사유가",66.04,122.68,9.96,0,"b"],["발생하여",78.1,122.68,9.96,0,"b"],["보호자",93.6,122.68,9.96,0,"b"],["연서로",105.62,122.68,9.96,0,"b"],["신고합니다.",117.69,122.68,9.96,0,"b"],["1.",26.29,130.56,9.96,0,"b"],["기",31.16,130.56,9.96,0,"b"],["간",36.32,130.56,9.96,0,"b"],[":",43.31,130.56,9.96,0,"b"],["월",66.21,130.56,9.96,0,"b"],["일부터",80.22,130.56,9.96,0,"b"],["월",66.29,137.96,9.96,0,"b"],["일까지(",80.31,137.96,9.96,0,"b"],["일간)",98.76,137.96,9.96,0,"b"],["2.",26.29,145.37,9.96,0,"b"],["사",31.16,145.37,9.96,0,"b"],["유(구체적으로)",36.32,145.37,9.96,0,"b"],[":",62.7,145.37,9.96,0,"b"],["월",107.15,158.96,9.96,1,"b"],["일",121.16,158.96,9.96,1,"b"],["학",137.41,164.63,9.96,0,"b"],["생",144.4,164.63,9.96,0,"b"],[":",149.56,164.63,9.96,0,"b"],["(인)",171.87,164.63,9.96,0,"b"],["학부모",137.41,170.26,9.96,0,"b"],[":",149.48,170.26,9.96,0,"b"],["(인)",171.79,170.26,9.96,0,"b"],["※",138.13,175.6,9.0,1,"b"],["미인정인",140.59,175.6,6.96,1,"b"],["경우",151.43,175.6,6.96,1,"b"],["학부모",157.44,175.6,6.96,1,"b"],["확인",165.86,175.6,6.96,1,"b"],["생략",171.87,175.6,6.96,1,"b"],["가능.",177.93,175.6,6.96,1,"b"],["확",92.84,190.33,14.04,1,"b"],["인",102.57,190.33,14.04,1,"b"],["서",112.31,190.33,14.04,1,"b"],["위",22.78,202.69,9.96,0,"b"],["신고",27.98,202.69,9.96,0,"b"],["내용이",36.58,202.69,9.96,0,"b"],["사실과",48.64,202.69,9.96,0,"b"],["틀림없음을",60.71,202.69,9.96,0,"b"],["확인합니다.",79.59,202.69,9.96,0,"b"],["1.",22.78,213.95,9.96,0,"b"],["확인방법",27.6,213.95,9.96,0,"b"],["가.",28.07,219.63,9.96,0,"b"],["가정방문",34.37,219.63,9.96,0,"b"],["(",49.87,219.63,9.96,0,"b"],["월",59.82,219.63,9.96,0,"b"],["일",73.83,219.63,9.96,0,"b"],["시",87.84,219.63,9.96,0,"b"],["대화자",93.05,219.63,9.96,0,"b"],["성명",105.07,219.63,9.96,0,"b"],[":",113.71,219.63,9.96,0,"b"],[")",146.6,219.63,9.96,0,"b"],["나.",28.07,225.26,9.96,0,"b"],["전화연락",34.37,225.26,9.96,0,"b"],["(",49.87,225.26,9.96,0,"b"],["월",59.82,225.26,9.96,0,"b"],["일",73.83,225.26,9.96,0,"b"],["시",87.84,225.26,9.96,0,"b"],["대화자",93.05,225.26,9.96,0,"b"],["성명",105.07,225.26,9.96,0,"b"],[":",113.71,225.26,9.96,0,"b"],[")",146.6,225.26,9.96,0,"b"],["다.",28.07,230.89,9.96,0,"b"],["기",34.37,230.89,9.96,0,"b"],["타",44.87,230.89,9.96,0,"b"],["(",50.08,230.89,9.96,0,"b"],["월",60.03,230.89,9.96,0,"b"],["일",74.04,230.89,9.96,0,"b"],["시",88.05,230.89,9.96,0,"b"],["대화자",93.22,230.89,9.96,0,"b"],["성명",105.28,230.89,9.96,0,"b"],[":",113.92,230.89,9.96,0,"b"],[")",146.77,230.89,9.96,0,"b"],["2.",22.78,242.19,9.96,0,"b"],["첨",27.6,242.19,9.96,0,"b"],["부",32.81,242.19,9.96,0,"b"],[":",38.02,242.19,9.96,0,"b"],["월",107.15,252.05,9.96,0,"b"],["일",119.42,252.05,9.96,0,"b"],["학급담임",144.57,263.65,11.04,1,"b"],[":",161.59,263.65,11.04,1,"b"],["(인)",176.06,263.65,9.0,1,"b"]];
var BOX=[[129.48, 87.88, 4.11], [148.02, 87.88, 4.11], [162.45, 87.88, 4.11], [176.89, 87.88, 4.11], [131.55, 94.83, 4.11], [145.99, 94.83, 4.11], [160.42, 94.83, 4.11], [174.86, 94.83, 4.11]];
  var FONT_B = "'HCR Batang','함초롬바탕','HCRBatang','Noto Serif KR','Batang','바탕',serif";
  var FONT_G = "'Gulim','굴림','Noto Sans KR','Malgun Gothic',sans-serif";
  var PT = 0.35278; // 1pt = 0.35278mm

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ymd(s) { if (!s) return null; var a = String(s).split('-'); return a.length === 3 ? { y: +a[0], m: +a[1], d: +a[2] } : null; }
  function T(t, x, b, size, bold, o) {
    o = o || {};
    if (t === '' || t == null) return '';
    return '<text x="' + x + '" y="' + b + '" font-size="' + (size * PT).toFixed(3) + '"' +
      (bold ? ' font-weight="700"' : '') + (o.fam === 'g' ? ' font-family="' + FONT_G + '"' : '') +
      (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') + (o.len ? ' textLength="' + o.len + '" lengthAdjust="spacingAndGlyphs"' : '') +
      ' xml:space="preserve">' + esc(t) + '</text>';
  }
  function L(x1, y1, x2, y2, w) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#000" stroke-width="' + (w || 0.12) + '"/>'; }
  function R(x1, y1, x2, y2, fill) { return '<rect x="' + x1 + '" y="' + y1 + '" width="' + (x2 - x1).toFixed(2) + '" height="' + (y2 - y1).toFixed(2) + '" fill="' + fill + '"/>'; }
  function IMG(src, cx, cy, w, h) {
    if (!src) return '';
    return '<image href="' + src + '" x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" preserveAspectRatio="xMidYMid meet"/>';
  }
  function CHECK(cx, b) { // □ 안의 √ 표시
    var cy = b - 1.45;
    return '<path d="M' + (cx - 1.7) + ' ' + (cy - 0.1) + ' L' + (cx - 0.45) + ' ' + (cy + 1.45) + ' L' + (cx + 2.1) + ' ' + (cy - 2.6) + '" fill="none" stroke="#000" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  // 텍스트 폭 측정 (사유 줄바꿈용)
  var _ctx;
  function measure(t, sizePt) {
    if (!_ctx) _ctx = document.createElement('canvas').getContext('2d');
    _ctx.font = (sizePt * PT * 10) + 'px ' + FONT_B;
    return _ctx.measureText(t).width / 10;
  }
  function wrap(text, widths, sizePt) {
    var lines = [], rest = String(text || '').replace(/\s+/g, ' ').trim();
    for (var i = 0; i < widths.length && rest; i++) {
      if (i === widths.length - 1 || measure(rest, sizePt) <= widths[i]) { lines.push(rest); rest = ''; break; }
      var cut = rest.length;
      while (cut > 1 && measure(rest.slice(0, cut), sizePt) > widths[i]) cut--;
      var sp = rest.lastIndexOf(' ', cut);
      if (sp > cut * 0.6) cut = sp;
      lines.push(rest.slice(0, cut).trim()); rest = rest.slice(cut).trim();
    }
    return lines;
  }

  var STATUS = [['질병', 119.2, 131.6], ['미인정', 133.6, 150.1], ['인정', 152.2, 164.6], ['기타', 166.6, 179.0]];
  var DETAIL = [['결석', 121.3, 133.7], ['지각', 135.7, 148.1], ['조퇴', 150.2, 162.5], ['결과', 164.6, 177.0]];
  var CROWS = [['ga', 219.63], ['na', 225.26], ['da', 230.89]];

  function frame() {
    var s = '';
    // 회색 칸
    s += R(28.2, 36, 97.5, 55, '#ccc') + R(99.6, 36, 118.2, 55, '#ccc') + R(118.2, 36, 188.9, 41.5, '#ccc') +
      R(99.8, 57.3, 122.9, 69.5, '#ccc') + R(85.6, 82.8, 111.9, 96.7, '#ccc');
    var K = 0.38, N = 0.12;
    // 결재란
    s += L(99.4, 36, 189.1, 36, K) + L(99.4, 55, 189.1, 55, K) + L(99.6, 36, 99.6, 55, K) + L(188.9, 36, 188.9, 55, K) +
      L(118.2, 36, 118.2, 55, N) + L(135.9, 36, 135.9, 55, N) + L(153.5, 36, 153.5, 55, N) + L(171.2, 36, 171.2, 55, N) + L(118.2, 41.5, 189.1, 41.5, N);
    // 결재정보
    s += L(99.6, 57.3, 189.1, 57.3, K) + L(99.6, 69.5, 189.1, 69.5, K) + L(99.8, 57.3, 99.8, 69.5, K) + L(188.9, 57.3, 188.9, 69.5, K) +
      L(122.9, 57.3, 122.9, 69.5, N) + L(142.4, 57.3, 142.4, 69.5, N) + L(122.9, 65.6, 189.1, 65.6, N);
    // 출결현황·세부사항 표
    s += L(85.5, 82.8, 186.3, 82.8, K) + L(85.5, 96.7, 186.3, 96.7, K) + L(85.6, 82.8, 85.6, 96.7, K) + L(186.1, 82.8, 186.1, 96.7, K) +
      L(111.9, 82.8, 111.9, 96.7, N) + L(85.5, 89.8, 186.3, 89.8, N);
    // 본문 큰 표
    s += L(20.8, 71.8, 189.1, 71.8, K) + L(20.8, 184.5, 189.1, 184.5, K) + L(20.8, 265.4, 189.1, 265.4, K) + L(21.0, 71.8, 21.0, 265.4, K) + L(188.9, 71.8, 188.9, 265.4, K);
    // 밑줄 빈칸
    s += L(153.2, 110.8, 180.4, 110.8, 0.17) + L(59.2, 131.0, 64.5, 131.0) + L(73.2, 131.0, 78.5, 131.0) + L(59.2, 138.4, 64.5, 138.4) +
      L(73.2, 138.4, 78.5, 138.4) + L(91.6, 138.4, 98.8, 138.4) + L(100.1, 159.4, 105.4, 159.4) + L(114.1, 159.4, 119.4, 159.4);
    // 꼬리말 선
    s += L(20.0, 278.1, 65.2, 278.1);
    s += T('※ 진단서 및 소견서 미 첨부 할 경우: 담임의견서, 학부모의견서 명확하게 기재 (의사의 진단서 및 소견서를 꼭 첨부하시기 바랍니다.)', 19.97, 281.29, 8.03, 0, { fam: 'g', len: 161.2 });
    for (var i = 0; i < W.length; i++) { var w = W[i]; s += T(w[0], w[1], w[2], w[3], w[4], { fam: w[5] }); }
    return s;
  }
  var FRAME = null;

  /**
   * r: 신고 데이터, o: { cfg, editable, teacherSig, cur }
   */
  function render(r, o) {
    r = r || {}; o = o || {};
    var cfg = o.cfg || {}, Y = cfg.year || new Date().getFullYear();
    if (!FRAME) FRAME = frame();
    var s = FRAME;
    // 설정값(학년/반/학교/담임)
    // 학년·반: 숫자는 학생이 입력, '학년'·'반' 글자는 원본 위치 그대로
    s += T('학년', 146.6, 104.06, 11.04, 1) + T('반', 166.0, 104.06, 11.04, 1);
    s += T(r.grade, 141.6, 104.06, 11.04, 1, { anchor: 'middle' }) + T(r.cls, 160.1, 104.06, 11.04, 1, { anchor: 'middle' });
    s += T((cfg.school || '양지고등학교') + '장 귀하', 22.78, 181.86, 12.96, 1);
    s += T(cfg.teacher || '', 176.07, 263.65, 11.04, 1, { anchor: 'end' });

    // 체크
    STATUS.forEach(function (it, i) { if (r.status === it[0]) s += CHECK(BOX[i][0], BOX[i][1]); });
    var det = r.detail || [];
    DETAIL.forEach(function (it, i) { if (det.indexOf(it[0]) >= 0) s += CHECK(BOX[4 + i][0], BOX[4 + i][1]); });

    s += T(r.num, 173.76, 104.06, 11.04, 1, { anchor: 'middle' });
    s += T(r.name, 166.8, 110.28, 11.04, 1, { anchor: 'middle' });

    var a = ymd(r.start), b = ymd(r.end), w = ymd(r.wdate);
    s += T((a ? a.y : Y) + '년', 46.19, 130.56, 9.96) + T(a && a.m, 61.85, 130.56, 9.96, 0, { anchor: 'middle' }) + T(a && a.d, 75.85, 130.56, 9.96, 0, { anchor: 'middle' });
    s += T((b ? b.y : Y) + '년', 46.23, 137.96, 9.96) + T(b && b.m, 61.85, 137.96, 9.96, 0, { anchor: 'middle' }) + T(b && b.d, 75.85, 137.96, 9.96, 0, { anchor: 'middle' });
    s += T(r.days, 95.2, 137.96, 9.96, 0, { anchor: 'middle' });

    // 사유: 첫 줄은 원래 밑줄 위, 길면 다음 줄로 이어 씀
    var rs = r.reason ? wrap(r.reason, [119, 154], 9.96) : [];
    if (rs[0]) {
      var w1 = measure(rs[0], 9.96);
      s += T(rs[0], 66.3, 145.37, 9.96);
      if (w1 + 1.6 > 67.1) s += L(132.6, 145.8, Math.min(186.5, 66.3 + w1 + 0.8), 145.8);
    }
    s += L(65.5, 145.8, 132.6, 145.8);
    if (rs[1]) {
      var w2 = measure(rs[1], 9.96), fit = w2 > 154 ? 154 : 0;
      s += T(rs[1], 31.16, 152.0, 9.96, 0, { len: fit || '' }) + L(30.6, 152.43, 31.16 + (fit || w2) + 0.6, 152.43);
    }

    s += T((w ? w.y : Y) + '년', 85.34, 158.96, 9.96, 1) + T(w && w.m, 102.75, 158.96, 9.96, 1, { anchor: 'middle' }) + T(w && w.d, 116.75, 158.96, 9.96, 1, { anchor: 'middle' });

    s += T(r.name, 161.2, 164.63, 9.96, 0, { anchor: 'middle' }) + IMG(r.sigS, 175.2, 163.1, 19, 9);
    s += T(r.pname, 161.2, 170.26, 9.96, 0, { anchor: 'middle' }) + IMG(r.sigP, 175.1, 168.8, 19, 9);

    // 확인서 (담임 작성)
    var c = r.confirm || {}, rows = c.rows || {};
    CROWS.forEach(function (cr) {
      var v = rows[cr[0]] || {}, bl = cr[1];
      s += T(v.m, 55.4, bl, 9.96, 0, { anchor: 'middle' }) + T(v.d, 68.5, bl, 9.96, 0, { anchor: 'middle' }) +
        T(v.h, 82.5, bl, 9.96, 0, { anchor: 'middle' }) + T(v.who, 130.7, bl, 9.96, 0, { anchor: 'middle' });
    });
    s += T(c.attach, 41.2, 242.19, 9.96);
    var cd = ymd(c.date);
    s += T((cd ? cd.y : Y) + '년', 87.12, 252.05, 9.96) + T(cd && cd.m, 102.7, 252.05, 9.96, 0, { anchor: 'middle' }) + T(cd && cd.d, 115.0, 252.05, 9.96, 0, { anchor: 'middle' });
    if (c.date && o.teacherSig) s += IMG(o.teacherSig, 179.2, 262.2, 18, 9);

    var html = '<div class="ab-paper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297" style="font-family:' + esc(FONT_B) + '">' + s + '</svg>';
    if (o.editable) html += hotspots(r, o);
    return html + '</div>';
  }

  function hotspots(r, o) {
    var req = o.required || function () { return true; };
    function empty(k) { var v = r[k]; return Array.isArray(v) ? !v.length : (v === '' || v == null); }
    function hs(k, x, b, w, opt) {
      opt = opt || {};
      var top = opt.top != null ? opt.top : b - 4.7, h = opt.h || 6.2;
      var cls = 'ab-hs' + (empty(k) && req(k) ? ' ab-empty' : '') + (o.cur === k ? ' ab-cur' : '');
      return '<button type="button" class="' + cls + '" data-k="' + k + '"' + (opt.v ? ' data-v="' + opt.v + '"' : '') +
        ' aria-label="' + (opt.label || k) + '" style="left:' + x + 'mm;top:' + top + 'mm;width:' + w + 'mm;height:' + h + 'mm"></button>';
    }
    var h = '';
    STATUS.forEach(function (it) { h += hs('status', it[1] - 0.6, 87.88, it[2] - it[1] + 1.2, { v: it[0], label: it[0] }); });
    DETAIL.forEach(function (it) { h += hs('detail', it[1] - 0.6, 94.83, it[2] - it[1] + 1.2, { v: it[0], label: it[0] }); });
    h += hs('grade', 137.6, 104.06, 8.6, { label: '학년' });
    h += hs('cls', 155.0, 104.06, 10.6, { label: '반' });
    h += hs('num', 170.2, 104.06, 7.2, { label: '번호' });
    h += hs('name', 152.6, 110.28, 28.4, { label: '성명' });
    h += hs('start', 45.6, 130.56, 45.6, { label: '시작일' });
    h += hs('end', 45.6, 137.96, 35.0, { label: '종료일' });
    h += hs('days', 91.2, 137.96, 8.0, { label: '일수' });
    h += hs('reason', 65.0, 145.37, 122, { top: 140.6, h: r.reason && measure(r.reason, 9.96) > 119 ? 13.2 : 6.2, label: '사유' });
    h += hs('wdate', 84.8, 158.96, 40.6, { label: '작성일' });
    h += hs('sigS', 151.2, 164.63, 30.4, { label: '학생 서명' });
    h += hs('pname', 151.2, 170.26, 20.0, { label: '보호자 성명' });
    h += hs('sigP', 171.3, 170.26, 10.4, { label: '보호자 서명' });
    return h;
  }

  /* ---------- 서명 패드 ---------- */
  function signPad(opt) {
    opt = opt || {};
    var ov = document.createElement('div');
    ov.className = 'ab-pad-ov';
    ov.innerHTML = '<div class="ab-pad-box" role="dialog" aria-modal="true">' +
      '<div class="ab-pad-head"><b>' + esc(opt.title || '서명') + '</b><span>' + esc(opt.sub || '아래 칸에 손가락이나 마우스로 정자로 서명해 주세요.') + '</span></div>' +
      '<div class="ab-pad-area"><div class="ab-pad-guide">서 명</div><div class="ab-pad-line"></div><div class="ab-pad-x">✕</div><canvas></canvas></div>' +
      '<div class="ab-pad-btns"><button type="button" class="clr">다시 쓰기</button><button type="button" class="cc">취소</button><button type="button" class="ok">서명 완료</button></div></div>';
    document.body.appendChild(ov);
    var area = ov.querySelector('.ab-pad-area'), cv = ov.querySelector('canvas'), g = cv.getContext('2d');
    var dpr = Math.max(1, window.devicePixelRatio || 1), box = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 }, drawn = false;
    function size() {
      var rc = area.getBoundingClientRect();
      cv.width = Math.round(rc.width * dpr); cv.height = Math.round(rc.height * dpr);
      g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#0b1220';
    }
    size();
    var pts = [], down = false;
    function pos(e) { var rc = cv.getBoundingClientRect(); return { x: (e.clientX - rc.left) * dpr, y: (e.clientY - rc.top) * dpr, p: e.pressure || 0.5 }; }
    function grow(p) { box.x0 = Math.min(box.x0, p.x); box.y0 = Math.min(box.y0, p.y); box.x1 = Math.max(box.x1, p.x); box.y1 = Math.max(box.y1, p.y); }
    cv.addEventListener('pointerdown', function (e) {
      e.preventDefault(); cv.setPointerCapture(e.pointerId); down = true; pts = [pos(e)]; grow(pts[0]);
      g.beginPath(); g.fillStyle = '#0b1220'; g.arc(pts[0].x, pts[0].y, 1.4 * dpr, 0, Math.PI * 2); g.fill();
    });
    cv.addEventListener('pointermove', function (e) {
      if (!down) return; e.preventDefault();
      var p = pos(e); pts.push(p); grow(p); drawn = true;
      var n = pts.length; if (n < 3) return;
      var p0 = pts[n - 3], p1 = pts[n - 2], p2 = pts[n - 1];
      var v = Math.hypot(p2.x - p1.x, p2.y - p1.y) / dpr;
      g.lineWidth = Math.max(1.6, Math.min(3.6, 4.2 - v * 0.12)) * dpr;
      g.beginPath(); g.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2); g.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2); g.stroke();
    });
    function up() { down = false; }
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    function close() { ov.remove(); window.removeEventListener('resize', size); }
    window.addEventListener('resize', size);
    ov.querySelector('.clr').onclick = function () { g.clearRect(0, 0, cv.width, cv.height); drawn = false; box = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 }; };
    ov.querySelector('.cc').onclick = function () { close(); opt.onCancel && opt.onCancel(); };
    ov.querySelector('.ok').onclick = function () {
      if (!drawn || (box.x1 - box.x0) < 24 * dpr) { alert('서명을 해 주세요.'); return; }
      var pad = 6 * dpr, x0 = Math.max(0, box.x0 - pad), y0 = Math.max(0, box.y0 - pad);
      var w = Math.min(cv.width, box.x1 + pad) - x0, h = Math.min(cv.height, box.y1 + pad) - y0;
      var out = exportPng(cv, x0, y0, w, h, 420, 160);
      if (out.length > 45000) out = exportPng(cv, x0, y0, w, h, 260, 100);
      close(); opt.onDone && opt.onDone(out);
    };
  }
  function exportPng(cv, x0, y0, w, h, maxW, maxH) {
    var k = Math.min(1, maxW / w, maxH / h), o = document.createElement('canvas');
    o.width = Math.max(1, Math.round(w * k)); o.height = Math.max(1, Math.round(h * k));
    o.getContext('2d').drawImage(cv, x0, y0, w, h, 0, 0, o.width, o.height);
    return o.toDataURL('image/png');
  }

  /* 화면 폭에 맞춰 A4 용지 축소 */
  function fit(host, maxScale) {
    if (!host._abRO && window.ResizeObserver) {   // 레이아웃이 늦게 잡혀도 다시 맞춤
      host._abRO = new ResizeObserver(function () { fit(host, maxScale); });
      host._abRO.observe(host);
    }
    var paper = host.querySelector('.ab-paper'); if (!paper) return 1;
    var pw = paper.offsetWidth, ph = paper.offsetHeight;
    if (!host.clientWidth || !pw) { requestAnimationFrame(function () { fit(host, maxScale); }); return 1; }
    var s = Math.min(maxScale || 1, host.clientWidth / pw);
    paper.style.transformOrigin = '0 0'; paper.style.transform = 'scale(' + s + ')';
    host.style.height = (ph * s) + 'px';
    return s;
  }

  return { render: render, signPad: signPad, fit: fit, esc: esc, ymd: ymd, STATUS: STATUS, DETAIL: DETAIL };
})();
