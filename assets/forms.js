/* 출석의견서(11번) · 교외체험학습 신청서/통보서/결과보고서/별지(12번) 렌더러
   배경은 원본 HWP → PDF 페이지를 그대로 쓴 그림(연도 '2024'와 예시 학년·반은 지움), 그 위에 입력값을 mm 좌표로 얹는다. */
var FORMS = (function () {
  var PT = 0.35278, esc = AB.esc, ymd = AB.ymd;
  var FONT = "'HCR Batang','함초롬바탕','Noto Serif KR','Batang',serif";

  function T(t, x, b, size, o) {
    o = o || {};
    if (t === '' || t == null) return '';
    var len = o.fit && AB.measure(String(t), size) > o.fit ? o.fit : 0;
    return '<text x="' + x + '" y="' + b + '" font-size="' + (size * PT).toFixed(3) + '"' + (o.bold ? ' font-weight="700"' : '') +
      (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') + (len ? ' textLength="' + len + '" lengthAdjust="spacingAndGlyphs"' : '') +
      ' xml:space="preserve">' + esc(t) + '</text>';
  }
  var C = function (t, x, b, size, o) { return T(t, x, b, size, Object.assign({ anchor: 'middle' }, o)); };
  function CHECK(cx, b, s) {
    s = s || 1; var cy = b - 1.45 * s;
    return '<path d="M' + (cx - 1.7 * s) + ' ' + (cy - 0.1 * s) + ' L' + (cx - 0.45 * s) + ' ' + (cy + 1.45 * s) + ' L' + (cx + 2.1 * s) + ' ' + (cy - 2.6 * s) +
      '" fill="none" stroke="#000" stroke-width="' + (0.5 * s) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function RING(cx, cy, r) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r || 1.8) + '" fill="none" stroke="#000" stroke-width="0.32"/>'; }
  function SIG(src, cx, cy, w, h) {
    if (!src) return '';
    return '<image href="' + src + '" x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" preserveAspectRatio="xMidYMid meet"/>';
  }
  // 연·월·일: 연도는 원래 '2024'가 있던 자리 끝에 맞춰 네 자리로 씀
  function DATE(d, b, size, yEnd, mx, dx, o) {
    var v = ymd(d); if (!v) return '';
    return T(String(v.y), yEnd, b, size, Object.assign({ anchor: 'end' }, o)) + C(v.m, mx, b, size, o) + C(v.d, dx, b, size, o);
  }
  function LINES(text, x, bases, width, size, o) {
    if (!text) return '';
    var lines = AB.wrap(text, bases.map(function () { return width; }), size), s = '';
    lines.forEach(function (l, i) { if (bases[i] != null) s += T(l, x, bases[i], size, { fit: width }); });
    return s;
  }
  // 긴 글을 여러 칸(줄)에 나눠 담기: 각 칸 폭이 같다고 보고 줄 단위로 자름
  function splitLines(text, width, size) {
    var out = [];
    String(text || '').split(/\n/).forEach(function (para) {
      var rest = para.trim();
      if (!rest) { out.push(''); return; }
      while (rest) {
        if (AB.measure(rest, size) <= width) { out.push(rest); break; }
        var cut = rest.length;
        while (cut > 1 && AB.measure(rest.slice(0, cut), size) > width) cut--;
        var sp = rest.lastIndexOf(' ', cut); if (sp > cut * 0.6) cut = sp;
        out.push(rest.slice(0, cut).trim()); rest = rest.slice(cut).trim();
      }
    });
    return out;
  }

  function paper(bg, svg, hs) {
    return '<div class="ab-paper"><img class="ab-bg" src="' + bg + '" alt="">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297" style="font-family:' + esc(FONT) + '">' + svg + '</svg>' + (hs || '') + '</div>';
  }
  function spotMaker(r, o) {
    var req = o.required || function () { return true; };
    function empty(k) { var v = r[k]; return Array.isArray(v) ? !v.length : (v === '' || v == null); }
    return function (k, x, top, w, h, label, forceEmpty) {
      if (!o.editable) return '';
      var e = forceEmpty != null ? forceEmpty : (empty(k) && req(k));
      return '<button type="button" class="ab-hs' + (e ? ' ab-empty' : '') + (o.cur === k ? ' ab-cur' : '') + '" data-k="' + k + '" aria-label="' + esc(label || k) +
        '" style="left:' + x + 'mm;top:' + top + 'mm;width:' + w + 'mm;height:' + h + 'mm"></button>';
    };
  }
  var BG = function (name) { return (window.FORMS_BASE || 'assets/forms/') + name; };

  /* ---------------- 11. 출석(학급담임□ 학부모□)의견서 ---------------- */
  var OP_STATUS = { '질병': 130.47, '미인정': 150.56, '인정': 166.17, '기타': 181.78 };
  var OP_DETAIL = [['결석', 121.68, 135.0, 132.7], ['지각', 137.3, 150.61, 148.31], ['조퇴', 152.91, 166.23, 163.93], ['결과', 168.52, 181.84, 179.54]];
  // 4번 문장의 괄호: c1 = '학급담임(학부모)'의 (학부모), c2 = '부모님(학급담임)'의 (학급담임)
  var OP_PAREN = { c1: [54.7, 9.2], c2: [135.0, 11.4] };
  // r: { who, status, detail[], grade, cls, num, name, note, reason, c1, c2, date, pname, sig }
  // 학부모 의견서는 출결현황 '인정'이 자동 체크되고, 나머지는 학부모가 직접 씀 (키는 op_ 접두어)
  function opinion(r, o) {
    r = r || {}; o = o || {};
    var s = '', hs = spotMaker(opKeys(r), o);
    s += CHECK(r.who === 'teacher' ? 99.77 : 131.3, 40.4, 1.55);
    if (OP_STATUS[r.status]) s += CHECK(OP_STATUS[r.status], 89.82);
    OP_DETAIL.forEach(function (d) { if ((r.detail || []).indexOf(d[0]) >= 0) s += CHECK(d[3], 96.75); });
    s += C(r.grade, 34.3, 137.58, 13) + C(r.cls, 51.5, 137.58, 13) + C(r.num, 62.97, 137.58, 13);
    s += C(r.name, 106.2, 137.58, 13, { fit: 52 }) + C(r.note, 161.05, 137.58, 11, { fit: 51 });
    s += LINES(r.reason, 28.6, [173, 182, 191, 200], 158, 12);
    ['c1', 'c2'].forEach(function (k) { if (r[k]) s += '<ellipse cx="' + OP_PAREN[k][0] + '" cy="' + (211.16 - 1.6) + '" rx="' + OP_PAREN[k][1] + '" ry="3.5" fill="none" stroke="#000" stroke-width="0.35"/>'; });
    s += DATE(r.date, 253.32, 15, 46.96, 57.55, 73.4);
    s += C(r.pname, 149.1, 253.32, 15, { fit: 32 }) + SIG(r.sig, 170.9, 251.2, 24, 11);
    var h = '';
    OP_DETAIL.forEach(function (d) {
      if (!o.editable) return;
      h += '<button type="button" class="ab-hs' + (!(r.detail || []).length && (o.required || function () { return true; })('op_detail') ? ' ab-empty' : '') +
        '" data-k="op_detail" data-v="' + d[0] + '" aria-label="세부사항 ' + d[0] + '" style="left:' + (d[1] - 0.6) + 'mm;top:' + (96.75 - 4.9) + 'mm;width:' + (d[2] - d[1] + 1.2) + 'mm;height:6.4mm"></button>';
    });
    // 학년-반-번호·성명은 결석 신고서에서 자동으로 옮겨 적고, 비고만 직접 씀
    h += hs('op_note', 134.8, 131.0, 52.5, 9.6, '비고') +
      hs('op_reason', 22.5, 164.5, 165.5, 39.5, '사유(구체적으로)') +
      hs('op_c1', 45.6, 205.6, 18.2, 7.4, '(학부모)에 동그라미') + hs('op_c2', 123.7, 205.6, 22.6, 7.4, '(학급담임)에 동그라미') +
      hs('op_date', 33.4, 246.6, 51, 8.6, '날짜') + hs('op_pname', 132.5, 246.6, 33.5, 8.6, '학부모 성명') + hs('op_sig', 166.2, 246.6, 10.5, 8.6, '학부모 서명');
    return paper(BG('opinion.png'), s, h);
  }
  // 노란 칸 판단용: 화면 값(r.grade 등)을 op_ 키로 바꿔 봄
  function opKeys(r) {
    return { op_detail: r.detail, op_grade: r.grade, op_cls: r.cls, op_num: r.num, op_name: r.name, op_note: r.note, op_reason: r.reason,
      op_c1: r.c1 ? 'o' : '', op_c2: r.c2 ? 'o' : '', op_date: r.date, op_pname: r.pname, op_sig: r.sig };
  }

  /* ---------------- 12. 교외체험학습 신청서 (+ 아래 통보서: 담임 작성) ---------------- */
  var FORM4 = { family: 73.65, relative: 106.45, tour: 143.15, exp: 169.85 };
  var FORM4R = { family: 72.25, relative: 105.1, tour: 141.75, exp: 168.55 };
  function tripApply(r, o) {
    r = r || {}; o = o || {};
    var s = '', hs = spotMaker(r, o), n = r.notice || {};
    s += C(r.name, 63.0, 54.0, 10, { fit: 34 }) + C(r.grade, 87.8, 54.0, 10) + C(r.cls, 104.15, 54.0, 10) + C(r.num, 112.95, 54.0, 10) + C(r.phone, 168.25, 54.0, 10, { fit: 34 });
    var a = ymd(r.start), b = ymd(r.end);
    // 월·일 칸이 좁아(약 5mm) 두 자리 숫자는 조금 작게
    if (a) s += T(String(a.y), 102.6, 61.2, 10, { anchor: 'end' }) + C(a.m, 114.05, 61.2, 9, { fit: 4.6 }) + C(a.d, 122.85, 61.2, 9, { fit: 4.6 });
    if (b) s += C(b.m, 137.65, 61.2, 9, { fit: 4.6 }) + C(b.d, 147.35, 61.2, 9, { fit: 6 });
    s += C(r.days, 159.05, 61.2, 10);
    if (r.rule === 'o') s += RING(168.8, 68.1, 2.4); else if (r.rule === 'x') s += RING(176.1, 68.1, 2.4);
    if (FORM4[r.form]) s += C('○', FORM4[r.form], 77.7, 10);
    s += T(r.dest, 46.5, 84.9, 10, { fit: 65 }) + T(r.lodging, 143, 84.9, 10, { fit: 41.5 });
    s += C(r.gname, 65.5, 92.0, 10, { fit: 39 }) + C(r.grel, 107.9, 92.0, 10, { fit: 18 }) + C(r.gphone, 163.75, 92.0, 10, { fit: 42 });
    s += C(r.lname, 65.5, 98.8, 10, { fit: 39 }) + C(r.lrel, 107.9, 98.8, 10, { fit: 18 }) + C(r.lphone, 163.75, 98.8, 10, { fit: 42 });
    s += LINES(r.purpose, 46.5, [105.2, 110.8], 137.5, 10);
    s += LINES(r.plan, 46.5, [118.6, 124.2, 129.8, 135.4, 141.0, 146.6], 137.5, 10);
    s += DATE(r.wdate, 163.9, 10, 94.47, 102.3, 111.7);
    s += C(r.pname, 167.5, 169.1, 10, { fit: 17 }) + SIG(r.sigP, 179.3, 167.9, 15, 6.5);
    s += C(r.sname, 167.5, 174.0, 10, { fit: 17 }) + SIG(r.sigS, 179.3, 172.8, 15, 6.5);
    // 통보서(담임 작성) — 학생 정보·신청 기간은 신청서에서 그대로 옮김
    s += C(r.name, 67.0, 203.9, 10, { fit: 42 }) + C(r.grade, 141.35, 203.9, 10) + C(r.cls, 154.55, 203.9, 10) + C(r.num, 165.15, 203.9, 10);
    function period(st, en, days, base) {
      var x = ymd(st), y = ymd(en), t = '';
      if (x) t += T(String(x.y), 99.81, base, 10, { anchor: 'end' }) + C(x.m, 106.85, base, 10) + C(x.d, 116.55, base, 10);
      if (y) t += C(y.m, 131.35, base, 10) + C(y.d, 141.05, base, 10);
      return t + C(days, 152.75, base, 10);
    }
    s += period(r.start, r.end, r.days, 210.0) + period(n.pstart, n.pend, n.pdays, 214.9);
    var nd = ymd(n.date);
    if (nd) s += T(String(nd.y), 104.84, 224.9, 10, { anchor: 'end' }) + C(nd.m, 117.1, 224.9, 10) + C(nd.d, 127.6, 224.9, 10);
    s += C(n.tgrade, 104.3, 230.2, 10) + C(n.tcls, 127.6, 230.2, 10) + C(n.used, 31.0, 234.7, 10);
    s += C(o.teacher || '', 167.3, 230.2, 10, { fit: 22 });
    if (n.date && o.teacherSig) s += SIG(o.teacherSig, 182.5, 229.0, 13, 6.5);

    var h = hs('name', 45.2, 48.7, 35.6, 6.7, '성명') + hs('grade', 82, 48.7, 11.8, 6.7, '학년') + hs('cls', 101.6, 48.7, 5.2, 6.7, '반') +
      hs('num', 110.4, 48.7, 5.2, 6.7, '번호') + hs('phone', 150.8, 48.7, 34.9, 6.7, '휴대폰') +
      hs('start', 93.5, 56.4, 36.5, 6.0, '시작일') + hs('end', 131.5, 56.4, 23.5, 6.0, '종료일') + hs('days', 155.5, 56.4, 7.2, 6.0, '일수') +
      hs('rule', 164.3, 64.4, 16.2, 6.5, '세부 규칙 확인') +
      hs('form', 44.6, 72.6, 129.6, 6.5, '학습형태') +
      hs('dest', 45.2, 80.0, 68.3, 5.9, '목적지') + hs('lodging', 141.8, 80.0, 43.9, 5.9, '숙박장소') +
      hs('gname', 45.2, 86.7, 40.6, 6.4, '보호자명') + hs('grel', 98.3, 86.7, 19.2, 6.4, '보호자 관계') + hs('gphone', 141.8, 86.7, 43.9, 6.4, '보호자 휴대폰') +
      hs('lname', 45.2, 93.9, 40.6, 5.7, '인솔자명') + hs('lrel', 98.3, 93.9, 19.2, 5.7, '인솔자 관계') + hs('lphone', 141.8, 93.9, 43.9, 5.7, '인솔자 휴대폰') +
      hs('purpose', 45.2, 100.4, 140.5, 12.1, '목적') + hs('plan', 45.2, 113.3, 140.5, 38.0, '교외체험학습 계획') +
      hs('wdate', 86.5, 159.4, 33, 5.8, '신청일') +
      hs('pname', 158.5, 164.8, 17.8, 5.6, '보호자 성명') + hs('sigP', 176.3, 164.8, 6.8, 5.6, '보호자 서명') +
      hs('sname', 158.5, 169.7, 17.8, 5.6, '학생 성명') + hs('sigS', 176.3, 169.7, 6.8, 5.6, '학생 서명');
    if (o.noticeEdit) {   // 담임: 통보서 칸 (학생 칸은 잠근 채 통보서 칸만 누를 수 있게)
      hs = spotMaker(r, Object.assign({}, o, { editable: true }));
      var ne = function (k) { var v = n[k]; return v === '' || v == null; };
      h += hs('n:pstart', 91, 211.0, 39, 4.6, '허가 시작일', ne('pstart')) + hs('n:pend', 130, 211.0, 15, 4.6, '허가 종료일', ne('pend')) +
        hs('n:pdays', 149.4, 211.0, 7, 4.6, '허가 일수', ne('pdays')) + hs('n:date', 96, 220.6, 38, 5.6, '통보일', ne('date')) +
        hs('n:tgrade', 100, 226.0, 8.6, 5.4, '담임 학년', ne('tgrade')) + hs('n:tcls', 123.3, 226.0, 8.6, 5.4, '담임 반', ne('tcls')) +
        hs('n:used', 27.8, 230.6, 6.5, 5.4, '누적 사용일', ne('used'));
    }
    return paper(BG('trip-apply.png'), s, h);
  }

  /* ---------------- 12. 결과보고서 (+ 넘치면 별지) ---------------- */
  var REPORT_ROWS = [104.1, 110.7, 117.2, 123.7, 130.2, 136.8, 143.3, 149.8, 156.4, 162.9, 169.4, 176.0, 182.5, 189.0, 195.5, 202.0].map(function (y) { return y - 1.1; });
  var SHEET_ROWS = []; for (var yy = 65.1; yy < 262; yy += 7.906) SHEET_ROWS.push(+(yy - 1.4).toFixed(2));
  var BODY_W = 162, SHEET_W = 165, BODY_PT = 10;
  function tripReport(r, o) {
    r = r || {}; o = o || {};
    var hs = spotMaker(r, o), s = '';
    s += C(r.name, 65.8, 59.0, 10, { fit: 42 }) + C(r.grade, 134.5, 59.0, 10) + C(r.cls, 153.45, 59.0, 10) + C(r.num, 168.25, 59.0, 10);
    var a = ymd(r.start), b = ymd(r.end);
    if (a) s += T(String(a.y), 105.66, 66.2, 10, { anchor: 'end' }) + C(a.m, 112.5, 66.2, 10) + C(a.d, 121.2, 66.2, 10);
    if (b) s += C(b.m, 136.8, 66.2, 10) + C(b.d, 147.45, 66.2, 10);
    s += C(r.days, 163.45, 66.2, 10) + T(r.place, 90.5, 73.1, 10, { fit: 95 });
    if (FORM4R[r.form]) s += C('○', FORM4R[r.form], 80.8, 10);
    s += T(r.title, 45.5, 89.3, 10, { fit: 140 });
    var lines = splitLines(r.body, BODY_W, BODY_PT);
    lines.slice(0, REPORT_ROWS.length).forEach(function (l, i) { s += T(l, 24, REPORT_ROWS[i], BODY_PT); });
    s += DATE(r.wdate, 226.4, 10, 97.62, 103.5, 114.2);
    s += C(r.pname, 169.5, 232.4, 10, { fit: 17 }) + SIG(r.sigP, 181.3, 231.2, 15, 6.5);
    s += C(r.sname, 169.5, 237.3, 10, { fit: 17 }) + SIG(r.sigS, 181.3, 236.1, 15, 6.5);
    var h = hs('name', 43.9, 53.7, 43.8, 6.6, '성명') + hs('grade', 130, 53.7, 8.6, 6.6, '학년') + hs('cls', 148.4, 53.7, 10.6, 6.6, '반') +
      hs('num', 164, 53.7, 8.6, 6.6, '번호') + hs('start', 95.5, 61.1, 38, 6.0, '시작일') + hs('end', 134.5, 61.1, 22, 6.0, '종료일') +
      hs('days', 158.8, 61.1, 9.4, 6.0, '일수') + hs('place', 88.5, 68.0, 99, 6.1, '장소') + hs('form', 43.5, 75.7, 130, 6.8, '학습형태') +
      hs('title', 43.9, 83.5, 143.6, 7.1, '제목') + hs('body', 22.4, 97.9, 165.2, 105, '느낀 점·배운 점') +
      hs('wdate', 88, 222.4, 34, 5.4, '제출일') +
      hs('pname', 160.5, 228.2, 18, 5.4, '보호자 성명') + hs('sigP', 178.4, 228.2, 6.5, 5.4, '보호자 서명') +
      hs('sname', 160.5, 233.1, 18, 5.4, '학생 성명') + hs('sigS', 178.4, 233.1, 6.5, 5.4, '학생 서명');
    // 결과보고서 다음 장은 항상 별지: 안내 문구 + 사진(2장 이상) + 결과보고서 칸을 넘친 느낀 점을 이어서 씀
    var rest = lines.slice(REPORT_ROWS.length).join('\n');
    return [paper(BG('trip-report.png'), s, h)].concat(tripPhoto(r, Object.assign({}, o, { restBody: rest, fromReport: true })));
  }
  /* ---------------- 12. 별지(사진 첨부) ---------------- */
  var PHOTO_NOTE = '※ 교외체험학습을 다녀 온 후 부모님과 함께 찍은 사진 2장 이상을 첨부하여 작성할 것.';
  var PHOTO_SLOTS = [[24, 68.5, 80, 58], [106.4, 68.5, 80, 58], [24, 130.5, 80, 58], [106.4, 130.5, 80, 58]];
  function sheetHead(r) {
    return C(r.name, 64.25, 54.1, 10, { fit: 42 }) + C(r.grade, 138.85, 54.1, 10) + C(r.cls, 155.3, 54.1, 10) + C(r.num, 168.85, 54.1, 10);
  }
  function tripPhoto(r, o) {
    r = r || {}; o = o || {};
    var hs = spotMaker(r, o), photos = r.photos || [], n = photos.length > 2 ? 4 : 2, s = sheetHead(r);
    s += T(PHOTO_NOTE, 22.8, 63.2, 10.5, { bold: 1, fit: 166 });
    PHOTO_SLOTS.slice(0, n).forEach(function (b, i) {
      s += '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" fill="#fff" stroke="#9ca3af" stroke-width="0.25"' + (photos[i] ? '' : ' stroke-dasharray="1.2 1"') + '/>';
      if (photos[i]) s += '<image href="' + photos[i] + '" x="' + (b[0] + 0.6) + '" y="' + (b[1] + 0.6) + '" width="' + (b[2] - 1.2) + '" height="' + (b[3] - 1.2) + '" preserveAspectRatio="xMidYMid meet"/>';
      else s += '<text x="' + (b[0] + b[2] / 2) + '" y="' + (b[1] + b[3] / 2 + 1.5) + '" font-size="4" fill="#9ca3af" text-anchor="middle">사진 ' + (i + 1) + '</text>';
    });
    var photoBottom = PHOTO_SLOTS[n - 1][1] + PHOTO_SLOTS[n - 1][3];
    var rows = SHEET_ROWS.filter(function (b) { return b - 5 > photoBottom; });
    var lines = splitLines(o.fromReport ? o.restBody : r.body, SHEET_W, BODY_PT);
    lines.slice(0, rows.length).forEach(function (l, i) { s += T(l, 22.5, rows[i], BODY_PT); });
    var h = hs('name', 42.3, 47.1, 43.9, 9.6, '성명') + hs('grade', 135.2, 47.1, 7.3, 9.6, '학년') + hs('cls', 150.7, 47.1, 9.2, 9.6, '반') +
      hs('num', 164.2, 47.1, 9.3, 9.6, '번호') +
      hs('photos', 23.5, 68, 163.4, photoBottom - 67.5, '사진 첨부', o.editable && photos.length < 2) +
      hs('body', 20.8, photoBottom + 1.5, 169.4, 262.5 - photoBottom - 1.5, o.fromReport ? '느낀 점·배운 점 (이어서)' : '사진 설명 · 느낀 점', o.fromReport ? false : null);
    var pages = [paper(BG('trip-sheet.png'), s, h)];
    var rest = lines.slice(rows.length);
    for (var p = 0; p * SHEET_ROWS.length < rest.length; p++) {
      var t = sheetHead(r);
      rest.slice(p * SHEET_ROWS.length, (p + 1) * SHEET_ROWS.length).forEach(function (l, i) { t += T(l, 22.5, SHEET_ROWS[i], BODY_PT); });
      pages.push(paper(BG('trip-sheet.png'), t, hs('body', 20.8, 57.4, 169.4, 205, '사진 설명 · 느낀 점 (이어서)', false)));
    }
    return pages;
  }

  // 본문이 몇 장(결과보고서+별지)에 걸치는지
  function reportPages(body, nPhotos) {
    var lines = splitLines(body, BODY_W, BODY_PT), rest = lines.slice(REPORT_ROWS.length);
    var more = splitLines(rest.join('\n'), SHEET_W, BODY_PT), n = nPhotos > 2 ? 4 : 2;
    var bottom = PHOTO_SLOTS[n - 1][1] + PHOTO_SLOTS[n - 1][3];
    var first = SHEET_ROWS.filter(function (y) { return y - 5 > bottom; }).length;
    return 2 + Math.max(0, Math.ceil((more.length - first) / SHEET_ROWS.length));
  }


  return { opinion: opinion, tripApply: tripApply, tripReport: tripReport, tripPhoto: tripPhoto, reportPages: reportPages, PHOTO_NOTE: PHOTO_NOTE };
})();
