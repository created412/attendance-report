/* 데이터 저장 계층: Firebase(Firestore + Auth). config.js 에 firebase 설정이 없으면 체험 모드(이 기기 localStorage)로 동작 */
const C = window.APP_CONFIG || {};
const pad = (n) => String(n).padStart(2, '0');
const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const makeCode = () => { const d = new Date(); return `${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; };

function clean(rec) {
  const s = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
  return {
    status: s(rec.status, 10), detail: (rec.detail || []).map((d) => s(d, 10)).slice(0, 4),
    num: s(rec.num, 3), name: s(rec.name, 20), start: s(rec.start, 10), end: s(rec.end, 10), days: s(rec.days, 3),
    reason: s(rec.reason, 120), wdate: s(rec.wdate, 10), pname: s(rec.pname, 20),
    sigS: String(rec.sigS || ''), sigP: String(rec.sigP || '')
  };
}
function inMonth(r, ym, basis) {
  if (basis === 'all' || !ym) return true;
  if (basis === 'submit') return r.submitted.slice(0, 7) === ym;
  return r.start.slice(0, 7) <= ym && r.end.slice(0, 7) >= ym;
}
const byNum = (a, b) => (Number(a.num) - Number(b.num)) || (a.start < b.start ? -1 : 1);

let API;
if (C.firebase && C.firebase.apiKey) {
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
      await fs.setDoc(ref, { ...r, fileCount: list.length, code, state: '접수', confirm: null, submitted: fs.serverTimestamp() });
      for (let i = 0; i < list.length; i++) await fs.setDoc(fs.doc(db, 'reports', ref.id, 'files', String(i)), { dataUrl: list[i].dataUrl });
      return { id: code, time: fmt(new Date()), name: r.name, files: list.length };
    }),
    currentTeacher: async () => { const u = await authReady; return isTeacher(auth.currentUser || u) ? (auth.currentUser || u).email : null; },
    adminLogin: wrap(async (cred) => {
      const { user } = await au.signInWithEmailAndPassword(auth, cred.email, cred.pw);
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
    saveTeacherName: wrap(async (_, name) => { await fs.setDoc(fs.doc(db, 'settings', 'teacher'), { name: String(name || '').trim().slice(0, 20) }, { merge: true }); return true; })
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
      a.push({ ...r, id, code, state: '접수', confirm: null, submitted: fmt(new Date()), fileCount: list.length });
      try { put(a); } catch (e) { throw new Error('체험 모드 저장 공간이 부족합니다.'); }
      return { id: code, time: fmt(new Date()), name: r.name, files: list.length };
    },
    currentTeacher: async () => (sessionStorage.getItem('demo-login') === '1' ? 'demo' : null),
    adminLogin: async (cred) => { if (cred.pw !== '1234') throw new Error('체험 모드 비밀번호는 1234 입니다.'); sessionStorage.setItem('demo-login', '1'); return { ok: true, sheetUrl: '' }; },
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
    saveTeacherName: async (_, name) => { auth(); localStorage.setItem('demo-tname', String(name || '').trim().slice(0, 20)); return true; }
  };
}
window.API = API;
window.__apiResolve(API);
