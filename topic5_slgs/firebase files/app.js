// Topic 5 Quiz app (Firebase + Google sign-in)
// - Students: do quiz, attempts saved to Firestore
// - Teachers: see summaries from /users docs
//
// IMPORTANT: Long-answer marking is keyword-based only. The UI flags this explicitly.

import { firebaseConfig } from "./config.js";

// Firebase modular SDK (CDN). If you prefer npm + bundler, swap these imports.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  runTransaction,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const els = {
  setupPanel: document.getElementById("setupPanel"),
  studentPanel: document.getElementById("studentPanel"),
  teacherPanel: document.getElementById("teacherPanel"),

  btnLogin: document.getElementById("btnLogin"),
  btnStudent: document.getElementById("btnStudent"),
  btnTeacher: document.getElementById("btnTeacher"),

  userBox: document.getElementById("userBox"),
  statusPill: document.getElementById("statusPill"),
  savePill: document.getElementById("savePill"),

  classId: document.getElementById("classId"),
  numQ: document.getElementById("numQ"),
  diffMix: document.getElementById("diffMix"),

  startBtn: document.getElementById("startBtn"),
  newSetBtn: document.getElementById("newSetBtn"),
  revealAllBtn: document.getElementById("revealAllBtn"),

  quiz: document.getElementById("quiz"),
  scoreLine: document.getElementById("scoreLine"),
  summaryLine: document.getElementById("summaryLine"),

  kpiChecked: document.getElementById("kpiChecked"),
  kpiFull: document.getElementById("kpiFull"),
  kpiPartial: document.getElementById("kpiPartial"),
  kpiWrong: document.getElementById("kpiWrong"),

  // teacher
  filterClass: document.getElementById("filterClass"),
  btnRefreshTeacher: document.getElementById("btnRefreshTeacher"),
  btnExportCsv: document.getElementById("btnExportCsv"),
  teacherStatus: document.getElementById("teacherStatus"),
  teacherTbody: document.getElementById("teacherTbody")
};

