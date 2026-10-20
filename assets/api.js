/* 데이터 저장 계층: Firebase(Firestore + Auth). config.js 에 firebase 설정이 없으면 체험 모드(이 기기 localStorage)로 동작 */
const C = window.APP_CONFIG || {};
const pad = (n) => String(n).padStart(2, '0');
const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const makeCode = () => { const d = new Date(); return `${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; };

function clean(rec) {
  const s = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
  const M = { '가정방문': 'home', '전화연락': 'phone', '학부모 내방': 'visit', '문자 및 SNS': 'sns', '기타': 'etc' };
  const D = { '의사진단서': 'diag', '의사소견서': 'opinion', '진료확인서': 'clinic', '입원확인서': 'admit', '기타': 'etc' };
  const docs = (rec.c_docs || []).map((n) => D[n]).filter(Boolean);
  return {
    status: s(rec.status, 10), detail: (rec.detail || []).map((d) => s(d, 10)).slice(0, 4),
    grade: s(rec.grade, 2), cls: s(rec.cls, 2), num: s(rec.num, 3), name: s(rec.name, 20),
    start: s(rec.start, 10), sp: s(rec.sp, 2), end: s(rec.end, 10), ep: s(rec.ep, 2), days: s(rec.days, 3), pcount: s(rec.pcount, 3),
    reason: s(rec.reason, 120), wdate: s(rec.wdate, 10), sname: s(rec.sname, 20), pname: s(rec.pname, 20),
    sigS: String(rec.sigS || ''), sigP: String(rec.sigP || ''),
    confirm: M[rec.c_method] ? {
      method: M[rec.c_method], metc: rec.c_method === '기타' ? s(rec.c_metc, 20) : '',
      docs, detc: docs.indexOf('etc') >= 0 ? s(rec.c_detc, 20) : '', date: s(rec.c_date, 10)
    } : null,
    // 출석의견서(학부모): 출결현황이 '기타'이거나 사유에 '생리'가 있으면 학생 화면에서 함께 작성
    opinion: rec.opinion ? { who: 'parent', status: '인정', detail: (rec.opinion.detail || []).map((d) => s(d, 4)).slice(0, 4), grade: s(rec.opinion.grade, 2), cls: s(rec.opinion.cls, 2), num: s(rec.opinion.num, 3),
      name: s(rec.opinion.name, 20), note: s(rec.opinion.note, 30), reason: s(rec.opinion.reason, 120), c1: !!rec.opinion.c1, c2: !!rec.opinion.c2,
      date: s(rec.opinion.date, 10), pname: s(rec.opinion.pname, 20), sig: String(rec.opinion.sig || '') } : null
  };
}
// 교외체험학습: kind = 'apply'(신청서) | 'report'(결과보고서) | 'sheet'(별지·사진 첨부)
function cleanTrip(kind, rec) {
  const s = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
  const base = { kind, name: s(rec.name, 20), grade: s(rec.grade, 2), cls: s(rec.cls, 2), num: s(rec.num, 3),
    start: s(rec.start, 10), end: s(rec.end, 10), days: s(rec.days, 3), form: s(rec.form, 10), wdate: s(rec.wdate, 10),
    pname: s(rec.pname, 20), sname: s(rec.sname, 20), sigP: String(rec.sigP || ''), sigS: String(rec.sigS || '') };
  if (kind === 'apply') return Object.assign(base, { phone: s(rec.phone, 20), rule: s(rec.rule, 1), dest: s(rec.dest, 40), lodging: s(rec.lodging, 30),
    gname: s(rec.gname, 20), grel: s(rec.grel, 10), gphone: s(rec.gphone, 20), lname: s(rec.lname, 20), lrel: s(rec.lrel, 10), lphone: s(rec.lphone, 20),
    purpose: s(rec.purpose, 100), plan: s(rec.plan, 400) });
  if (kind === 'sheet') return { kind, name: base.name, grade: base.grade, cls: base.cls, num: base.num, start: base.start, end: base.end, body: s(rec.body, 2000) };
  return Object.assign(base, { place: s(rec.place, 50), title: s(rec.title, 60), body: s(rec.body, 4000) });
}
function inMonth(r, ym, basis) {
  if (basis === 'all' || !ym) return true;
  if (basis === 'submit') return r.submitted.slice(0, 7) === ym;
  return r.start.slice(0, 7) <= ym && r.end.slice(0, 7) >= ym;
}
const byNum = (a, b) => (Number(a.grade) - Number(b.grade)) || (Number(a.cls) - Number(b.cls)) || (Number(a.num) - Number(b.num)) || (a.start < b.start ? -1 : 1);

let API;
const LOCAL_DEMO = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && /[?&]demo=1/.test(location.search + (sessionStorage.getItem('force-demo') ? '&demo=1' : ''));
if (LOCAL_DEMO) sessionStorage.setItem('force-demo', '1');
if (C.firebase && C.firebase.apiKey && !LOCAL_DEMO) {
  const V = '10.12.5', base = `https://www.gstatic.com/firebasejs/${V}/`;
  const [{ initializeApp }, fs, au] = await Promise.all([
    import(base + 'firebase-app.js'), import(base + 'firebase-firestore.js'), import(base + 'firebase-auth.js')
  ]);
  const app = initializeApp(C.firebase), db = fs.getFirestore(app), auth = au.getAuth(app);
  const authReady = new Promise((ok) => { const off = au.onAuthStateChanged(auth, (u) => { off(); ok(u); }); });
  const isTeacher = (u) => u && (!C.teacherEmail || (u.email || '').toLowerCase() === C.teacherEmail.toLowerCase());
  const friendly = (e) => {
    const c = (e && e.code) || '';
    if (/permission-denied/.test(c)) return new Error('권한이 없습니다. (교사 로그인 또는 Firestore 규칙을 확인하세요)');
    if (/invalid-credential|wrong-password|user-not-found|invalid-email/.test(c)) return new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    if (/too-many-requests/.test(c)) return new Error('시도가 너무 많습니다. 잠시 후 다시 해 주세요.');
    if (/unavailable|network/.test(c)) return new Error('인터넷 연결을 확인해 주세요.');
    return e instanceof Error ? e : new Error(String(e));
  };
  const wrap = (fn) => async (...a) => { try { return await fn(...a); } catch (e) { throw friendly(e); } };

  API = {
    mode: 'firebase',
    submitReport: wrap(async (rec, files) => {
      const r = clean(rec), list = (files || []).slice(0, 3), code = makeCode();
      const ref = fs.doc(fs.collection(db, 'reports'));
      await fs.setDoc(ref, { ...r, fileCount: list.length, code, state: '접수', submitted: fs.serverTimestamp() });
      for (let i = 0; i < list.length; i++) await fs.setDoc(fs.doc(db, 'reports', ref.id, 'files', String(i)), { dataUrl: list[i].dataUrl });
      return { id: code, time: fmt(new Date()), name: r.name, files: list.length };
    }),
    currentTeacher: async () => { const u = await authReady; return isTeacher(auth.currentUser || u) ? (auth.currentUser || u).email : null; },
    adminLogin: wrap(async (cred) => {
      const { user } = await au.signInWithEmailAndPassword(auth, cred.email || C.teacherEmail, cred.pw);
      if (!isTeacher(user)) { await au.signOut(auth); throw new Error('담임 계정이 아닙니다.'); }
      return { ok: true, sheetUrl: `https://console.firebase.google.com/project/${C.firebase.projectId}/firestore/data` };
    }),
    logout: () => au.signOut(auth),
    listReports: wrap(async (_, ym, basis) => {
      const snap = await fs.getDocs(fs.query(fs.collection(db, 'reports'), fs.orderBy('submitted', 'desc')));
      const items = [];
      snap.forEach((d) => {
        const v = d.data(), t = v.submitted && v.submitted.toDate ? v.submitted.toDate() : new Date();
        const r = { ...v, id: d.id, submitted: fmt(t), files: Array.from({ length: v.fileCount || 0 }, (_, i) => `${d.id}/${i}`) };
        if (inMonth(r, ym, basis)) items.push(r);
      });
      items.sort(byNum);
      const s = await fs.getDoc(fs.doc(db, 'settings', 'teacher'));
      const t = s.exists() ? s.data() : {};
      return { items, teacherSig: t.sig || '', teacherName: t.name || '' };
    }),
    saveConfirms: wrap(async (_, map) => {
      const b = fs.writeBatch(db); let n = 0;
      Object.keys(map).forEach((id) => { const c = map[id]; b.update(fs.doc(db, 'reports', id), { confirm: c || null, state: c ? '확인완료' : '접수' }); n++; });
      await b.commit(); return n;
    }),
    deleteReport: wrap(async (_, id) => {
      const s = await fs.getDocs(fs.collection(db, 'reports', id, 'files'));
      await Promise.all(s.docs.map((d) => fs.deleteDoc(d.ref)));
      await fs.deleteDoc(fs.doc(db, 'reports', id)); return true;
    }),
    getAttachments: wrap(async (_, ids) => Promise.all((ids || []).map(async (id) => {
      const [rid, n] = id.split('/');
      try { const s = await fs.getDoc(fs.doc(db, 'reports', rid, 'files', n)); return { id, dataUrl: s.exists() ? s.data().dataUrl : '' }; }
      catch (e) { return { id, error: String(e) }; }
    }))),
    saveTeacherSig: wrap(async (_, url) => { await fs.setDoc(fs.doc(db, 'settings', 'teacher'), { sig: url || '' }, { merge: true }); return true; }),
    saveTeacherName: wrap(async (_, name) => { await fs.setDoc(fs.doc(db, 'settings', 'teacher'), { name: String(name || '').trim().slice(0, 20) }, { merge: true }); return true; }),
    getTeacher: wrap(async () => { const t = await fs.getDoc(fs.doc(db, 'settings', 'teacher')); return t.exists() ? t.data() : {}; }),
    submitTrip: wrap(async (kind, rec, photos) => {
      const r = cleanTrip(kind, rec), code = makeCode(), list = (photos || []).slice(0, 4);
      const ref = fs.doc(fs.collection(db, 'trips'));
      await fs.setDoc(ref, { ...r, ...(kind === 'sheet' ? { fileCount: list.length } : {}), code, state: '접수', notice: null, submitted: fs.serverTimestamp() });
      for (let i = 0; i < list.length; i++) await fs.setDoc(fs.doc(db, 'trips', ref.id, 'files', String(i)), { dataUrl: list[i] });
      return { id: code, time: fmt(new Date()), name: r.name };
    }),
    getTripFiles: wrap(async (_, id, n) => Promise.all(Array.from({ length: n || 0 }, async (x, i) => {
      const d = await fs.getDoc(fs.doc(db, 'trips', id, 'files', String(i))); return d.exists() ? d.data().dataUrl : '';
    }))),
    listTrips: wrap(async (_, ym, basis) => {
      const snap = await fs.getDocs(fs.query(fs.collection(db, 'trips'), fs.orderBy('submitted', 'desc')));
      const items = [];
      snap.forEach((d) => {
        const v = d.data(), t = v.submitted && v.submitted.toDate ? v.submitted.toDate() : new Date();
        const r = { ...v, id: d.id, submitted: fmt(t) };
        if (inMonth(r, ym, basis)) items.push(r);
      });
      return items.sort(byNum);
    }),
    saveNotice: wrap(async (_, id, notice) => { await fs.updateDoc(fs.doc(db, 'trips', id), { notice: notice || null, state: notice && notice.date ? '통보완료' : '접수' }); return true; }),
    deleteTrip: wrap(async (_, id) => {
      const s = await fs.getDocs(fs.collection(db, 'trips', id, 'files'));
      await Promise.all(s.docs.map((d) => fs.deleteDoc(d.ref)));
      await fs.deleteDoc(fs.doc(db, 'trips', id)); return true;
    })
  };
} else {
  /* 체험 모드: 이 브라우저에만 저장 (교사 비밀번호 1234) */
  const K = 'demo-reports', S = 'demo-tsig';
  const all = () => { try { return JSON.parse(localStorage.getItem(K) || '[]'); } catch (e) { return []; } };
  const put = (a) => localStorage.setItem(K, JSON.stringify(a));
  const auth = () => { if (sessionStorage.getItem('demo-login') !== '1') throw new Error('로그인이 필요합니다.'); };
  API = {
    mode: 'demo',
    submitReport: async (rec, files) => {
      const a = all(), r = clean(rec), code = makeCode(), id = 'd' + Date.now();
      const list = (files || []).slice(0, 3);
      list.forEach((f, i) => localStorage.setItem(`demo-file-${id}/${i}`, f.dataUrl));
      a.push({ ...r, id, code, state: '접수', submitted: fmt(new Date()), fileCount: list.length });
      try { put(a); } catch (e) { throw new Error('체험 모드 저장 공간이 부족합니다.'); }
      return { id: code, time: fmt(new Date()), name: r.name, files: list.length };
    },
    currentTeacher: async () => (sessionStorage.getItem('demo-login') === '1' ? 'demo' : null),
    adminLogin: async (cred) => { if (cred.pw !== '1234') throw new Error('비밀번호가 올바르지 않습니다. (체험 모드: 1234)'); sessionStorage.setItem('demo-login', '1'); return { ok: true, sheetUrl: '' }; },
    logout: async () => sessionStorage.removeItem('demo-login'),
    listReports: async (_, ym, basis) => {
      auth();
      const items = all().map((r) => ({ ...r, files: Array.from({ length: r.fileCount || 0 }, (_, i) => `${r.id}/${i}`) })).filter((r) => inMonth(r, ym, basis)).sort(byNum);
      return { items, teacherSig: localStorage.getItem(S) || '', teacherName: localStorage.getItem('demo-tname') || '' };
    },
    saveConfirms: async (_, map) => { auth(); const a = all(); let n = 0; a.forEach((r) => { if (r.id in map) { r.confirm = map[r.id] || null; r.state = map[r.id] ? '확인완료' : '접수'; n++; } }); put(a); return n; },
    deleteReport: async (_, id) => { auth(); put(all().filter((r) => r.id !== id)); return true; },
    getAttachments: async (_, ids) => (ids || []).map((id) => ({ id, dataUrl: localStorage.getItem('demo-file-' + id) || '' })),
    saveTeacherSig: async (_, url) => { auth(); localStorage.setItem(S, url || ''); return true; },
    saveTeacherName: async (_, name) => { auth(); localStorage.setItem('demo-tname', String(name || '').trim().slice(0, 20)); return true; },
    getTeacher: async () => { auth(); return { sig: localStorage.getItem(S) || '', name: localStorage.getItem('demo-tname') || '' }; },
    submitTrip: async (kind, rec, photos) => {
      const a = JSON.parse(localStorage.getItem('demo-trips') || '[]'), r = cleanTrip(kind, rec), code = makeCode(), id = 't' + Date.now(), list = (photos || []).slice(0, 4);
      list.forEach((p, i) => localStorage.setItem(`demo-tfile-${id}/${i}`, p));
      a.push({ ...r, ...(kind === 'sheet' ? { fileCount: list.length } : {}), id, code, state: '접수', notice: null, submitted: fmt(new Date()) });
      localStorage.setItem('demo-trips', JSON.stringify(a)); return { id: code, time: fmt(new Date()), name: r.name };
    },
    getTripFiles: async (_, id, n) => Array.from({ length: n || 0 }, (x, i) => localStorage.getItem(`demo-tfile-${id}/${i}`) || ''),
    listTrips: async (_, ym, basis) => { auth(); return JSON.parse(localStorage.getItem('demo-trips') || '[]').filter((r) => inMonth(r, ym, basis)).sort(byNum); },
    saveNotice: async (_, id, notice) => {
      auth(); const a = JSON.parse(localStorage.getItem('demo-trips') || '[]');
      a.forEach((r) => { if (r.id === id) { r.notice = notice || null; r.state = notice && notice.date ? '통보완료' : '접수'; } });
      localStorage.setItem('demo-trips', JSON.stringify(a)); return true;
    },
    deleteTrip: async (_, id) => { auth(); localStorage.setItem('demo-trips', JSON.stringify(JSON.parse(localStorage.getItem('demo-trips') || '[]').filter((r) => r.id !== id))); return true; }
  };
}
window.API = API;
window.__apiResolve(API);
