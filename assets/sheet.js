/* 결석 신고서 양식(A4) 렌더러 + 서명패드 — 좌표(mm)는 2026년 수정 양식 스캔본에서 측정 */
var AB = (function () {
  // 고정 글자: [글자, x, 기준선 y, 크기(pt), 굵게, 글꼴(b=바탕, g=굴림), 정렬(m=가운데)]
  var W = [
    ['결', 40.6, 50.4, 20, 1], ['석', 49.2, 50.4, 20, 1], ['신', 62.3, 50.4, 20, 1], ['고', 71.0, 50.4, 20, 1], ['서', 79.3, 50.4, 20, 1],
    ['결재', 108.8, 48.6, 14, 1, 'b', 'm'],
    ['계', 126.9, 41.0, 10, 1, 'b', 'm'], ['학년부장', 144.35, 41.0, 10, 1, 'b', 'm'], ['교감', 162.0, 41.0, 10, 1, 'b', 'm'], ['교장', 179.8, 41.0, 10, 1, 'b', 'm'],
    ['전결', 162.0, 50.6, 10, 0, 'b', 'm'],
    ['결재정보', 108.55, 65.4, 10, 1, 'b', 'm'], ['질병•인정', 126.55, 62.7, 8, 0, 'b', 'm'], ['기타', 126.55, 68.2, 8, 0, 'b', 'm'],
    ['계(학년출결담당)-학년부장-교감(전결)', 162.1, 62.7, 8, 0, 'b', 'm'], ['계(학년출결담당)-학년부장-교감-교장', 162.1, 68.2, 8, 0, 'b', 'm'],
    ['출', 80.9, 78.6, 14, 1], ['결', 91.1, 78.6, 14, 1], ['신', 101.4, 78.6, 14, 1], ['고', 109.1, 78.6, 14, 1], ['내', 117.3, 78.6, 14, 1], ['용', 124.6, 78.6, 14, 1],
    ['※', 35.2, 91.2, 9, 0], ['해당사항에', 38.8, 91.2, 9, 0], ['체크(√)하세요.', 56.0, 91.2, 9, 0],
    ['출결현황', 98.65, 88.4, 10, 0, 'b', 'm'], ['세부사항', 98.65, 95.4, 10, 0, 'b', 'm'],
    ['질병□', 121.5, 88.6, 12, 1], ['인정□', 142.6, 88.6, 12, 1], ['기타□', 164.1, 88.6, 12, 1],
    ['결석□', 121.5, 95.6, 12, 1], ['지각□', 135.6, 95.6, 12, 1], ['조퇴□', 149.9, 95.6, 12, 1], ['결과□', 164.3, 95.6, 12, 1],
    ['제', 138.5, 104.7, 11, 1], ['학년', 150.0, 104.7, 11, 1], ['반', 165.3, 104.7, 11, 1], ['번', 177.0, 104.7, 11, 1],
    ['성', 138.5, 110.6, 11, 1], ['명', 144.2, 110.6, 11, 1], [':', 150.0, 110.6, 11, 1],
    ['본인은', 25.2, 121.8, 10, 0], ['다음과', 38.4, 121.8, 10, 0], ['같이', 51.6, 121.8, 10, 0], ['출석', 61.1, 121.8, 10, 0], ['사유가', 70.7, 121.8, 10, 0],
    ['발생하여', 83.8, 121.8, 10, 0], ['보호자', 100.5, 121.8, 10, 0], ['연서로', 113.8, 121.8, 10, 0], ['신고합니다.', 126.8, 121.8, 10, 0],
    ['1.', 27.3, 130.1, 10, 0], ['기', 32.2, 130.1, 10, 0], ['간', 37.9, 130.1, 10, 0], [':', 45.7, 130.1, 10, 0], ['202', 48.6, 130.1, 10, 0], ['년', 59.1, 130.1, 10, 0],
    ['월', 72.3, 130.1, 10, 0], ['일', 87.6, 130.1, 10, 0], ['교시부터', 100.8, 130.1, 10, 0],
    ['202', 48.8, 137.6, 10, 0], ['년', 59.5, 137.6, 10, 0], ['월', 72.7, 137.6, 10, 0], ['일', 87.8, 137.6, 10, 0], ['교시까지(', 101.0, 137.6, 10, 0],
    ['일간', 127.0, 137.6, 10, 0], ['교시)', 145.8, 137.6, 10, 0],
    ['2.', 27.1, 145.8, 10, 0], ['사', 32.2, 145.8, 10, 0], ['유(구체적으로)', 37.7, 145.8, 10, 0], [':', 67.1, 145.8, 10, 0],
    ['202', 83.0, 158.6, 10, 1], ['년', 93.2, 158.6, 10, 1], ['월', 108.2, 158.6, 10, 1], ['일', 123.6, 158.6, 10, 1],
    ['학', 136.6, 164.2, 10, 0], ['생', 144.2, 164.2, 10, 0], [':', 150.0, 164.2, 10, 0], ['(인)', 174.3, 164.2, 10, 0],
    ['학부모', 136.6, 170.5, 10, 0], [':', 149.9, 170.5, 10, 0], ['(인)', 174.3, 170.5, 10, 0],
    ['확', 92.2, 193.7, 14, 1], ['인', 102.5, 193.7, 14, 1], ['서', 112.8, 193.7, 14, 1],
    ['위', 23.2, 200.9, 10, 0], ['신고', 29.0, 200.9, 10, 0], ['내용이', 38.5, 200.9, 10, 0], ['사실과', 51.6, 200.9, 10, 0], ['틀림없음을', 64.9, 200.9, 10, 0], ['확인합니다.', 85.4, 200.9, 10, 0],
    ['1.', 23.5, 211.7, 10, 0], ['확인', 27.2, 211.7, 10, 0], ['방법', 36.7, 211.7, 10, 0],
    ['(해당하는', 46.0, 211.6, 7.5, 0], ['항목에', 58.9, 211.6, 7.5, 0], ['○', 68.2, 211.6, 7.5, 0], ['표시,', 72.1, 211.6, 7.5, 0], ['기타는', 79.5, 211.6, 7.5, 0],
    ['구체적으로', 88.6, 211.6, 7.5, 0], ['기재)', 103.1, 211.6, 7.5, 0],
    ['가정방문', 27.3, 217.6, 10, 0], ['(', 44.2, 217.6, 10, 0], ['),', 53.0, 217.6, 10, 0], ['전화연락', 57.1, 217.6, 10, 0], ['(', 74.2, 217.6, 10, 0], ['),', 83.0, 217.6, 10, 0],
    ['학부모', 87.0, 217.6, 10, 0], ['내방', 100.3, 217.6, 10, 0], ['(', 109.6, 217.6, 10, 0], ['),', 118.5, 217.6, 10, 0],
    ['문자', 122.6, 217.6, 10, 0], ['및', 132.1, 217.6, 10, 0], ['SNS', 137.5, 217.6, 10, 0], ['(', 146.9, 217.6, 10, 0], [')', 155.9, 217.6, 10, 0],
    ['기', 27.3, 223.8, 10, 0], ['타', 31.2, 223.8, 10, 0], ['(', 36.5, 223.8, 10, 0], [')', 80.3, 223.8, 10, 0],
    ['2.', 23.3, 234.4, 10, 0], ['증빙', 28.4, 234.4, 10, 0], ['서류', 37.8, 234.4, 10, 0],
    ['(해당하는', 47.3, 234.3, 7.5, 0], ['항목에', 60.0, 234.3, 7.5, 0], ['○', 69.5, 234.3, 7.5, 0], ['표시,', 73.3, 234.3, 7.5, 0], ['기타는', 80.6, 234.3, 7.5, 0],
    ['구체적으로', 89.7, 234.3, 7.5, 0], ['기재,', 104.3, 234.3, 7.5, 0], ['결석', 111.6, 234.3, 7.5, 0], ['신고서', 118.3, 234.3, 7.5, 0], ['뒤에', 127.5, 234.3, 7.5, 0],
    ['첨부', 134.1, 234.3, 7.5, 0], ['요망)', 140.5, 234.3, 7.5, 0],
    ['의사진단서', 27.2, 240.6, 10, 0], ['(', 47.9, 240.6, 10, 0], ['),', 58.7, 240.6, 10, 0], ['의사소견서', 62.9, 240.6, 10, 0], ['(', 83.5, 240.6, 10, 0], ['),', 94.1, 240.6, 10, 0],
    ['진료확인서', 98.2, 240.6, 10, 0], ['(', 119.0, 240.6, 10, 0], ['),', 129.8, 240.6, 10, 0], ['입원확인서', 133.9, 240.6, 10, 0], ['(', 154.4, 240.6, 10, 0], [')', 165.3, 240.6, 10, 0],
    ['기', 27.3, 245.1, 10, 0], ['타', 31.1, 245.1, 10, 0], ['(', 36.6, 245.1, 10, 0], [')', 80.2, 245.1, 10, 0],
    ['202', 84.8, 254.7, 10, 0], ['년', 95.0, 254.7, 10, 0], ['월', 108.1, 254.7, 10, 0], ['일', 121.7, 254.7, 10, 0],
    ['학급담임', 134.6, 264.4, 11, 1], [':', 153.1, 264.4, 11, 1], ['(인)', 180.8, 264.4, 9, 1]
  ];
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
  function CIRCLE(cx, b) { // ( ) 안의 ○ 표시
    return '<circle cx="' + cx + '" cy="' + (b - 1.25) + '" r="1.75" fill="none" stroke="#000" stroke-width="0.32"/>';
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
  function fitLen(t, size, max) { var w = measure(t, size); return w > max ? max : 0; }

  // [값, 글자 시작 x, 글자 끝 x, □ 가운데 x]
  var STATUS = [['질병', 121.5, 133.4, 131.77], ['인정', 142.6, 154.7, 152.87], ['기타', 164.1, 176.1, 174.37]];
  var DETAIL = [['결석', 121.5, 133.1, 131.77], ['지각', 135.6, 147.3, 145.87], ['조퇴', 149.9, 161.6, 160.17], ['결과', 164.3, 176.1, 174.57]];
  // 확인 방법(하나 선택) / 증빙 서류(여러 개 선택): [코드, 이름, ( ) 가운데 x, 클릭 영역 시작 x, 끝 x]
  var METHODS = [['home', '가정방문', 48.9, 26.8, 53.8], ['phone', '전화연락', 79.0, 56.6, 83.8], ['visit', '학부모 내방', 114.4, 86.5, 119.3], ['sns', '문자 및 SNS', 151.8, 122.1, 156.7], ['etc', '기타', 0, 26.8, 81.2]];
  var DOCS = [['diag', '의사진단서', 53.65, 26.7, 59.5], ['opinion', '의사소견서', 89.2, 62.4, 94.9], ['clinic', '진료확인서', 124.8, 97.7, 130.6], ['admit', '입원확인서', 160.25, 133.4, 166.1], ['etc', '기타', 0, 26.8, 81.1]];
  var MB = 217.6, MEB = 223.8, DB = 240.6, DEB = 245.1;

  function frame() {
    var s = '', K = 0.38, N = 0.12;
    // 회색 칸
    s += R(28.2, 36.97, 97.4, 56.45, '#ccc') + R(99.43, 36.97, 118.2, 56.45, '#ccc') + R(118.2, 36.97, 188.77, 42.42, '#ccc') +
      R(99.5, 58.68, 117.6, 69.48, '#ccc') + R(85.6, 82.9, 111.7, 96.89, '#ccc');
    // 결재란
    s += L(99.25, 36.97, 188.95, 36.97, K) + L(99.25, 56.45, 188.95, 56.45, K) + L(99.43, 36.97, 99.43, 56.45, K) + L(188.77, 36.97, 188.77, 56.45, K) +
      L(118.2, 36.97, 118.2, 56.45, N) + L(135.57, 36.97, 135.57, 56.45, N) + L(153.13, 36.97, 153.13, 56.45, N) + L(170.9, 36.97, 170.9, 56.45, N) + L(118.2, 42.42, 188.77, 42.42, N);
    // 결재정보
    s += L(99.3, 58.68, 188.9, 58.68, K) + L(99.3, 69.48, 188.9, 69.48, K) + L(99.5, 58.68, 99.5, 69.48, K) + L(188.7, 58.68, 188.7, 69.48, K) +
      L(117.6, 58.68, 117.6, 69.48, N) + L(135.5, 58.68, 135.5, 69.48, N) + L(117.6, 64.36, 188.7, 64.36, N);
    // 출결현황·세부사항 표
    s += L(85.4, 82.9, 186.15, 82.9, K) + L(85.4, 96.89, 186.15, 96.89, K) + L(85.6, 82.9, 85.6, 96.89, K) + L(185.97, 82.9, 185.97, 96.89, K) +
      L(111.7, 82.9, 111.7, 96.89, N) + L(85.6, 89.87, 185.97, 89.87, N);
    // 본문 큰 표
    s += L(20.8, 71.9, 189.1, 71.9, K) + L(20.8, 185.3, 189.1, 185.3, K) + L(20.8, 268.3, 189.1, 268.3, K) + L(21.0, 71.9, 21.0, 268.3, K) + L(188.9, 71.9, 188.9, 268.3, K);
    // 밑줄 빈칸
    s += L(152.8, 111.13, 180.7, 111.13, 0.17) +
      L(64.4, 130.6, 70.4, 130.6) + L(79.7, 130.6, 85.5, 130.6) + L(93.0, 130.6, 98.8, 130.6) +
      L(64.6, 138.1, 70.6, 138.1) + L(80.0, 138.1, 85.8, 138.1) + L(93.2, 138.1, 99.0, 138.1) + L(119.1, 138.1, 126.7, 138.1) + L(136.0, 138.1, 143.7, 138.1) +
      L(100.4, 159.2, 106.3, 159.2) + L(115.7, 159.2, 121.6, 159.2);
    // 꼬리말
    s += L(20.4, 281.3, 65.5, 281.3);
    s += T('※ 진단서 및 소견서 미 첨부 할 경우: 담임의견서, 학부모의견서 명확하게 기재 (의사의 진단서 및 소견서를 꼭 첨부하시기 바랍니다.)', 21.0, 284.9, 8, 1, { fam: 'g', len: 160.4 });
    for (var i = 0; i < W.length; i++) {
      var w = W[i], o = { fam: w[5] || 'b', anchor: w[6] === 'm' ? 'middle' : '' };
      if (w[3] === 8 && w[0].length > 12) o.len = fitLen(w[0], 8, 51) || '';
      s += T(w[0], w[1], w[2], w[3], w[4], o);
    }
    return s;
  }
  var FRAME = null;
  var lastDigit = function (d) { return d ? String(d.y).slice(-1) : ''; };

  /**
   * r: 신고 데이터, o: { cfg, editable, confirmEdit, teacherSig, cur, required }
   */
  function render(r, o) {
    r = r || {}; o = o || {};
    var cfg = o.cfg || {};
    if (!FRAME) FRAME = frame();
    var s = FRAME;
    s += T((cfg.school || '양지고등학교') + '장 귀하', 23.3, 183.8, 13.5, 1);
    s += T(cfg.teacher || '', 167.0, 264.4, 11, 1, { anchor: 'middle' });

    // 체크
    STATUS.forEach(function (it) { if (r.status === it[0]) s += CHECK(it[3], 88.6); });
    var det = r.detail || [];
    DETAIL.forEach(function (it) { if (det.indexOf(it[0]) >= 0) s += CHECK(it[3], 95.6); });

    // 학년·반·번호·성명
    s += T(r.grade, 145.8, 104.7, 11, 1, { anchor: 'middle' }) + T(r.cls, 161.05, 104.7, 11, 1, { anchor: 'middle' }) + T(r.num, 172.9, 104.7, 11, 1, { anchor: 'middle' });
    s += T(r.name, 166.75, 110.6, 11, 1, { anchor: 'middle' });

    // 기간 (연도는 '202_'의 마지막 숫자만 채움)
    var a = ymd(r.start), b = ymd(r.end), w = ymd(r.wdate);
    s += T(lastDigit(a), 56.85, 130.1, 10, 0, { anchor: 'middle' }) + T(a && a.m, 67.4, 130.1, 10, 0, { anchor: 'middle' }) +
      T(a && a.d, 82.6, 130.1, 10, 0, { anchor: 'middle' }) + T(r.sp, 95.9, 130.1, 10, 0, { anchor: 'middle' });
    s += T(lastDigit(b), 57.15, 137.6, 10, 0, { anchor: 'middle' }) + T(b && b.m, 67.6, 137.6, 10, 0, { anchor: 'middle' }) +
      T(b && b.d, 82.9, 137.6, 10, 0, { anchor: 'middle' }) + T(r.ep, 96.1, 137.6, 10, 0, { anchor: 'middle' });
    s += T(r.days, 122.9, 137.6, 10, 0, { anchor: 'middle' }) + T(r.pcount, 139.85, 137.6, 10, 0, { anchor: 'middle' });

    // 사유: 첫 줄은 밑줄 위, 길면 다음 줄로 이어 씀
    var rs = r.reason ? wrap(r.reason, [116, 154], 10) : [];
    if (rs[0]) {
      var w1 = measure(rs[0], 10);
      s += T(rs[0], 70.6, 145.8, 10);
      if (w1 + 1.6 > 72.7) s += L(142.5, 146.4, Math.min(187, 70.6 + w1 + 0.8), 146.4);
    }
    s += L(69.8, 146.4, 142.5, 146.4);
    if (rs[1]) {
      var w2 = measure(rs[1], 10), fit = w2 > 154 ? 154 : 0;
      s += T(rs[1], 32.2, 152.4, 10, 0, { len: fit || '' }) + L(31.6, 152.95, 32.2 + (fit || w2) + 0.6, 152.95);
    }

    // 작성일
    s += T(lastDigit(w), 91.05, 158.6, 10, 1, { anchor: 'middle' }) + T(w && w.m, 103.35, 158.6, 10, 1, { anchor: 'middle' }) + T(w && w.d, 118.65, 158.6, 10, 1, { anchor: 'middle' });

    // 서명
    s += T(r.sname, 162.4, 164.2, 10, 0, { anchor: 'middle' }) + IMG(r.sigS, 177.6, 162.7, 19, 9);
    s += T(r.pname, 162.4, 170.5, 10, 0, { anchor: 'middle' }) + IMG(r.sigP, 177.6, 169.0, 19, 9);

    // 확인서
    var c = r.confirm || {}, docs = c.docs || [];
    METHODS.forEach(function (m) { if (c.method === m[0] && m[2]) s += CIRCLE(m[2], MB); });
    if (c.method === 'etc') s += T(c.metc, 58.9, MEB, 10, 0, { anchor: 'middle', len: fitLen(c.metc || '', 10, 41) || '' });
    DOCS.forEach(function (d) { if (docs.indexOf(d[0]) >= 0 && d[2]) s += CIRCLE(d[2], DB); });
    if (docs.indexOf('etc') >= 0) s += T(c.detc, 58.4, DEB, 10, 0, { anchor: 'middle', len: fitLen(c.detc || '', 10, 41) || '' });
    var cd = ymd(c.date);
    s += T(lastDigit(cd), 92.85, 254.7, 10, 0, { anchor: 'middle' }) + T(cd && cd.m, 102.9, 254.7, 10, 0, { anchor: 'middle' }) + T(cd && cd.d, 116.4, 254.7, 10, 0, { anchor: 'middle' });
    if (c.date && o.teacherSig) s += IMG(o.teacherSig, 183.2, 262.9, 16, 9);

    var html = '<div class="ab-paper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297" style="font-family:' + esc(FONT_B) + '">' + s + '</svg>';
    if (o.editable) html += hotspots(r, o);
    if (o.confirmEdit) html += confirmSpots(c, o);
    return html + '</div>';
  }

  function spot(k, x, b, w, empty, o, opt) {
    opt = opt || {};
    var top = opt.top != null ? opt.top : b - 4.7, h = opt.h || 6.2;
    var cls = 'ab-hs' + (empty ? ' ab-empty' : '') + (o.cur === k ? ' ab-cur' : '');
    return '<button type="button" class="' + cls + '" data-k="' + k + '"' + (opt.v ? ' data-v="' + opt.v + '"' : '') +
      ' aria-label="' + (opt.label || k) + '" style="left:' + x + 'mm;top:' + top + 'mm;width:' + w + 'mm;height:' + h + 'mm"></button>';
  }

  /* 확인서 편집용 클릭 영역: 확인 방법(하나), 기타 내용, 증빙 서류(여러 개), 기타 내용, 날짜 */
  function confirmSpots(c, o) {
    var docs = c.docs || [], h = '', req = o.confirmRequired || {};
    METHODS.forEach(function (m) {
      // 기타를 골랐는데 내용이 비어 있으면 계속 노란색
      if (m[0] === 'etc') h += spot('cm:etc', m[3], MEB, m[4] - m[3], (!c.method || (c.method === 'etc' && !c.metc)) && req.method !== false, o, { label: '확인 방법: 기타' });
      else h += spot('cm:' + m[0], m[3], MB, m[4] - m[3], !c.method && req.method !== false, o, { label: '확인 방법: ' + m[1] });
    });
    DOCS.forEach(function (d) {
      var noDoc = !docs.length && req.docs !== false;   // 하나도 안 골랐으면 노란색
      // 두 줄 간격이 좁아(4.5mm) 칸 높이를 줄여 겹치지 않게 함
      if (d[0] === 'etc') h += spot('cd:etc', d[3], DEB, d[4] - d[3], noDoc || (docs.indexOf('etc') >= 0 && !c.detc && req.docs !== false), o, { label: '증빙 서류: 기타', top: DEB - 3.75, h: 4.4 });
      else h += spot('cd:' + d[0], d[3], DB, d[4] - d[3], noDoc, o, { label: '증빙 서류: ' + d[1], top: DB - 4.1, h: 4.4 });
    });
    h += spot('cf:date', 84.2, 254.7, 41.0, !c.date && req.date !== false, o, { label: '확인서 날짜' });
    return h;
  }

  function hotspots(r, o) {
    var req = o.required || function () { return true; };
    function empty(k) { var v = r[k]; return (Array.isArray(v) ? !v.length : (v === '' || v == null)) && req(k); }
    function hs(k, x, b, w, opt) { return spot(k, x, b, w, empty(k), o, opt); }
    var h = '';
    STATUS.forEach(function (it) { h += hs('status', it[1] - 0.6, 88.6, it[2] - it[1] + 1.2, { v: it[0], label: it[0] }); });
    DETAIL.forEach(function (it) { h += hs('detail', it[1] - 0.6, 95.6, it[2] - it[1] + 1.2, { v: it[0], label: it[0] }); });
    h += hs('grade', 141.9, 104.7, 7.9, { label: '학년' });
    h += hs('cls', 157.2, 104.7, 7.8, { label: '반' });
    h += hs('num', 169.2, 104.7, 7.6, { label: '번호' });
    h += hs('name', 152.4, 110.6, 28.6, { label: '성명' });
    h += hs('start', 48.2, 130.1, 44.0, { label: '시작일' });
    h += hs('sp', 92.6, 130.1, 7.4, { label: '시작 교시' });
    h += hs('end', 48.4, 137.6, 44.0, { label: '종료일' });
    h += hs('ep', 92.8, 137.6, 7.4, { label: '끝 교시' });
    h += hs('days', 118.7, 137.6, 8.4, { label: '일수' });
    h += hs('pcount', 135.6, 137.6, 8.5, { label: '교시 수' });
    h += hs('reason', 69.4, 145.8, 118, { top: 141.1, h: r.reason && measure(r.reason, 10) > 116 ? 13.2 : 6.2, label: '사유' });
    h += hs('wdate', 82.6, 158.6, 44.5, { label: '작성일' });
    h += hs('sname', 151.2, 164.2, 22.6, { label: '학생 성명' });
    h += hs('sigS', 173.9, 164.2, 7.6, { label: '학생 서명' });
    h += hs('pname', 151.2, 170.5, 22.6, { label: '보호자 성명' });
    h += hs('sigP', 173.9, 170.5, 7.6, { label: '보호자 서명' });
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

  return { render: render, signPad: signPad, fit: fit, esc: esc, ymd: ymd, STATUS: STATUS, DETAIL: DETAIL, METHODS: METHODS, DOCS: DOCS };
})();