function show(el, on){ el.style.display = on ? "" : "none"; }
function escapeHtml(s){
  return (s ?? "").toString()
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#39;");
}
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }
function norm(s){
  return (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[“”"]/g,'"')
    .replace(/[’]/g,"'")
    .replace(/\s+/g,' ');
}

// ---------- Firebase init ----------
let app=null, auth=null, db=null;
let user=null;
let isTeacher=false;

if(!firebaseConfig){
  show(els.setupPanel, true);
  show(els.studentPanel, false);
  show(els.teacherPanel, false);
  els.statusPill.textContent = "No config";
  els.savePill.textContent = "Not saving";
} else {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  show(els.setupPanel, false);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  els.btnLogin.addEventListener("click", async () => {
    await signInWithPopup(auth, provider);
  });

  onAuthStateChanged(auth, async (u) => {
    user = u || null;
    if(!user){
      isTeacher = false;
      renderLoggedOut();
      return;
    }
    await ensureUserDoc(user);
    isTeacher = await checkTeacher(user.uid);
    renderLoggedIn(user, isTeacher);
    // show student panel by default
    show(els.studentPanel, true);
    show(els.teacherPanel, false);
  });
}

function renderLoggedOut(){
  show(els.studentPanel, true);
  show(els.teacherPanel, false);
  els.btnTeacher.style.display = "none";
  els.btnStudent.disabled = true;
  els.statusPill.textContent = "Signed out";
  els.savePill.textContent = "Not saving";
  els.userBox.innerHTML = `<button class="btn primary" id="btnLogin2">Sign in with Google</button>`;
  document.getElementById("btnLogin2").addEventListener("click", () => els.btnLogin.click());
}

function renderLoggedIn(u, teacher){
  els.btnStudent.disabled = false;

  els.statusPill.textContent = "Ready";
  els.savePill.textContent = "Saving progress";

  els.userBox.innerHTML = `
    <div class="pill">UID: ${escapeHtml(u.uid)}</div>
    <div class="pill">${escapeHtml(u.email || "")}</div>
    <button class="btn" id="btnLogout">Sign out</button>
  `;
  document.getElementById("btnLogout").addEventListener("click", async () => {
    await signOut(auth);
  });

  if(teacher){
    els.btnTeacher.style.display = "";
    els.btnTeacher.disabled = false;
  } else {
    els.btnTeacher.style.display = "none";
  }
}

// navigation
els.btnStudent.addEventListener("click", () => {
  show(els.studentPanel, true);
  show(els.teacherPanel, false);
});
els.btnTeacher.addEventListener("click", async () => {
  if(!user) return;
  isTeacher = await checkTeacher(user.uid);
  if(!isTeacher) return;
  show(els.studentPanel, false);
  show(els.teacherPanel, true);
  await refreshTeacher();
});

// ---------- Firestore helpers ----------
async function ensureUserDoc(u){
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  if(!snap.exists()){
    await setDoc(ref, {
      uid: u.uid,
      email: u.email || null,
      displayName: u.displayName || null,
      classId: null,
      createdAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
      stats: { attempts: 0, full: 0, partial: 0, wrong: 0 },
      statsByTag: {}
    }, { merge: true });
  } else {
    await setDoc(ref, { lastSeenAt: serverTimestamp() }, { merge: true });
  }
}

async function setUserClass(classId){
  if(!user) return;
  const ref = doc(db, "users", user.uid);
  await setDoc(ref, { classId: classId || null, lastSeenAt: serverTimestamp() }, { merge: true });
}

async function checkTeacher(uid){
  const tRef = doc(db, "teachers", uid);
  const snap = await getDoc(tRef);
  return snap.exists();
}

async function writeAttempt({ questionId, tags, status, score, max, kind, answerRaw }){
  if(!user) return;
  const uid = user.uid;
  const attempt = {
    questionId, tags, status, score, max, kind,
    answerRaw: answerRaw ?? null,
    createdAt: serverTimestamp()
  };
  await addDoc(collection(db, "users", uid, "attempts"), attempt);

  const uRef = doc(db, "users", uid);
  await runTransaction(db, async (tx) => {
    const updates = {
      lastSeenAt: serverTimestamp(),
      "stats.attempts": increment(1),
      "stats.full": increment(status === "full" ? 1 : 0),
      "stats.partial": increment(status === "partial" ? 1 : 0),
      "stats.wrong": increment(status === "wrong" ? 1 : 0),
    };
    if(Array.isArray(tags)){
      for(const t of tags){
        const safe = t.replace(/[^a-z0-9_]/gi, "_");
        updates[`statsByTag.${safe}.attempts`] = increment(1);
        updates[`statsByTag.${safe}.${status}`] = increment(1);
      }
    }
    tx.set(uRef, updates, { merge: true });
  });
}

// ---------- Teacher dashboard ----------
function fmtDate(d){
  if(!d) return "";
  try{
    const dt = (d.toDate ? d.toDate() : new Date(d));
    return dt.toLocaleString();
  }catch{ return ""; }
}
function weakTags(statsByTag){
  if(!statsByTag) return "";
  const items = Object.entries(statsByTag).map(([tag,v])=>{
    const a = Number(v.attempts||0);
    const w = Number(v.wrong||0);
    const p = a ? (w/a) : 0;
    return { tag, a, w, p };
  }).filter(x=>x.a>=3);
  items.sort((a,b)=> b.p - a.p);
  return items.slice(0,3).map(x => `${x.tag} (${Math.round(x.p*100)}%)`).join(", ");
}
function toCsv(rows){
  const esc = (v)=> `"${String(v??"").replaceAll('"','""')}"`;
  const header = Object.keys(rows[0]||{}).map(esc).join(",");
  const lines = rows.map(r=>Object.keys(rows[0]).map(k=>esc(r[k])).join(","));
  return [header, ...lines].join("\n");
}

async function refreshTeacher(){
  if(!user || !isTeacher) return;
  els.teacherStatus.textContent = "Loading...";
  const cls = (els.filterClass.value || "").trim();
  let qy;
  if(cls){
    qy = query(collection(db, "users"), where("classId", "==", cls));
  } else {
    qy = query(collection(db, "users"));
  }
  const snap = await getDocs(qy);
  const rows = [];
  const tbody = [];
  snap.forEach(docSnap=>{
    const d = docSnap.data();
    const st = d.stats || {};
    const attempts = Number(st.attempts||0);
    const full = Number(st.full||0);
    const partial = Number(st.partial||0);
    const wrong = Number(st.wrong||0);
    const acc = attempts ? ((full + 0.5*partial)/attempts) : 0;
    const weak = weakTags(d.statsByTag);
    const row = {
      name: d.displayName || "",
      email: d.email || "",
      classId: d.classId || "",
      attempts, full, partial, wrong,
      accuracy: Math.round(acc*100) + "%",
      weakTags: weak,
      lastSeen: d.lastSeenAt ? fmtDate(d.lastSeenAt) : ""
    };
    rows.push(row);
    tbody.push(`<tr>
      <td>${escapeHtml(row.name)}</td>
      <td>${escapeHtml(row.email)}</td>
      <td>${escapeHtml(row.classId)}</td>
      <td>${row.attempts}</td>
      <td>${row.full}</td>
      <td>${row.partial}</td>
      <td>${row.wrong}</td>
      <td>${escapeHtml(row.accuracy)}</td>
      <td>${escapeHtml(row.weakTags)}</td>
      <td>${escapeHtml(row.lastSeen)}</td>
    </tr>`);
  });
  els.teacherTbody.innerHTML = tbody.join("");
  els.teacherStatus.textContent = `${rows.length} pupil(s)`;
  els.teacherPanel._lastRows = rows;
}

els.btnRefreshTeacher.addEventListener("click", refreshTeacher);
els.btnExportCsv.addEventListener("click", () => {
  const rows = els.teacherPanel._lastRows || [];
  if(!rows.length) return;
  const csv = toCsv(rows);
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `topic5_progress_${(els.filterClass.value||"all")}_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

// ---------- Quiz engine ----------
function numParts(raw){
  if(raw === null || raw === undefined) return {ok:false};
  let s = raw.toString().trim();
  if(!s) return {ok:false};
  s = s.replace(/×/g,'x');
  let compact = s.replace(/\s+/g,'');
  compact = compact.replace(/x10\^?\(?(-?\d+)\)?/i, 'e$1');
  compact = compact.replace(/10\^\(?(-?\d+)\)?/i, 'e$1');
  const m = compact.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/i);
  if(!m) return {ok:false};
  const num = Number(m[0]);
  if(Number.isNaN(num)) return {ok:false};
  return {ok:true, num, numStr:m[0]};
}

function tidyUnitToken(u){
  if(!u) return null;
  let t = u.trim();
  if(!t) return null;
  t = t.replace(/²/g,'^2').replace(/³/g,'^3');
  t = t.replace(/degc/ig,'degC');
  t = t.replace(/celsius/ig,'degC');
  t = t.replace(/\s+/g,'');
  t = t.replace(/per/ig,'/');
  t = t.replace(/m\^?2/ig,'m^2').replace(/cm\^?2/ig,'cm^2').replace(/mm\^?2/ig,'mm^2');
  t = t.replace(/n\/m\^?2/ig,'N/m^2').replace(/n\/cm\^?2/ig,'N/cm^2');
  if(t === "degC") return "degC";
  if(t === "°C" || t === "°c") return t;
  return t;
}

function unitInfo(token){
  if(!token) return null;
  const t = tidyUnitToken(token);

  if(t === "K") return {type:"tempK", factor:1, canonical:"K", caseOk:true};
  if(t === "k") return {type:"tempK", factor:1, canonical:"K", caseOk:false, wrongCase:true};

  if(t === "°C" || t === "°c") return {type:"tempC", factor:1, canonical:"°C", caseOk:true};
  if(t === "degC") return {type:"tempC", factor:1, canonical:"degC", caseOk:true};

  if(t === "Pa") return {type:"pressure", factor:1, canonical:"Pa", caseOk:true};
  if(t === "kPa") return {type:"pressure", factor:1e3, canonical:"kPa", caseOk:true};
  if(t === "MPa") return {type:"pressure", factor:1e6, canonical:"MPa", caseOk:true};
  if(t === "N/m^2") return {type:"pressure", factor:1, canonical:"N/m²", caseOk:true};
  if(t === "N/cm^2") return {type:"pressure", factor:1e4, canonical:"N/cm²", caseOk:true};

  if(t === "N") return {type:"force", factor:1, canonical:"N", caseOk:true};
  if(t === "kN") return {type:"force", factor:1e3, canonical:"kN", caseOk:true};

  if(t === "m^2") return {type:"area", factor:1, canonical:"m²", caseOk:true};
  if(t === "cm^2") return {type:"area", factor:1e-4, canonical:"cm²", caseOk:true};
  if(t === "mm^2") return {type:"area", factor:1e-6, canonical:"mm²", caseOk:true};

  return null;
}

function parseQuantity(raw){
  const parts = numParts(raw);
  if(!parts.ok) return {ok:false};
  const rawStr = raw.toString().trim();
  const m = rawStr.match(/[-+]?\d*\.?\d+(?:\s*(?:e|E|x\s*10\^?)\s*[-+]?\d+)?/);
  let suffix = "";
  if(m){
    suffix = rawStr.slice(rawStr.indexOf(m[0]) + m[0].length).trim();
  }
  const token = tidyUnitToken(suffix);
  const unitPresent = !!token;
  const info = unitPresent ? unitInfo(token) : null;

  return {
    ok:true,
    num: parts.num,
    numStr: (m ? m[0].replace(/\s+/g,'') : parts.numStr),
    unitToken: unitPresent ? token : null,
    unitType: info ? info.type : null,
    unitFactor: info ? info.factor : null,
    unitCanonical: info ? info.canonical : null,
    unitCaseOk: info ? (info.caseOk !== false) : null,
    unitPresent
  };
}
function expectedUnitInfo(unitHint){
  if(!unitHint) return null;
  const info = unitInfo(unitHint);
  if(!info) return null;
  return {...info, token: unitHint};
}

function countDecimalPlaces(numStr){
  const s = numStr.toLowerCase();
  const base = s.split('e')[0];
  const dot = base.indexOf('.');
  return (dot === -1) ? 0 : (base.length - dot - 1);
}
function countSigFigs(numStr){
  let s = numStr.toLowerCase();
  s = s.replace(/^[-+]/,'');
  s = s.split('e')[0];
  if(s.includes('.')){
    s = s.replace(/^0+/, '').replace('.','').replace(/^0+/, '');
    return Math.max(1, s.length);
  } else {
    s = s.replace(/^0+/, '').replace(/0+$/,'');
    return Math.max(1, s.length || 1);
  }
}
function roundToDp(x, dp){
  const f = Math.pow(10, dp);
  return Math.round((x + Number.EPSILON) * f) / f;
}
function roundToSf(x, sf){
  if(x === 0) return 0;
  return Number(x.toPrecision(sf));
}
function nearlyEqual(a,b, rel=1e-4, abs=1e-9){
  const diff = Math.abs(a-b);
  if(diff <= abs) return true;
  const scale = Math.max(Math.abs(a), Math.abs(b), 1e-12);
  return diff/scale <= rel;
}
function roundingMatch(studentVal, trueVal, numStr){
  if(nearlyEqual(studentVal, trueVal)) return {ok:true, basis:"exact"};
  const dp = countDecimalPlaces(numStr);
  const sf = countSigFigs(numStr);
  const tDp = roundToDp(trueVal, dp);
  if(nearlyEqual(studentVal, tDp, 1e-10, 1e-12)) return {ok:true, basis:`${dp} d.p.`};
  const tSf = roundToSf(trueVal, sf);
  if(nearlyEqual(studentVal, tSf, 1e-10, 1e-12)) return {ok:true, basis:`${sf} s.f.`};
  return {ok:false};
}
function fmtRounded(value, opts){
  if(opts && Number.isInteger(opts.dp)) return Number(value).toFixed(opts.dp);
  if(opts && Number.isInteger(opts.sf)) return Number(value).toPrecision(opts.sf);
  const a = Number(value);
  return (Math.abs(a) >= 1000 || Math.abs(a) < 0.01) ? a.toExponential(3) : a.toPrecision(4);
}
function closeButBadRounding(studentVal, trueVal, numStr, relTolClose){
  const diff = Math.abs(studentVal-trueVal);
  const scale = Math.max(Math.abs(trueVal), 1e-12);
  const rel = diff/scale;
  const close = rel <= (relTolClose ?? 0.03);
  if(!close) return null;

  const dp = countDecimalPlaces(numStr);
  const sf = countSigFigs(numStr);
  const base = numStr.toLowerCase().split('e')[0];
  const hasDot = base.includes('.');
  const target = hasDot ? roundToDp(trueVal, dp) : roundToSf(trueVal, sf);

  let hint = "";
  if(target > studentVal) hint = "You needed to round up.";
  if(target < studentVal) hint = "You needed to round down.";

  return {basis: hasDot ? `${dp} d.p.` : `${sf} s.f.`, target, hint, dp: hasDot ? dp : null, sf: hasDot ? null : sf};
}

// Mini graph choices
function svgAxes(labelX, labelY){
  return `
    <line x1="32" y1="12" x2="32" y2="138" stroke="rgba(255,255,255,.35)"/>
    <line x1="32" y1="138" x2="210" y2="138" stroke="rgba(255,255,255,.35)"/>
    <text x="10" y="22" fill="rgba(255,255,255,.65)" font-size="11">${labelY}</text>
    <text x="195" y="160" fill="rgba(255,255,255,.65)" font-size="11">${labelX}</text>
  `;
}
function graphChoiceHTML(title, svgPath, labelX, labelY){
  return `
    <div class="choiceText">
      <div class="choiceTitle">${title}</div>
      <div class="choiceViz">
        <svg viewBox="0 0 240 170" width="220" height="150" aria-label="${title}">
          ${svgAxes(labelX,labelY)}
          ${svgPath}
        </svg>
      </div>
    </div>
  `;
}
function gLineThroughOrigin(){ return `<line x1="32" y1="138" x2="205" y2="35" stroke="rgba(255,255,255,.85)" stroke-width="3"/>`; }
function gCurveThroughOrigin(){ return `<path d="M32 138 C 70 130, 110 105, 205 35" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3"/>`; }
function gLineNotThroughOrigin(){ return `<line x1="32" y1="110" x2="205" y2="35" stroke="rgba(255,255,255,.85)" stroke-width="3"/>`; }
function gDecreasingLine(){ return `<line x1="32" y1="35" x2="205" y2="138" stroke="rgba(255,255,255,.85)" stroke-width="3"/>`; }
function gPVInverseCurve(){ return `<path d="M42 30 C 85 70, 130 110, 210 132" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3"/>`; }
function gPVWrongIncreasingFlatten(){ return `<path d="M42 132 C 95 105, 145 70, 210 35" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3"/>`; }

// Randomised numeric generators
function genPressureCalc(){
  const Fs = [120,150,180,210,240,300,360,420];
  const As = [2.5,3.0,4.0,6.0,7.5,8.0,10.0,12.0];
  const F = Fs[Math.floor(Math.random()*Fs.length)];
  const A_cm2 = As[Math.floor(Math.random()*As.length)];
  const A_m2 = A_cm2 * 1e-4;
  const p = F / A_m2;
  return {
    prompt: `A force of ${F} N acts on an area of ${A_cm2} cm². Calculate the pressure.`,
    answer: p,
    unitHint: "Pa",
    explanation:
`Mark scheme:
• Convert area: ${A_cm2} cm² = ${(A_m2).toExponential(3)} m²
• Use p = F/A:
  p = ${F} / ${(A_m2).toExponential(3)} = ${p.toExponential(3)} Pa

Trap: Pa = N/m², so the area must be in m².`
  };
}
function genPressure_mm2(){
  const Fs = [80,120,160,200];
  const A_mm2 = [5,8,10,12,20][Math.floor(Math.random()*5)];
  const F = Fs[Math.floor(Math.random()*Fs.length)];
  const A_m2 = A_mm2 * 1e-6;
  const p = F / A_m2;
  return {
    prompt: `A force of ${F} N is applied through a tiny tip of area ${A_mm2} mm². Calculate the pressure.`,
    answer: p,
    unitHint: "Pa",
    explanation:
`Mark scheme:
• Convert area: ${A_mm2} mm² = ${(A_m2).toExponential(3)} m²
• p = F/A = ${F} / ${(A_m2).toExponential(3)} = ${p.toExponential(3)} Pa`
  };
}
function genForceFromPressure(){
  const p_kPa = [60,75,90,110,120,140][Math.floor(Math.random()*6)];
  const A_cm2 = [10,12,15,18,20,25][Math.floor(Math.random()*6)];
  const p = p_kPa*1000;
  const A_m2 = A_cm2*1e-4;
  const F = p*A_m2;
  return {
    prompt: `A pressure of ${p_kPa} kPa acts on an area of ${A_cm2} cm². Calculate the force.`,
    answer: F,
    unitHint: "N",
    explanation:
`Mark scheme:
• ${p_kPa} kPa = ${p.toLocaleString()} Pa
• ${A_cm2} cm² = ${(A_m2).toExponential(3)} m²
• F = pA = ${p} × ${(A_m2).toExponential(3)} = ${F.toPrecision(4)} N`
  };
}
function genNetPressureForce(){
  const p_in_kPa = [70,80,90,100,110][Math.floor(Math.random()*5)];
  const p_out_kPa = [20,25,30,35,40][Math.floor(Math.random()*5)];
  const A_m2 = [0.20,0.25,0.30,0.40,0.50][Math.floor(Math.random()*5)];
  const dp = (p_in_kPa - p_out_kPa)*1000;
  const F = dp*A_m2;
  return {
    prompt: `A cabin window has area ${A_m2} m². Pressure inside is ${p_in_kPa} kPa and pressure outside is ${p_out_kPa} kPa. Calculate the net force on the window.`,
    answer: F,
    unitHint: "N",
    explanation:
`Mark scheme:
• Δp = (${p_in_kPa} − ${p_out_kPa}) kPa = ${dp.toLocaleString()} Pa
• F = ΔpA = ${dp} × ${A_m2} = ${F.toPrecision(4)} N

Trap: pressure acts on both sides — use the difference.`
  };
}
function genPiston(){
  const F = [120,180,240,300][Math.floor(Math.random()*4)];
  const r_cm = [1.0,1.5,2.0,2.5][Math.floor(Math.random()*4)];
  const r_m = r_cm/100;
  const A = Math.PI*r_m*r_m;
  const p = F/A;
  return {
    prompt: `A circular piston of radius ${r_cm} cm experiences a force of ${F} N. Calculate the pressure on the piston.`,
    answer: p,
    unitHint: "Pa",
    explanation:
`Mark scheme:
• Convert radius: ${r_cm} cm = ${r_m.toExponential(3)} m
• Area A = πr² = π×(${r_m.toExponential(3)})² = ${A.toExponential(3)} m²
• Pressure p = F/A = ${F} / ${A.toExponential(3)} = ${p.toExponential(3)} Pa`
  };
}
function genKelvinConvert(){
  const c = [-40,-20,0,25,60,100][Math.floor(Math.random()*6)];
  const k = c + 273;
  return {
    prompt: `Convert ${c} °C to kelvin.`,
    answer: k,
    unitHint: "K",
    unitStrict: true,
    explanation:`Mark scheme:
T(K) = T(°C) + 273 = ${c} + 273 = ${k} K

Unit case matters (K, not k).`
  };
}
function genCelsiusConvert(){
  const k = [240,250,273,300,330,350,400][Math.floor(Math.random()*7)];
  const c = k - 273;
  return {
    prompt: `Convert ${k} K to degrees Celsius.`,
    answer: c,
    unitHint: "degC",
    unitStrict: true,
    explanation:`Mark scheme:
T(°C) = T(K) − 273 = ${k} − 273 = ${c} °C

Accepted units: °C or degC.`
  };
}
function genKERatio(){
  const t1 = [200,250,300,400][Math.floor(Math.random()*4)];
  const t2 = [500,600,700,800][Math.floor(Math.random()*4)];
  const ratio = t2/t1;
  return {
    prompt: `The Kelvin temperature changes from ${t1} K to ${t2} K. By what factor does the average kinetic energy change? (Number only.)`,
    answer: ratio,
    unitHint: "",
    explanation:`Mark scheme:
Average KE ∝ Kelvin temperature, so factor = T₂/T₁ = ${t2}/${t1} = ${ratio.toPrecision(4)}`
  };
}

// Bank
const BANK = [
  {id:"u_pa_def", type:"mcq", difficulty:"easy", tags:["units"], prompt:"One pascal (Pa) is equal to:", choices:["1 N × m²","1 N / m²","1 J / s","1 kg / m²"], answerIndex:1, explanation:"Pressure = force / area. So 1 Pa = 1 N per m²."},
  {id:"u_pressure_unit", type:"mcq", difficulty:"easy", tags:["units"], prompt:"Which is the unit of pressure?", choices:["newton (N)","pascal (Pa)","joule (J)","kilogram (kg)"], answerIndex:1, explanation:"Pressure is measured in pascals (Pa)."},
  {id:"u_force_unit", type:"mcq", difficulty:"easy", tags:["units"], prompt:"Which is the unit of force?", choices:["Pa","N","W","m²"], answerIndex:1, explanation:"Force is measured in newtons (N). (Unit symbols are case-sensitive.)"},
  {id:"u_area_unit", type:"mcq", difficulty:"easy", tags:["units"], prompt:"Which is the unit of area?", choices:["m","m²","m³","m/s"], answerIndex:1, explanation:"Area is measured in square metres (m²)."},

  {id:"p_formula", type:"short", difficulty:"easy", tags:["pressure_calc","units"], prompt:"State the formula linking pressure, force and area.", marks:1,
    markPoints:[{any:["p=f/a","p = f / a","pressure = force/area","pressure = force / area","p = force / area","force per unit area"]}],
    explanation:"Expected: p = F/A."
  },

  {id:"p_calc_cm2", type:"numeric", difficulty:"med", tags:["pressure_calc"], generator: genPressureCalc},
  {id:"p_calc_mm2", type:"numeric", difficulty:"hard", tags:["pressure_calc"], generator: genPressure_mm2},
  {id:"p_force_from_p", type:"numeric", difficulty:"med", tags:["pressure_calc"], generator: genForceFromPressure},
  {id:"p_net_force", type:"numeric", difficulty:"hard", tags:["pressure_calc","expand_contract"], generator: genNetPressureForce},
  {id:"p_piston", type:"numeric", difficulty:"hard", tags:["pressure_calc"], generator: genPiston},

  {id:"p_snowshoes_mcq", type:"mcq", difficulty:"easy", tags:["pressure_qual"],
    prompt:"Why do snowshoes help you avoid sinking into snow?",
    choices:["They increase your weight so you sink less","They increase contact area, so pressure on the snow is smaller","They decrease friction, so you slide on top","They warm the snow so it supports you"],
    answerIndex:1, explanation:"Same weight (force) over larger area gives smaller pressure: p = F/A."
  },
  {id:"p_sharp_knife_mcq", type:"mcq", difficulty:"easy", tags:["pressure_qual"],
    prompt:"Why does a sharp knife cut better than a blunt knife?",
    choices:["A sharp knife has a larger contact area, so pressure is smaller","A sharp knife has a smaller contact area, so pressure is larger","A sharp knife makes the force smaller","A sharp knife increases the mass of the food"],
    answerIndex:1, explanation:"Smaller area gives larger pressure for the same force: p = F/A."
  },
  {id:"p_stiletto_short", type:"short", difficulty:"med", tags:["pressure_qual"],
    prompt:"Explain why a stiletto heel can damage a wooden floor more than a flat shoe, even if the person’s weight is the same.",
    marks:3,
    markPoints:[
      {any:["same force","same weight","force is the same","weight is the same"]},
      {any:["smaller area","smaller contact area","less area","tiny area"]},
      {any:["p=f/a","pressure = force/area","pressure increases","higher pressure","greater pressure"]}
    ],
    explanation:
`Mark points:
• Same force/weight.
• Smaller contact area.
• p = F/A so pressure is larger, so it is more likely to damage the floor.`
  },

  {id:"plane_window_short", type:"short", difficulty:"hard", tags:["pressure_qual","pressure_calc"],
    prompt:"An aircraft window has air pressure acting on both sides. Explain why you must use a pressure difference (not just the inside pressure) when finding the net force on the window.",
    marks:3,
    markPoints:[
      {any:["pressure acts on both sides","both sides","inside and outside"]},
      {any:["forces in opposite directions","opposite directions","one pushes in, one pushes out"]},
      {any:["net pressure difference","difference","subtract","resultant","net force"]}
    ],
    explanation:
`Mark points:
• Pressure acts on both sides of the window.
• The forces are in opposite directions.
• So you use Δp = p_inside − p_outside to find the net force: F = ΔpA.`
  },

  {id:"fluids_equal_short", type:"short", difficulty:"hard", tags:["fluids_equal"],
    prompt:"Explain why the pressure at a point in a liquid (or gas) at rest acts equally in all directions.",
    marks:3,
    markPoints:[
      {any:["random","move randomly","random motion"]},
      {any:["collide","collisions","hit surfaces","hit walls"]},
      {any:["all directions","equally in all directions","same in every direction","pressure is the same in all directions"]}
    ],
    explanation:
`Mark points:
• Particles move randomly.
• They collide with surfaces from all directions.
• So the average force per unit area is the same in every direction: pressure is equal in all directions.`
  },

  {id:"gas_pressure_walls", type:"short", difficulty:"med", tags:["gas_pressure"],
    prompt:"Explain how gas molecules exert a pressure on the walls of a container.",
    marks:3,
    gateAny:["wall","walls","container"],
    markPoints:[
      {any:["collide","hit","bounce","collisions"]},
      {any:["force","push","exert a force"]},
      {any:["pressure = force/area","p=f/a","force per unit area","pressure is force per area"]}
    ],
    explanation:
`Typical 3 marks:
1) Molecules collide with the walls.
2) This produces a force on the walls.
3) Pressure is force per unit area: p = F/A.`
  },

  {id:"can_collapse", type:"short", difficulty:"med", tags:["expand_contract","gas_pressure"],
    prompt:"A metal container is heated with a hole open, then sealed while hot and allowed to cool. It collapses inwards. Explain why.",
    marks:3,
    markPoints:[
      {any:["cool","cools","temperature decreases","temperature falls"]},
      {any:["particles move slower","molecules slower","lower speed","less kinetic energy"]},
      {any:["pressure inside decreases","lower pressure inside","outside pressure greater","higher pressure outside","net pressure inward","resultant force inward"]}
    ],
    explanation:
`Mark points:
• On cooling, gas particles slow down.
• They hit the walls less often/less hard so internal pressure drops.
• Outside air pressure is now greater -> net force inwards -> container collapses.`
  },

  {id:"k_0c_mcq", type:"mcq", difficulty:"easy", tags:["kelvin","units"],
    prompt:"Which temperature is the same as 0 °C?",
    choices:["−273 K","3 K","273 K","373 K"], answerIndex:2, explanation:"0 °C corresponds to 273 K."
  },
  {id:"k_convert_1", type:"numeric", difficulty:"easy", tags:["kelvin","units"], generator: genKelvinConvert},
  {id:"k_convert_2", type:"numeric", difficulty:"easy", tags:["kelvin","units"], generator: genCelsiusConvert},

  {id:"abs_zero_short", type:"short", difficulty:"hard", tags:["kelvin"],
    prompt:"Explain why there is an absolute zero of temperature (−273 °C).",
    marks:3,
    markPoints:[
      {any:["kelvin","absolute scale","absolute temperature"]},
      {any:["proportional to average kinetic energy","kelvin temperature is proportional to kinetic energy","temperature in kelvin proportional to average ke","ke proportional to kelvin"]},
      {any:["molecules stop moving","particles stop moving","minimum kinetic energy","cannot have less than zero kinetic energy","no random motion"]}
    ],
    explanation:
`Mark points:
• Kelvin is an absolute temperature scale.
• Kelvin temperature is proportional to average kinetic energy.
• At 0 K the average KE would be zero (no random motion). You cannot go below that.`
  },

  {id:"temp_speed_short", type:"short", difficulty:"med", tags:["gas_pressure","kelvin"],
    prompt:"Explain why an increase in temperature increases the average speed of gas molecules.",
    marks:2,
    markPoints:[
      {any:["kinetic energy increases","average kinetic energy increases","more kinetic energy","ke increases"]},
      {any:["speed increases","move faster","higher speed","average speed increases"]}
    ],
    explanation:
`Mark points:
• Higher temperature means higher average kinetic energy.
• Higher kinetic energy means higher average speed.`
  },

  {id:"ke_prop_short", type:"short", difficulty:"easy", tags:["kelvin"],
    prompt:"How is the average kinetic energy of gas molecules related to the Kelvin temperature?",
    marks:1,
    markPoints:[{any:["proportional","directly proportional","ke ∝ t","average kinetic energy is proportional to kelvin temperature"]}],
    explanation:"Expected: average kinetic energy is proportional to Kelvin temperature."
  },
  {id:"ke_ratio_numeric", type:"numeric", difficulty:"med", tags:["kelvin"], generator: genKERatio},

  {id:"pv_inverse_mcq", type:"mcq", difficulty:"easy", tags:["gaslaws"],
    prompt:"For a fixed amount of gas at constant temperature, if volume increases, pressure will:",
    choices:["increase","decrease","stay the same","become zero"], answerIndex:1,
    explanation:"At constant temperature, pressure and volume are inversely related."
  },

  {id:"pv_graph_mcq", type:"mcq", difficulty:"med", tags:["gaslaws"],
    prompt:"Which graph best represents pressure vs volume for a fixed amount of gas at constant temperature?",
    choices:[
      graphChoiceHTML("A) Straight line through origin", gLineThroughOrigin(), "V", "P"),
      graphChoiceHTML("B) Straight line not through origin", gLineNotThroughOrigin(), "V", "P"),
      graphChoiceHTML("C) Curve decreasing and flattening", gPVInverseCurve(), "V", "P"),
      graphChoiceHTML("D) Curve increasing and flattening", gPVWrongIncreasingFlatten(), "V", "P"),
    ],
    answerIndex:2,
    explanation:"Constant temperature: as volume increases, collisions with the walls are less frequent, so pressure decreases (a curve, not a straight line)."
  },

  {id:"pv_explain_particles", type:"short", difficulty:"hard", tags:["gaslaws"],
    prompt:"Explain (in terms of particles) why decreasing the volume of a gas at constant temperature increases its pressure.",
    marks:4,
    gateAny:["wall","walls","container","syringe"],
    markPoints:[
      {any:["walls closer","less distance","smaller volume","compressed"]},
      {any:["more frequent collisions","collide more often","hit walls more often","collision frequency increases"]},
      {any:["greater average force","more force","bigger force on walls","force increases"]},
      {any:["pressure increases","p=f/a","force per unit area increases"]}
    ],
    explanation:
`Mark points:
• Smaller volume -> walls closer.
• Molecules hit walls more often.
• Average force on walls increases.
• p = F/A so pressure increases.

Mark-scheme trap: must talk about collisions with the walls.`
  },

  {id:"pt_prop_mcq", type:"mcq", difficulty:"easy", tags:["gaslaws","kelvin"],
    prompt:"For a fixed amount of gas at constant volume, pressure is proportional to:",
    choices:["temperature in °C","temperature in K","volume","area"], answerIndex:1,
    explanation:"At constant volume, pressure is proportional to Kelvin temperature."
  },

  {id:"pt_graph_mcq", type:"mcq", difficulty:"med", tags:["gaslaws","kelvin"],
    prompt:"Which graph best represents pressure vs temperature (K) for a fixed amount of gas at constant volume?",
    choices:[
      graphChoiceHTML("A) Curve through origin", gCurveThroughOrigin(), "T / K", "P"),
      graphChoiceHTML("B) Straight line through origin", gLineThroughOrigin(), "T / K", "P"),
      graphChoiceHTML("C) Straight line not through origin", gLineNotThroughOrigin(), "T / K", "P"),
      graphChoiceHTML("D) Decreasing line", gDecreasingLine(), "T / K", "P"),
    ],
    answerIndex:1,
    explanation:"At constant volume, pressure is directly proportional to Kelvin temperature: straight line through the origin."
  },

  {id:"pt_explain_particles", type:"short", difficulty:"hard", tags:["gaslaws","gas_pressure"],
    prompt:"Explain (in terms of particles) why increasing the Kelvin temperature of a gas at constant volume increases its pressure.",
    marks:4,
    gateAny:["wall","walls","container"],
    markPoints:[
      {any:["kinetic energy increases","more kinetic energy","ke increases"]},
      {any:["move faster","higher speed","speed increases"]},
      {any:["more frequent collisions","hit walls more often","collide more often","collision frequency increases"]},
      {any:["hit harder","greater force","more force on walls","average force increases","pressure increases","p=f/a"]}
    ],
    explanation:
`Mark points:
• Higher temperature -> higher average kinetic energy.
• Molecules move faster.
• They collide with walls more often (and more forcefully).
• Average force on walls increases -> p = F/A -> pressure increases.`
  },

  {id:"abs_zero_graph", type:"mcq", difficulty:"med", tags:["kelvin","gaslaws"],
    prompt:"Extrapolating a pressure–temperature (°C) line to zero pressure gives about −273 °C. This represents:",
    choices:["the boiling point of water","absolute zero","room temperature","the melting point of ice"],
    answerIndex:1, explanation:"Extrapolated zero pressure corresponds to 0 K, i.e. absolute zero."
  }
];

function getSelectedTopics(){
  return Array.from(document.querySelectorAll(".topicCb")).filter(cb=>cb.checked).map(cb=>cb.value);
}
function applyDifficultyFilter(list, mix){
  if(mix === "all") return list;
  if(mix === "easy") return list.filter(q => q.difficulty==="easy" || q.difficulty==="med");
  if(mix === "med") return list.filter(q => q.difficulty!=="easy");
  if(mix === "hard") return list.filter(q => q.difficulty==="hard");
  return list;
}
function buildPool(){
  const topics = getSelectedTopics();
  let pool = BANK.filter(q => q.tags.some(t => topics.includes(t)));
  pool = applyDifficultyFilter(pool, els.diffMix.value);
  return pool;
}
function expandQuestion(q){
  if(typeof q.generator === "function"){
    const inst = q.generator();
    return {...q, ...inst};
  }
  return {...q};
}

function qMaxMarks(q){
  if(Number.isFinite(q.marks)) return q.marks;
  if(Array.isArray(q.markPoints)) return q.markPoints.length;
  return 1;
}

let currentSet = [];
let answered = new Map();

function totalMaxMarks(){
  return currentSet.reduce((s,q)=> s + qMaxMarks(q), 0);
}
function totalScore(){
  let s=0;
  for(const v of answered.values()) if(v.checked) s += (v.score ?? 0);
  return s;
}

function renderKPIs(){
  const vals = Array.from(answered.values());
  const checked = vals.filter(x => x.checked).length;
  const full = vals.filter(x => x.checked && x.status==="full").length;
  const partial = vals.filter(x => x.checked && x.status==="partial").length;
  const wrong = vals.filter(x => x.checked && x.status==="wrong").length;

  els.kpiChecked.textContent = checked;
  els.kpiFull.textContent = full;
  els.kpiPartial.textContent = partial;
  els.kpiWrong.textContent = wrong;

  const max = totalMaxMarks();
  const s = totalScore();
  els.scoreLine.textContent = max ? `${s.toFixed(1)} / ${max}` : "-";
  els.summaryLine.innerHTML = currentSet.length
    ? `<b>${full}</b> full, <b>${partial}</b> partial, <b>${wrong}</b> wrong, <b>${currentSet.length-checked}</b> unchecked.`
    : "Start a set to begin.";
}

function renderChoice(q, idx){
  const name = `q_${q._instanceId}`;
  return `
    <label class="choice">
      <input type="radio" name="${name}" value="${idx}" />
      <div class="choiceText">${q.choices[idx]}</div>
    </label>`;
}

function renderQuestionCard(q, index){
  const qnum = index+1;
  const tags = q.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("");
  let inputHTML = "";
  if(q.type==="mcq"){
    inputHTML = q.choices.map((_,i)=>renderChoice(q,i)).join("") + `<div style="margin-top:8px;"><button class="btn" data-action="check" data-qid="${q._instanceId}">Check</button></div>`;
  } else {
    const ph = q.type==="numeric" ? "Type a number (include units if you can)" : "Type your answer…";
    inputHTML = `<div class="answerbox">
      <input type="text" id="in_${q._instanceId}" placeholder="${ph}" />
      <button class="btn" data-action="check" data-qid="${q._instanceId}">Check</button>
    </div>`;
  }
  return `
  <div class="qcard" id="card_${q._instanceId}">
    <div class="qhead">
      <div>
        <div class="qnum">Q${qnum} • ${qMaxMarks(q)} mark${qMaxMarks(q)===1?"":"s"}</div>
        <div class="qtext">${q.prompt}</div>
      </div>
      <div class="tags">${tags}</div>
    </div>
    ${inputHTML}
    <div id="fb_${q._instanceId}"></div>
  </div>`;
}

function renderQuiz(){
  els.quiz.innerHTML = currentSet.map(renderQuestionCard).join("");
  renderKPIs();
  els.statusPill.textContent = "In progress";
  els.newSetBtn.disabled = false;
  els.revealAllBtn.disabled = false;
}

function getMCQSelection(q){
  const name = `q_${q._instanceId}`;
  const sel = document.querySelector(`input[name="${name}"]:checked`);
  return sel ? Number(sel.value) : null;
}
function textIncludesAny(t, arr){ return arr.some(x => t.includes(norm(x))); }

function checkShortMarkPoints(q, raw){
  const t = norm(raw);
  if(q.gateAny && q.gateAny.length){
    const gateOk = q.gateAny.some(x => t.includes(norm(x)));
    if(!gateOk){
      return {score:0, max:qMaxMarks(q), status:"wrong", reason:"AUTO-MARK: you did not mention collisions with the walls/container, so the mark scheme would likely award 0."};
    }
  }
  const points = q.markPoints || [];
  let got = 0;
  const missing = [];
  for(const mp of points){
    if(mp.any){
      const ok = textIncludesAny(t, mp.any);
      if(ok) got += 1; else missing.push(mp.any[0]);
    }
  }
  const max = qMaxMarks(q);
  const status = (got===0) ? "wrong" : (got===max ? "full" : "partial");
  return {score:got, max, status, missing};
}

function checkNumeric(q, raw){
  const parsed = parseQuantity(raw);
  if(!parsed.ok) return {checked:false, msg:"Enter a number (you can add units)."};

  const exp = expectedUnitInfo(q.unitHint || "");
  const unitStrict = !!q.unitStrict;
  const max = qMaxMarks(q);

  let studentInExpected = parsed.num;
  let unitMsg = "";

  function convertTemp(value, fromType, toType){
    if(fromType === toType) return value;
    if(fromType === "tempC" && toType === "tempK") return value + 273;
    if(fromType === "tempK" && toType === "tempC") return value - 273;
    return value;
  }

  if(exp){
    if(parsed.unitPresent){
      if(exp.type.startsWith("temp") && parsed.unitType && parsed.unitType.startsWith("temp")){
        studentInExpected = convertTemp(parsed.num, parsed.unitType, exp.type);

        if(exp.canonical === "K" && parsed.unitCaseOk === false){
          unitMsg = "Unit case matters: use K (capital), not k.";
        } else if(unitStrict){
          const want = exp.canonical;
          const used = parsed.unitCanonical || parsed.unitToken;
          if(want && used && norm(want) !== norm(used)){
            unitMsg = `Unit: you used ${used}, but the question asked for ${want}.`;
          }
        }
      } else if(parsed.unitType === exp.type && parsed.unitFactor !== null){
        const studentSI = parsed.num * parsed.unitFactor;
        studentInExpected = studentSI / exp.factor;

        if(exp.canonical === "K" && parsed.unitCaseOk === false){
          unitMsg = "Unit case matters: use K (capital), not k.";
        } else if(unitStrict){
          const want = exp.canonical || exp.token;
          const used = parsed.unitCanonical || parsed.unitToken;
          if(want && used && norm(want) !== norm(used)){
            unitMsg = `Unit: you used ${used}, but the question asked for ${want}.`;
          }
        }
      } else {
        if(parsed.unitType === "tempK" && exp.type === "tempK" && parsed.unitCaseOk === false){
          unitMsg = "Unit case matters: use K (capital), not k.";
        } else {
          unitMsg = "Unit looks wrong for this quantity.";
        }
      }
    } else {
      unitMsg = "Unit missing.";
    }
  }

  const trueVal = q.answer;
  const rm = roundingMatch(studentInExpected, trueVal, parsed.numStr);
  const okNumeric = rm.ok;
  const badRound = okNumeric ? null : closeButBadRounding(studentInExpected, trueVal, parsed.numStr, q.relTol ?? 0.03);

  const unitNeeded = !!exp;
  const unitOkForFull = (!unitNeeded) ? true : (parsed.unitPresent && unitMsg === "");

  let status = "wrong";
  let score = 0;
  let reason = "";

  if(okNumeric && unitOkForFull){
    status = "full"; score = max;
  } else if(okNumeric && unitNeeded){
    status = "partial"; score = max/2;
    if(!parsed.unitPresent) reason = "Number is correct, but the unit is missing.";
    else reason = "Number is correct, but the unit is not acceptable (or wrong case).";
  } else if(badRound){
    status = "partial"; score = max/2;
    const tgtStr = fmtRounded(badRound.target, {dp: badRound.dp, sf: badRound.sf});
    reason = `Close, but rounding is off. To ${badRound.basis}, it should be ${tgtStr}. ${badRound.hint}`;
  }

  return {checked:true, status, score, max, reason, unitMsg, answerRaw: raw};
}

function checkQuestion(q){
  if(q.type==="mcq"){
    const sel = getMCQSelection(q);
    if(sel === null) return {checked:false, msg:"Choose an option first."};
    const correct = sel === q.answerIndex;
    const max = qMaxMarks(q);
    return {checked:true, status: correct ? "full" : "wrong", score: correct ? max : 0, max, answerRaw: String(sel)};
  }
  if(q.type==="numeric"){
    const input = document.getElementById(`in_${q._instanceId}`);
    return checkNumeric(q, input ? input.value : "");
  }
  if(q.type==="short"){
    const input = document.getElementById(`in_${q._instanceId}`);
    const raw = input ? input.value : "";
    if(!raw.trim()) return {checked:false, msg:"Type an answer first."};
    const out = checkShortMarkPoints(q, raw);
    return {checked:true, ...out, answerRaw: raw};
  }
  return {checked:false, msg:"Unsupported question type."};
}

function formatCorrectLine(q){
  if(q.type==="mcq") {
    const raw = q.choices[q.answerIndex];
    const stripped = raw.replace(/<[^>]*>/g,'').trim();
    return `Correct answer: ${stripped || ("Option " + String.fromCharCode(65+q.answerIndex))}`;
  }
  if(q.type==="numeric"){
    const a = q.answer;
    const rounded = (Math.abs(a) >= 1000 || Math.abs(a) < 0.01) ? a.toExponential(3) : a.toPrecision(4);
    const unitShow = q.unitHint ? (q.unitHint === "degC" ? "°C" : q.unitHint) : "";
    return `Correct answer: ${rounded}${unitShow ? " " + unitShow : ""}`;
  }
  if(q.type==="short"){
    return `Mark scheme: ${qMaxMarks(q)} point(s).`;
  }
  return "";
}

function showFeedback(q, outcome){
  const fb = document.getElementById(`fb_${q._instanceId}`);
  if(!fb) return;

  if(!outcome.checked){
    fb.innerHTML = `<div class="feedback bad"><div class="title">Not checked</div><p class="explain">${escapeHtml(outcome.msg)}</p></div>`;
    return;
  }

  const correctLine = formatCorrectLine(q);
  const good = outcome.status === "full";
  const partial = outcome.status === "partial";
  const title = good ? "Correct" : (partial ? "Partly correct" : "Not quite");
  const cls = good ? "good" : (partial ? "" : "bad");

  let diag = "";
  if(q.type==="short" && q.markPoints){
    diag += "AUTO-MARKING NOTE: This long-answer question has been marked only by checking for keyword/phrase presence. You must self-check for full quality and missing ideas.\n\n";
  }
  if(outcome.unitMsg) diag += outcome.unitMsg + "\n";
  if(outcome.reason) diag += outcome.reason + "\n";
  if(q.type==="short" && q.markPoints && outcome.status !== "full"){
    if(outcome.missing && outcome.missing.length){
      diag += `Missing ideas (examples): ${outcome.missing.slice(0,3).join("; ")}\n`;
    }
  }

  const explainText = (diag ? (diag + "\n") : "") + (q.explanation || "");
  const open = !good;

  fb.innerHTML = `
    <div class="feedback ${cls}">
      <div class="title">${title} (${(outcome.score??0).toFixed(1)} / ${(outcome.max??qMaxMarks(q)).toFixed(1)} marks)</div>
      <p class="explain">${escapeHtml(correctLine)}</p>
      <details ${open ? "open" : ""}>
        <summary>${good ? "Show explanation" : "Explanation (mark-scheme style)"}</summary>
        <p class="model">${escapeHtml(explainText)}</p>
      </details>
    </div>`;
}

function updateSetFromUI(){
  const pool = buildPool();
  const n = Number(els.numQ.value);
  if(pool.length < 1){
    els.quiz.innerHTML = `<div class="hint">No questions available — select at least one topic.</div>`;
    return false;
  }
  const chosen = shuffle(pool).slice(0, clamp(n, 5, pool.length)).map(expandQuestion);
  const now = Date.now().toString(36);
  currentSet = chosen.map((q,i)=> ({...q, _instanceId:`${q.id}_${now}_${i}`}));
  answered = new Map();
  renderQuiz();
  return true;
}

els.startBtn.addEventListener("click", async () => {
  const cls = (els.classId.value || "").trim();
  if(user) await setUserClass(cls);
  updateSetFromUI();
});
els.newSetBtn.addEventListener("click", async () => {
  const cls = (els.classId.value || "").trim();
  if(user) await setUserClass(cls);
  updateSetFromUI();
});
els.revealAllBtn.addEventListener("click", () => {
  currentSet.forEach(q => {
    const fb = document.getElementById(`fb_${q._instanceId}`);
    let expl = q.explanation || "";
    if(q.type==="short" && q.markPoints) expl = "AUTO-MARKING NOTE: Marked by keywords only. Self-check needed.\n\n" + expl;
    fb.innerHTML = `
      <div class="feedback">
        <div class="title">Mark scheme</div>
        <p class="explain">${escapeHtml(formatCorrectLine(q))}</p>
        <details open>
          <summary>Explanation</summary>
          <p class="model">${escapeHtml(expl)}</p>
        </details>
      </div>`;
  });
  els.statusPill.textContent = "Revealed";
});

els.quiz.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action='check']");
  if(!btn) return;
  const qid = btn.getAttribute("data-qid");
  const q = currentSet.find(x => x._instanceId === qid);
  if(!q) return;

  const outcome = checkQuestion(q);
  showFeedback(q, outcome);

  if(outcome.checked){
    answered.set(q._instanceId, {checked:true, status:outcome.status, score: outcome.score, max: outcome.max ?? qMaxMarks(q)});
    renderKPIs();

    try{
      await writeAttempt({
        questionId: q.id,
        tags: q.tags,
        status: outcome.status,
        score: outcome.score,
        max: outcome.max ?? qMaxMarks(q),
        kind: q.type,
        answerRaw: outcome.answerRaw ?? null
      });
    } catch(err){
      console.error(err);
      els.savePill.textContent = "Save failed (check console)";
    }
  }
});

// initial UI
renderKPIs();
