/* chatbot.js · 두당 AI 챗봇 · 저장: 2026-11-03 03:17 KST · v108[파일 2개 비교]: 엑셀/CSV 2개 첨부 시 이력번호(개체식별) 기준 자동 비교 — 🟢추가된 소(이후 신규=구입/편입)·🔴없어진 소(판매/도태/폐사)·⚪유지, 합계검증·품종/성별 표시·비교결과 엑셀(추가/없어진/유지 시트) 다운로드. findKeyCol(헤더 이력/개체/번호 또는 9~15자리 숫자 열 자동), 첨부순=이전→이후. 브라우저 내 처리(외부 전송 없음). v107[파일분석 PDF 추가]: 📎에 PDF 지원 — pdf.js(3.11.174)로 브라우저 내 텍스트 추출(페이지별·숫자/금액 추출·텍스트 다운로드/복사). 스캔(이미지)PDF면 텍스트없음 감지→'이미지 OCR 필요' 안내. 여전히 외부 전송 없음. v106[파일분석 1차·브라우저내 처리]: 📎 첨부(엑셀xlsx/xls·CSV, 최대3개·10MB)→SheetJS로 브라우저 안에서만 분석(파일·숫자를 OpenAI 등 외부로 전송 안 함). 시트별 표 미리보기+열별 합계/평균/건수/누락·중복행·단위추출, xlsx/CSV 다운로드(집계시트 포함). 첨부 있으면 doSend가 analyzeFiles로 분기(OpenAI 미경유). PDF·이미지 OCR은 다음 단계. v105[통계 라우팅 키워드]: 질문탭 통계 자동라우팅에 '공표자료·코시스·kosis' 추가(대소문자무관). (신규 페이지 chukbi_stats.html 축비공표자료 조회는 index 카드) v104[소이력 판매정리·조사표 자동작성]: 소이력 조회결과 기억(lastTrace). 이후 '판매금액 ○○, 판매비용 ○○ (구입금액·구입체중)' 입력하면 실판매금액·실구입·두당평균사육일수·일당증체량(=(추정생체중−구입체중)÷사육일수) 정리 + [📝 조사표 ②에 입력] 버튼. 핸드오프는 축종힌트(육우→beef/한우→비육우)·사육구분힌트(출하개월)·구입당시(buy) 포함→survey.html ② 비육완료 both 행 자동(사육일수·일당증체 자동계산). 금액파서 억/만/콤마. v103[탭 합치기·소이력 전체정보]: (A)💬일반+📊통계 → '💬 질문'(통계·체중 포함) 1탭으로 통합, 질문탭에서 통계성 질의(looksLikeStats)면 자동 mode:stats, 아니면 일반. 조사표 탭은 분리. (B)소이력 조회를 전체필드로 확장 — 품종·성별·출생·신고/이동·구입일·구입개월령·사육개월수·도축일·출하개월수·육질등급·검사결과·도축장·주소·도체중량·도체율(품종성별자동)·추정생체중량(도체중÷도체율). 판매금액·조사표자동작성은 다음단계 안내. v102[소이력 조회·개인정보보호]: 이력번호(12자리 또는 410+12) 감지 시 OpenAI로 안 보내고 축산물이력제 API(TRACE_URL, cattle.html과 동일)로만 조회→품종·성별·출생·도축·등급·도체중·이동 요약. 모든 탭 공통(doSend 최상단). 전화11·금액·주민13자리는 미감지. v99[B확장 ①사육현황]: [📝 조사표에 입력] 버튼을 ②구입판매 외 ①사육현황(livestock_status) handoff에도 표시. 서버 Lambda v11가 ① 증감종류(분만/구입/판매/도태/폐사)+두수 handoff 제공. +③ 축산물판매수입(product_sales_income, Lambda v12 계란/유대) 버튼도 표시. v98[플로팅 위젯·내질문 복사]: 모든 페이지 우측하단 🐮 AI 버튼(js/ai_widget.js)→팝업 iframe(chatbot.html?embed=1)로 어디서나 질문. EMBED 모드 감지(?embed=1 또는 iframe내)→[📝 조사표에 입력] 누르면 부모창에 postMessage(dudang-ai-handoff)→조사표 페이지면 그 자리서 미리보기, 아니면 survey.html 이동. 내가 질문한 메시지(me)에도 📋 복사 버튼 추가. v97[B-1 조사표 핸드오프]: 조사표(②) 답변에 [📝 조사표에 입력] 버튼(st.handoff 있을 때만) → handoff를 localStorage(dudang_ai_handoff)에 기록 후 survey.html 이동(조사표에서 미리보기·확인 후 ②원장 입력). 서버 Lambda v10가 survey 결과에 handoff 블록 제공. v96[통계·체중 조회]: [📊 통계·체중] 모드 추가(chatMode chat/survey/stats), mode:stats 전송→서버가 데이터에서 조회(숫자 서버조회)·KOSIS 원문 링크. v95[스크롤·A단계보강]: scrollDown이 <main>을 스크롤(새 답변시 항상 맨아래 이동, requestAnimationFrame). v94[A단계 조사표 작성모드]: [일반질문/조사표 작성] 토글, 조사표 질문→서버가 구조화JSON+프로그램 재계산→표 답변(부호·구분·수량·금액·실금액·연계·신뢰도). 데이터 survey_schema.json. v93[대화기록·복사·UI]: 대화 '대화별' 로컬저장(dudangAI_sessions, 목록·날짜시간·열기/복사/삭제, 🕘 기록 모달), AI답변·대화 복사(토스트), 새대화시 이전대화 기록유지, 음성 아이콘 SVG·입력창 자동확장 160px. v92[음성 녹음→Whisper전사]: 음성입력을 MediaRecorder 녹음→RELAY_URL(body.audio base64)→서버 Whisper 전사→텍스트 입력으로 교체(iOS Safari의 Web Speech 미지원 해결). 미지원/권한거부 안내. v91[관리버튼·음성(구)·로컬기록]: 🎤 음성입력(SpeechRecognition ko-KR, 지원시만), 대화 기기내 로컬저장(dudangAI_chatHistory·서버저장 안함·새대화시 삭제·복원), 관리자(role=admin)만 '👤 관리'→members.html 노출(chatbot.html 모듈). v90[접근제어]: 전송 시 Firebase ID토큰 첨부(window.__dudangAuth.getToken) → 서버 승인검증. 게이트는 chatbot.html 모듈 스크립트. v89[조사표 부호 연동]: 답변 참고자료에 '🔢 조사표 부호' 링크 추가(buildMeta codes 매핑·중복제거). 서버(Lambda v4)가 codes.json으로 부호 근거 제공. v88[PWA 헤더 수정]. v87[3단계 연결완료]: RELAY_URL에 aws_dudang_ai 함수 URL 입력 → 실제 OpenAI 답변 연결. (AWS 검증완료: 빈질문400·개인정보차단·OpenAI한국어답변200). v86[3단계 연결준비]: 서버 전송 history를 '현재 질문 제외 이전 맥락'으로 정정(서버가 뒤에 현재 질문 추가 → 중복 방지). v85[신규·2단계 화면]
   역할: 챗봇 화면 동작 + 1차(클라이언트) 개인정보 차단 + 질문 전송/답변 표시.
   원칙(개발 시나리오 B안·9장·10장):
   - AI API 키/모델은 이 파일에 없습니다. AWS Lambda(환경변수)에서만 사용합니다.
   - RELAY_URL(아래)만 AWS 배포 후 입력하면 실제 OpenAI 답변으로 전환됩니다. 비어 있으면 '목(mock)' 화면 모드.
   - 개인정보 검사는 여기(브라우저)에서 1차로 하고, AWS Lambda에서 반드시 2차로 다시 검사합니다(서버 검사 생략 금지).
   - 조사표 농가자료(localStorage dudang_* 키)는 절대 읽지 않습니다. 공개 JSON만 사용합니다.
   - 대화기록은 이 페이지를 보는 동안 메모리에만 유지하고, '새 대화'를 누르면 삭제합니다(서버 저장 안 함). */
(function () {
  "use strict";

  // ── 환경설정 (AWS Lambda Function URL 배포 후 아래 주소만 입력) ──
  // 배포 방법: aws_dudang_ai/README_AWS_배포가이드.md 참고. 예: "https://xxxxx.lambda-url.ap-northeast-2.on.aws/"
  var RELAY_URL = "https://qx67d6axk27bv7enlvtveqe5fm0dhask.lambda-url.ap-northeast-2.on.aws/";                 // ★ 비우면 '연동 준비 중'(목 모드). AWS 배포 후 함수 URL 입력 → 실제 OpenAI 답변.
  // 플로팅 위젯(다른 페이지의 iframe) 안에서 열렸는지: 조사표 핸드오프를 부모창으로 전달
  var EMBED = (/[?&]embed=1/.test(location.search)) || (function () { try { return window.self !== window.top; } catch (e) { return true; } })();
  // 소 축산물이력제 조회 API(cattle.html과 동일). ★개인정보 보호: 이력번호는 이 정부 이력제 API로만 가고 OpenAI로는 안 보냄.
  var TRACE_URL = "https://r2vnmzx2rnwirfazkzvugdyqne0vljcr.lambda-url.ap-northeast-2.on.aws";
  var MAX_CHARS = 500;                // 질문 최대 길이(시나리오 10.2)
  var REQUEST_TIMEOUT_MS = 30000;     // 응답 타임아웃

  // 추천 질문(시나리오 4.3)
  var SUGGESTIONS = [
    "🐂 한우 거세우 산지가격 알려줘.",
    "📖 TMR과 TMF의 차이는 무엇인가요?",
    "📋 축산물생산비조사에서 사료비는 어떻게 조사하나요?",
    "🐷 돼지 가축동향조사에서 사육두수는 어떻게 계산하나요?",
    "🐔 산란계와 육계의 차이를 알려줘.",
    "💰 한우 생체중 750kg의 참고가격을 계산해 줘."
  ];

  var $ = function (id) { return document.getElementById(id); };
  var logEl, qEl, sendEl, cntEl, statusEl, introEl, suggEl, micEl;
  var busy = false;
  var chatMode = "chat";    // chat | survey(조사표 작성) | stats(통계·체중)

  // ── 대화 기록: '기기 내(브라우저)'에만 '대화별'로 저장. 서버 저장 안 함.
  //    목록·날짜/시간·복사 지원. 새 대화를 눌러도 이전 대화는 기록에 남음. 조사표(dudang_*) 자료는 읽지 않음(별도 키).
  var SESS_KEY = "dudangAI_sessions";   // [{id, ts(생성), upd(갱신), title, msgs:[{role:'me'|'ai', text, meta}]}]
  var ACT_KEY = "dudangAI_active";
  var MAX_SESS = 40;
  var _restoring = false;
  var activeId = "";
  function loadSessions() { try { var a = JSON.parse(localStorage.getItem(SESS_KEY) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function saveSessions(a) { try { localStorage.setItem(SESS_KEY, JSON.stringify(a.slice(0, MAX_SESS))); } catch (e) {} }
  function saveActive() { try { localStorage.setItem(ACT_KEY, activeId || ""); } catch (e) {} }
  function getActive() { if (!activeId) return null; var a = loadSessions(); for (var i = 0; i < a.length; i++) if (a[i].id === activeId) return a[i]; return null; }
  function recordMsg(role, text, meta) {
    if (_restoring || (role !== "me" && role !== "ai")) return;
    var a = loadSessions(), s = null, i;
    for (i = 0; i < a.length; i++) if (a[i].id === activeId) { s = a[i]; break; }
    if (!s) { s = { id: "s" + Date.now() + Math.random().toString(16).slice(2, 6), ts: Date.now(), upd: Date.now(), title: "", msgs: [] }; activeId = s.id; saveActive(); }
    else a = a.filter(function (x) { return x.id !== s.id; });
    s.msgs.push({ role: role, text: text, meta: meta || "" });
    if (role === "me" && !s.title) s.title = text.replace(/\s+/g, " ").trim().slice(0, 40);
    s.upd = Date.now();
    a.unshift(s);
    saveSessions(a);
  }
  function activeHistory() { var s = getActive(); if (!s) return []; return s.msgs.map(function (m) { return { role: m.role === "me" ? "user" : "assistant", content: m.text }; }); }
  function restoreActive() {
    try { activeId = localStorage.getItem(ACT_KEY) || ""; } catch (e) { activeId = ""; }
    var s = getActive();
    if (!s || !s.msgs.length) return;
    _restoring = true;
    s.msgs.forEach(function (m) { addMsg(m.role, m.text, m.meta || ""); });
    _restoring = false;
  }

  // ── 1차 개인정보 검사 (구조적 식별자 정규식) ──
  // ※ 정규식만으로 모든 개인정보를 잡을 수 없으므로 AWS Lambda에서 2차 검사·차단을 반드시 수행합니다.
  // 앞뒤 숫자 경계: (?:^|\D) 접두 + (?!\d) 접미 → 더 긴 숫자열(주민/이력 등) 안에서 전화번호로 오탐하지 않음.
  // ※ 과거 iOS Safari 호환을 위해 lookbehind는 쓰지 않습니다. loose(계좌 추정)는 다른 식별자가 없을 때만 표시.
  var PII_RULES = [
    { name: "전화번호",      re: /(?:^|\D)(?:01[016789]|0\d{1,2})[-\s.)]?\d{3,4}[-\s.]?\d{4}(?!\d)/ },
    { name: "주민등록번호",   re: /(?:^|\D)\d{6}[-\s]?[1-4]\d{6}(?!\d)/ },
    { name: "사업자등록번호",  re: /(?:^|\D)\d{3}[-\s]?\d{2}[-\s]?\d{5}(?!\d)/ },
    { name: "가축이력(식별)번호", re: /(?:^|\D)(?:410)?\d{12}(?!\d)/ },   // 12자리 또는 410+12자리
    { name: "이메일",        re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/ },
    { name: "계좌번호(추정)",  re: /(?:^|\D)\d{2,6}[-\s]\d{2,6}[-\s]\d{2,7}(?:[-\s]\d{1,7})?(?!\d)/, loose: true }
  ];
  function screenPII(text) {
    var hits = [], structured = false;
    for (var i = 0; i < PII_RULES.length; i++) {
      if (PII_RULES[i].re.test(text)) {
        if (PII_RULES[i].loose && structured) continue;  // 전화·주민·사업자 등이 이미 잡혔으면 계좌(추정) 중복표시 안 함
        hits.push(PII_RULES[i].name);
        if (!PII_RULES[i].loose) structured = true;
      }
    }
    return { blocked: hits.length > 0, reasons: hits };
  }

  // ── 렌더 ──
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hideIntro() { if (introEl) introEl.style.display = "none"; }
  function scrollDown() {
    // 실제 스크롤 영역은 <main>. 새 메시지/답변이 추가되면 항상 맨 아래로 이동.
    var m = document.getElementById("main");
    requestAnimationFrame(function () {
      try {
        if (m && m.scrollHeight > m.clientHeight + 2) { m.scrollTo ? m.scrollTo({ top: m.scrollHeight, behavior: "smooth" }) : (m.scrollTop = m.scrollHeight); }
        else { window.scrollTo(0, document.body.scrollHeight); }
      } catch (e) { try { if (m) m.scrollTop = m.scrollHeight; else window.scrollTo(0, document.body.scrollHeight); } catch (_) {} }
    });
  }

  function addMsg(role, text, metaHtml) {
    hideIntro();
    var cls = role === "me" ? "me" : role === "err" ? "err" : "ai";
    var av = role === "me" ? "🧑" : role === "err" ? "⚠️" : "🐮";
    var div = document.createElement("div");
    div.className = "msg " + cls;
    div.innerHTML = "<div class='av'>" + av + "</div><div class='bubble'>" + esc(text).replace(/\n/g, "<br>") +
      (metaHtml ? "<div class='meta'>" + metaHtml + "</div>" : "") + "</div>";
    logEl.appendChild(div);
    if (role === "ai" || role === "me") {   // AI 답변·내 질문 모두 '복사' 버튼
      var bub = div.querySelector(".bubble");
      var cr = document.createElement("div"); cr.className = "copyrow";
      var cb = document.createElement("button"); cb.className = "copybtn"; cb.type = "button"; cb.textContent = "📋 복사";
      cb.onclick = function () { copyText(text); };
      cr.appendChild(cb); bub.appendChild(cr);
    }
    scrollDown();
    recordMsg(role, text, metaHtml);
    return div;
  }

  // ── 복사 / 토스트 ──
  function showToast(msg) {
    var el = $("toast"); if (!el) return;
    el.textContent = msg; el.classList.remove("hidden");
    clearTimeout(showToast._t); showToast._t = setTimeout(function () { el.classList.add("hidden"); }, 1800);
  }
  function copyText(t) {
    var done = function () { showToast("복사되었습니다"); };
    var fallback = function () {
      try { var ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.focus(); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); done(); }
      catch (e) { showToast("복사하지 못했습니다"); }
    };
    try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done).catch(fallback); else fallback(); }
    catch (e) { fallback(); }
  }

  // ── 대화 기록 모달 ──
  function fmtTime(ms) { try { var d = new Date(ms), p = function (n) { return (n < 10 ? "0" : "") + n; }; return d.getFullYear() + "." + p(d.getMonth() + 1) + "." + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes()); } catch (e) { return ""; } }
  function sessionText(s) { return s.msgs.map(function (m) { return (m.role === "me" ? "나: " : "두당AI: ") + m.text; }).join("\n\n"); }
  function openHist() { renderHist(); $("histModal").classList.remove("hidden"); }
  function closeHist() { $("histModal").classList.add("hidden"); }
  function renderHist() {
    var a = loadSessions().filter(function (s) { return s.msgs && s.msgs.length; });
    var box = $("histList");
    if (!a.length) { box.innerHTML = "<div class='histempty'>저장된 대화가 없습니다.</div>"; return; }
    box.innerHTML = "";
    a.forEach(function (s) {
      var item = document.createElement("div"); item.className = "histitem" + (s.id === activeId ? " cur" : "");
      item.innerHTML = "<div class='ht'>" + esc(s.title || "(제목 없음)") + "</div>" +
        "<div class='hd'>" + fmtTime(s.upd || s.ts) + " · " + s.msgs.length + "개 메시지" + (s.id === activeId ? " · 현재 대화" : "") + "</div>" +
        "<div class='ha'><button data-a='open'>열기</button><button data-a='copy'>📋 복사</button><button class='del' data-a='del'>삭제</button></div>";
      item.querySelector("[data-a='open']").onclick = function () { openSession(s.id); };
      item.querySelector("[data-a='copy']").onclick = function () { copyText(sessionText(s)); };
      item.querySelector("[data-a='del']").onclick = function () { if (confirm("이 대화를 삭제할까요?")) deleteSession(s.id); };
      box.appendChild(item);
    });
  }
  function openSession(id) {
    activeId = id; saveActive();
    logEl.innerHTML = "";
    var s = getActive();
    if (s && s.msgs.length) { _restoring = true; s.msgs.forEach(function (m) { addMsg(m.role, m.text, m.meta || ""); }); _restoring = false; if (introEl) introEl.style.display = "none"; }
    else if (introEl) introEl.style.display = "";
    closeHist();
  }
  function deleteSession(id) {
    saveSessions(loadSessions().filter(function (s) { return s.id !== id; }));
    if (id === activeId) { activeId = ""; saveActive(); logEl.innerHTML = ""; if (introEl) introEl.style.display = ""; }
    renderHist();
  }
  function addTyping() {
    hideIntro();
    var div = document.createElement("div");
    div.className = "msg ai";
    div.innerHTML = "<div class='av'>🐮</div><div class='bubble'><span class='typing'><i></i><i></i><i></i></span></div>";
    logEl.appendChild(div); scrollDown();
    return div;
  }

  // ── 전송 ──
  function doSend(text) {
    if (busy) return;
    // 📎 첨부파일이 있으면 브라우저 안에서 분석(OpenAI 등 외부로 전송하지 않음)
    if (attached.length) { analyzeFiles(); return; }
    text = (text || qEl.value || "").trim();
    if (!text) return;
    if (text.length > MAX_CHARS) { addMsg("err", "질문이 너무 깁니다. " + MAX_CHARS + "자 이내로 줄여 주세요. (현재 " + text.length + "자)"); return; }

    // 소 이력번호(12자리 또는 410+12) 감지 → OpenAI로 보내지 않고 축산물이력제 API로만 조회(개인정보 보호). 모든 탭 공통.
    var tm = text.match(/(?:^|\D)((?:410)?\d{12})(?!\d)/);
    if (tm) {
      var tno = tm[1]; if (tno.length === 15 && tno.indexOf("410") === 0) tno = tno.slice(3);
      doTraceLookup(text, tno);
      return;
    }

    // 소이력 조회 직후 '판매금액·판매비용(구입금액·구입체중)' 입력 → 실판매·일당증체 정리 + 조사표 ② 핸드오프
    if (looksLikeTraceAmt(text)) { completeTrace(text); return; }

    // 1차 개인정보 차단 → OpenAI로 보내지 않음
    var pii = screenPII(text);
    if (pii.blocked) {
      addMsg("me", text);
      qEl.value = ""; updateCnt();
      addMsg("err",
        "개인정보로 보이는 내용(" + pii.reasons.join(", ") + ")이 포함되어 전송을 차단했습니다.\n" +
        "농가명·전화번호·주소·주민/사업자·이력(식별)번호 등 식별정보를 빼고 다시 질문해 주세요.\n" +
        "두당 AI는 개인정보를 외부 AI로 보내지 않습니다.");
      return;
    }

    var priorHist = activeHistory().slice(-8);   // 이전 맥락(현재 질문 제외) — 서버에서 현재 질문을 뒤에 붙임
    addMsg("me", text);                          // 현재 질문 저장(기록)
    qEl.value = ""; updateCnt(); autoGrow();

    if (!RELAY_URL) { mockAnswer(text); return; }   // 목 모드(AWS 연결 전)

    busy = true; sendEl.disabled = true;
    var typing = addTyping();
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, REQUEST_TIMEOUT_MS);

    // 전송 모드 결정: 조사표=survey, 질문탭이면 통계성 질의는 stats 자동, 그 외 일반(undefined)
    var sendMode = (chatMode === "survey") ? "survey" : (looksLikeStats(text) ? "stats" : undefined);
    // 로그인 토큰(있으면) 첨부 → 서버에서 승인 검증
    var tokP = (window.__dudangAuth && window.__dudangAuth.getToken) ? window.__dudangAuth.getToken() : Promise.resolve(null);
    tokP.then(function (idToken) {
      return fetch(RELAY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: priorHist, idToken: idToken || undefined, mode: sendMode }),
        signal: ctrl.signal
      });
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, j: j }; }); })
      .then(function (res) {
        clearTimeout(timer); typing.remove();
        if (!res.ok) { showServerError(res.status, res.j); return; }
        var j = res.j || {};
        if (j.blocked) { addMsg("err", j.message || "개인정보가 포함되어 서버에서 전송이 차단되었습니다. 식별정보를 빼고 다시 질문해 주세요."); return; }
        if (j.mode === "survey") {   // 조사표 작성 모드 답변(표)
          if (j.structured) renderSurveyAnswer(j.structured);
          else addMsg("ai", j.answer || "조사표 형식으로 정리하지 못했습니다. 축종·거래유형·금액 등을 좀 더 구체적으로 말씀해 주세요.");
          return;
        }
        if (j.mode === "stats") {   // 공표통계·참고체중 조회 답변
          var smeta = (j.source && j.source.source_url) ? "<a href='" + esc(j.source.source_url) + "' target='_blank' rel='noopener'>📄 KOSIS 원문 ›</a>" : "";
          addMsg("ai", j.text || "조회 결과가 없습니다.", smeta);
          return;
        }
        var ans = j.answer || j.message || "답변을 받지 못했습니다.";
        addMsg("ai", ans, buildMeta(j.sources));
      })
      .catch(function (e) {
        clearTimeout(timer); typing.remove();
        if (e && e.name === "AbortError") addMsg("err", "응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.");
        else addMsg("err", "AI 서버에 연결하지 못했습니다. 네트워크 상태를 확인하고 다시 시도해 주세요.");
      })
      .then(function () { busy = false; sendEl.disabled = false; });
  }

  // ── 소 축산물이력제 조회 (이력번호는 정부 이력제 API로만, OpenAI 미전송) ──
  function traceYmd(s) { s = String(s == null ? "" : s); return /^\d{8}$/.test(s) ? (s.slice(0, 4) + "-" + s.slice(4, 6) + "-" + s.slice(6, 8)) : (s || "-"); }
  function traceDate(s) { s = String(s || "").replace(/\D/g, ""); if (!/^\d{8}$/.test(s)) return null; return new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8)); }
  function traceMonths(a, b) { if (!a || !b) return null; var m = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()); var dim = new Date(b.getFullYear(), b.getMonth(), 0).getDate(); m += (b.getDate() - a.getDate()) / dim; return m; }
  // 도체율: 품종·성별 자동(한우 평균59.7·거세59.9·비거세59.1, 육우57.2, 그 외 60)
  function traceDressRate(breed, sex) { var b = String(breed || ""), s = String(sex || ""); if (b.indexOf("육우") >= 0) return 57.2; if (b.indexOf("한우") >= 0) { if (s.indexOf("거세") >= 0 && s.indexOf("미거세") < 0 && s.indexOf("비거세") < 0) return 59.9; if (s.indexOf("미거세") >= 0 || s.indexOf("비거세") >= 0) return 59.1; if (s.indexOf("수") >= 0) return 59.1; if (s.indexOf("암") >= 0) return 59.7; return 59.7; } return 60; }
  function tnf(n) { return (n == null || isNaN(n)) ? "-" : Number(n).toLocaleString("ko-KR"); }
  var lastTrace = null;   // 최근 소이력 조회 결과(판매·구입 금액 정리/조사표 반영에 사용)
  function computeTrace(traceNo, data) {
    var byOpt = {}; (data.results || []).forEach(function (r) { byOpt[r.optionNo] = r; });
    var o1 = byOpt[1] && byOpt[1].items && byOpt[1].items[0];
    var o2 = (byOpt[2] && byOpt[2].items) || [];
    var o3 = byOpt[3] && byOpt[3].items && byOpt[3].items[0];
    if (!o1) return null;
    var breed = o1.lsTypeNm || "", sex = o1.sexNm || "";
    var birth = o1.birthYmd || null, butchery = o3 ? o3.butcheryYmd : null;
    var yangsu = o2.filter(function (x) { return x.regType === "양수" && /^\d{8}$/.test(String(x.regYmd || "")); })
      .filter(function (x) { return !butchery || String(x.regYmd) <= String(butchery); })
      .map(function (x) { return String(x.regYmd); }).sort();
    var buy = yangsu.length ? yangsu[yangsu.length - 1] : null;
    var bD = traceDate(birth), buyD = traceDate(buy), butD = traceDate(butchery);
    var rM = function (v) { return (v == null || isNaN(v)) ? null : Math.round(v); };
    var weight = (o3 && o3.weight) ? Number(o3.weight) : null;
    var rate = traceDressRate(breed, sex);
    return {
      traceNo: traceNo, breed: breed, sex: sex, birth: birth, butchery: butchery, buy: buy,
      buyMonth: rM(traceMonths(bD, buyD)), raiseMonth: rM(traceMonths(buyD, butD)), shipMonth: rM(traceMonths(bD, butD)),
      raiseDays: (buyD && butD) ? Math.round((butD - buyD) / 86400000) : null,
      weight: weight, rate: rate, live: (weight && rate) ? Math.round(weight / (rate / 100)) : null,
      grade: (o3 && o3.gradeNm) || "", inspect: (o3 && o3.inspectPassYn) || "",
      place: (o3 && o3.butcheryPlaceNm) || "", placeAddr: (o3 && o3.butcheryPlaceAddr) || "",
      moves: o2.filter(function (x) { return /^\d{8}$/.test(String(x.regYmd || "")); }).map(function (x) { return (x.regType || "신고") + " " + traceYmd(x.regYmd); })
    };
  }
  function renderTraceCard(t) {
    var L = [];
    L.push("🐄 소 이력 조회 — 기본정보 (이력번호 " + t.traceNo + ")");
    L.push("· 품종: " + (t.breed || "-") + "  · 성별: " + (t.sex || "-"));
    L.push("· 출생일: " + traceYmd(t.birth));
    if (t.moves.length) L.push("· 신고/이동: " + t.moves.join(" · "));
    L.push("· 구입일: " + (t.buy ? traceYmd(t.buy) : "-") + (t.buyMonth != null ? ("  · 구입개월령 " + t.buyMonth + "개월") : ""));
    L.push("· 사육개월수: " + (t.raiseMonth != null ? (t.raiseMonth + "개월") : "-"));
    L.push("");
    L.push("〔출하·도축〕");
    L.push("· 도축일: " + traceYmd(t.butchery) + (t.shipMonth != null ? ("  · 출하개월수 " + t.shipMonth + "개월") : ""));
    L.push("· 육질등급: " + (t.grade || "-") + "  · 검사결과: " + (t.inspect || "-"));
    L.push("· 도축장: " + (t.place || "-"));
    if (t.placeAddr) L.push("· 도축장 주소: " + t.placeAddr);
    L.push("· 도체중량: " + (t.weight != null ? (t.weight + "kg") : "-") + "  · 도체율: " + t.rate + "%  · 추정생체중량: " + (t.live != null ? (t.live + "kg") : "-"));
    L.push("");
    L.push("※ 축산물이력제(정부) 자료 · 생성AI(OpenAI)에 전송되지 않았습니다. 도체율은 품종·성별 기준 추정치입니다.");
    L.push("💡 '판매금액 ○○원, 판매비용 ○○원' (비육우·육우는 '구입금액 ○○원, 구입체중 ○○kg'도) 알려주시면 실판매·일당증체까지 정리하고 축비조사표 ②에 바로 입력해 드립니다.");
    return L.join("\n");
  }
  // 금액 파서: 라벨 뒤의 원화 금액(억/만/원·콤마) 추출
  function krwAfter(text, label) {
    var i = text.indexOf(label); if (i < 0) return null;
    var seg = text.slice(i + label.length, i + label.length + 20);
    var e = seg.match(/([0-9][0-9,\.]*)\s*억/), m = seg.match(/([0-9][0-9,\.]*)\s*만/);
    if (e || m) { var tt = 0; if (e) tt += parseFloat(e[1].replace(/,/g, "")) * 1e8; if (m) tt += parseFloat(m[1].replace(/,/g, "")) * 1e4; return Math.round(tt); }
    var w = seg.match(/([0-9]{4,}|[0-9]{1,3}(?:,[0-9]{3})+)\s*원?/);   // 만/억 없으면 4자리↑ 또는 천단위콤마
    return w ? Math.round(parseFloat(w[1].replace(/,/g, ""))) : null;
  }
  function kgAfter(text, label) {
    var i = text.indexOf(label); if (i < 0) return null;
    var m = text.slice(i + label.length, i + label.length + 14).match(/([0-9][0-9,\.]*)\s*(?:kg|키로|킬로|킬로그램)/i);
    return m ? parseFloat(m[1].replace(/,/g, "")) : null;
  }
  function looksLikeTraceAmt(text) {
    if (!lastTrace) return false;
    if (/(?:^|\D)(?:410)?\d{12}(?!\d)/.test(text)) return false;   // 새 이력번호면 아님
    return /판매|구입/.test(text) && /\d/.test(text);
  }
  function completeTrace(text) {
    addMsg("me", text); qEl.value = ""; updateCnt(); autoGrow();
    var t = lastTrace;
    var saleA = krwAfter(text, "판매금액") || krwAfter(text, "판매가") || krwAfter(text, "판매대금");
    if (saleA == null) { var pm = text.match(/판매(?!\s*비|\s*시|비)/); if (pm) saleA = krwAfter(text.slice(pm.index), "판매"); }
    var saleB = krwAfter(text, "판매비용") || krwAfter(text, "판매시비용") || krwAfter(text, "판매비");
    var buyA = krwAfter(text, "구입금액") || krwAfter(text, "구입가") || krwAfter(text, "매입") || krwAfter(text, "구입");
    var buyB = krwAfter(text, "구입비용") || krwAfter(text, "구입시비용") || krwAfter(text, "구입비");
    var buyWt = kgAfter(text, "구입체중") || kgAfter(text, "구입중량") || kgAfter(text, "구입");
    var gain = (t.live && buyWt && t.raiseDays > 0) ? Math.round((t.live - buyWt) / t.raiseDays * 1000) : null;
    var L = [];
    L.push("💰 " + (t.breed + " " + t.sex).trim() + " 판매 정리 (이력 " + t.traceNo + ")");
    L.push("· 추정생체중: " + tnf(t.live) + "kg · 출하 " + (t.shipMonth != null ? t.shipMonth + "개월" : "-") + " · 등급 " + (t.grade || "-"));
    if (saleA != null) {
      L.push("· 판매금액(A): " + tnf(saleA) + "원" + (saleB != null ? ("  · 판매시비용(B): " + tnf(saleB) + "원") : ""));
      L.push("· 실판매금액(A−B): " + tnf(saleA - (saleB || 0)) + "원");
    } else { L.push("· (판매금액을 못 읽었습니다. 예: 판매금액 950만원, 판매비용 35만원)"); }
    if (buyA != null || buyWt != null) {
      L.push("〔구입당시(비육우·육우)〕");
      if (t.buy) L.push("· 구입일: " + traceYmd(t.buy) + " · 구입개월령 " + (t.buyMonth != null ? t.buyMonth + "개월" : "-"));
      if (buyWt != null) L.push("· 구입체중: " + buyWt + "kg");
      if (buyA != null) L.push("· 구입금액: " + tnf(buyA) + "원" + (buyB != null ? ("  · 구입시비용 " + tnf(buyB) + "원") : "") + " · 실구입(구입+비용) " + tnf(buyA + (buyB || 0)) + "원");
      if (t.raiseDays != null) L.push("· 두당평균사육일수: " + tnf(t.raiseDays) + "일");
      if (gain != null) L.push("· 두당평균 일당증체량: " + tnf(gain) + "g/일  (추정생체중−구입체중)÷사육일수");
      else if (buyWt == null) L.push("· (일당증체량은 '구입체중 ○○kg'을 알려주시면 계산합니다)");
    }
    L.push("");
    L.push("아래 버튼으로 축비조사표 ②에 입력합니다(농가·사육구분은 조사표에서 선택).");
    // 축종 힌트: 육우(젖소수)면 beef, 한우면 비육우(출하·도축된 소는 대개 비육). 사육구분은 출하개월로(≥25 o25·13~24 m24·<13 u12)
    var spHint = (/육우/.test(t.breed)) ? "beef" : "beeffat";
    var catHint = (t.shipMonth != null) ? (t.shipMonth >= 25 ? "o25" : (t.shipMonth >= 13 ? "m24" : "u12")) : "o25";
    var handoff = {
      form_id: "livestock_purchase_sale", transaction: "판매", code: null,
      speciesHint: spHint, catHint: catHint,
      name: (t.breed + " " + t.sex).trim(), qty: 1,
      wt: t.live, age: t.shipMonth, date: traceDayOfMonth(t.butchery), amountA: saleA, costB: saleB,
      buy: (buyA != null || buyWt != null) ? { wt: buyWt, age: t.buyMonth, A: buyA, B: buyB, date: (t.buy ? String(t.buy).slice(2) : null) } : null
    };
    var div = addMsg("ai", L.join("\n"));
    var bubble = div && div.querySelector(".bubble");
    if (bubble) appendHandoffBtn(bubble, handoff, "📝 조사표 ②에 입력");
  }
  function traceDayOfMonth(ymd) { ymd = String(ymd || "").replace(/\D/g, ""); return /^\d{8}$/.test(ymd) ? parseInt(ymd.slice(6, 8), 10) : null; }
  function writeHandoffAndGo(handoff) {
    try { localStorage.setItem("dudang_ai_handoff", JSON.stringify({ t: Date.now(), h: handoff })); }
    catch (e) { alert("브라우저 저장소에 접근할 수 없어 전달하지 못했습니다."); return; }
    if (EMBED && window.parent && window.parent !== window) { try { window.parent.postMessage({ type: "dudang-ai-handoff" }, "*"); return; } catch (e) {} }
    location.href = "survey.html";
  }
  function appendHandoffBtn(bubble, handoff, label) {
    var cr = document.createElement("div"); cr.className = "copyrow";
    var hb = document.createElement("button"); hb.className = "copybtn"; hb.type = "button";
    hb.style.background = "#2b6cb0"; hb.style.color = "#fff"; hb.style.borderColor = "#2b6cb0";
    hb.textContent = label || "📝 조사표에 입력";
    hb.onclick = function () { writeHandoffAndGo(handoff); };
    cr.appendChild(hb); bubble.appendChild(cr);
  }
  function doTraceLookup(text, traceNo) {
    addMsg("me", text);
    qEl.value = ""; updateCnt(); autoGrow();
    if (busy) return;
    busy = true; sendEl.disabled = true;
    var typing = addTyping();
    fetch(TRACE_URL + "/?traceNo=" + encodeURIComponent(traceNo) + "&all=1")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        typing.remove();
        if (!data || !data.ok) { addMsg("err", "소 이력 조회 실패: " + ((data && (data.message || data.error)) || "이력(개체식별)번호를 확인하세요.")); return; }
        var t = computeTrace(traceNo, data);
        if (!t) { addMsg("err", "개체 기본정보가 없습니다. 이력(개체식별)번호를 확인해 주세요. (" + traceNo + ")"); return; }
        lastTrace = t;
        addMsg("ai", renderTraceCard(t));
      })
      .catch(function () { typing.remove(); addMsg("err", "축산물이력제 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요."); })
      .then(function () { busy = false; sendEl.disabled = false; });
  }

  // ── 📎 파일분석 (브라우저 안에서만 처리 · 파일/숫자를 OpenAI 등 외부로 보내지 않음) ──
  var attached = [];   // [{file, name, type, size, url(이미지)}]
  var MAX_FILES = 3, MAX_BYTES = 10 * 1024 * 1024;
  function fsize(n) { if (n < 1024) return n + " B"; if (n < 1048576) return (n / 1024).toFixed(0) + " KB"; return (n / 1048576).toFixed(1) + " MB"; }
  function fkind(name) { var e = (name.split(".").pop() || "").toLowerCase(); if (e === "xlsx" || e === "xls") return "엑셀"; if (e === "csv") return "CSV"; if (e === "pdf") return "PDF"; if (/^(jpg|jpeg|png|webp)$/.test(e)) return "이미지"; return e.toUpperCase(); }
  function renderChips() {
    var box = $("fileChips"); if (!box) return;
    if (!attached.length) { box.hidden = true; box.innerHTML = ""; return; }
    box.hidden = false;
    box.innerHTML = attached.map(function (a, i) {
      var pv = a.url ? ("<img src='" + a.url + "' alt=''>") : "";
      return "<div class='fchip'>" + pv + "<div class='fi'><div class='fn'>" + esc(a.name) + "</div><div class='fm'>" + fkind(a.name) + " · " + fsize(a.size) + "</div></div><button class='fx' type='button' data-fi='" + i + "' title='삭제'>✕</button></div>";
    }).join("");
    box.querySelectorAll("[data-fi]").forEach(function (b) { b.onclick = function () { var i = +b.dataset.fi; if (attached[i] && attached[i].url) { try { URL.revokeObjectURL(attached[i].url); } catch (e) {} } attached.splice(i, 1); renderChips(); }; });
  }
  function addFiles(list) {
    for (var i = 0; i < list.length; i++) {
      if (attached.length >= MAX_FILES) { showToast("파일은 최대 " + MAX_FILES + "개까지"); break; }
      var f = list[i];
      if (f.size > MAX_BYTES) { addMsg("err", "'" + f.name + "'은 10MB를 초과합니다."); continue; }
      var e = (f.name.split(".").pop() || "").toLowerCase();
      if (["xlsx", "xls", "csv", "pdf"].indexOf(e) < 0) { addMsg("err", "'" + f.name + "'은 아직 지원하지 않는 형식입니다. (현재 엑셀·CSV·PDF 지원, 이미지 OCR은 준비 중)"); continue; }
      attached.push({ file: f, name: f.name, type: f.type, size: f.size, url: null });
    }
    renderChips();
  }
  function pnum(x) { x = String(x == null ? "" : x).replace(/,/g, "").replace(/\s/g, "").trim(); if (x === "" || x === "-") return null; var n = parseFloat(x); return isNaN(n) ? null : n; }
  function guessUnit(h) { var s = String(h || ""); var par = s.match(/\(([^)]{1,6})\)/); var cand = par ? par[1] : s; var m = cand.match(/천원|백만원|원|kg|㎏|그램|두수|마리|두|%|퍼센트|ℓ|리터|톤|㎡|평|개월|시간|일/); return m ? m[0] : ""; }
  function fnum(n) { return (n == null || isNaN(n)) ? "-" : Number(Math.round(n * 100) / 100).toLocaleString("ko-KR"); }
  function analyzeSheet(aoa) {
    // 첫 비어있지 않은 행을 머리글로
    var hi = 0; while (hi < aoa.length && (aoa[hi] || []).every(function (c) { return String(c == null ? "" : c).trim() === ""; })) hi++;
    var headers = (aoa[hi] || []).map(function (c, j) { var t = String(c == null ? "" : c).trim(); return t || ("열" + (j + 1)); });
    var rows = aoa.slice(hi + 1).filter(function (r) { return (r || []).some(function (c) { return String(c == null ? "" : c).trim() !== ""; }); });
    var cols = headers.map(function (h, j) {
      var vals = rows.map(function (r) { return (r || [])[j]; });
      var nums = vals.map(pnum).filter(function (v) { return v != null; });
      var empty = vals.filter(function (v) { return String(v == null ? "" : v).trim() === ""; }).length;
      var isNum = nums.length >= Math.max(2, Math.ceil(vals.length * 0.5));
      var sum = nums.reduce(function (a, b) { return a + b; }, 0);
      return { name: h, unit: guessUnit(h), isNum: isNum, count: nums.length, empty: empty, sum: isNum ? sum : null, avg: (isNum && nums.length) ? sum / nums.length : null, min: isNum && nums.length ? Math.min.apply(null, nums) : null, max: isNum && nums.length ? Math.max.apply(null, nums) : null };
    });
    // 중복행(동일 전체행) 수
    var seen = {}, dup = 0; rows.forEach(function (r) { var k = (r || []).join("\u0001"); if (seen[k]) dup++; else seen[k] = 1; });
    return { headers: headers, rows: rows, cols: cols, dup: dup };
  }
  function analyzeWorkbook(name, buf) {
    var wb = XLSX.read(buf, { type: "array", cellDates: false });
    var sheets = wb.SheetNames.map(function (sn) {
      var aoa = XLSX.utils.sheet_to_json(wb.Sheets[sn], { header: 1, defval: "", raw: true, blankrows: false });
      return { name: sn, a: analyzeSheet(aoa) };
    });
    return { name: name, sheets: sheets, wb: wb };
  }
  function sheetTableHtml(a) {
    var maxR = 15, maxC = Math.min(a.headers.length, 14);
    var h = "<div class='fa-scroll'><table class='fatable'><tr>";
    for (var j = 0; j < maxC; j++) h += "<th>" + esc(a.headers[j]) + (a.cols[j].unit ? "" : "") + "</th>";
    if (a.headers.length > maxC) h += "<th>…</th>";
    h += "</tr>";
    for (var i = 0; i < Math.min(a.rows.length, maxR); i++) {
      h += "<tr>";
      for (var c = 0; c < maxC; c++) { var v = (a.rows[i] || [])[c]; var num = pnum(v); h += "<td class='" + (num == null ? "k" : "") + "'>" + esc(num == null ? String(v == null ? "" : v) : fnum(num)) + "</td>"; }
      if (a.headers.length > maxC) h += "<td>…</td>";
      h += "</tr>";
    }
    h += "</table></div>";
    if (a.rows.length > maxR) h += "<div class='fm' style='font-size:11px;color:#718096'>… 외 " + (a.rows.length - maxR) + "행 (다운로드하면 전체 포함)</div>";
    return h;
  }
  function statHtml(a) {
    var numCols = a.cols.filter(function (c) { return c.isNum; });
    var lines = numCols.slice(0, 20).map(function (c) { return "· <b>" + esc(c.name) + "</b>" + ((c.unit && String(c.name).indexOf(c.unit) < 0) ? ("(" + c.unit + ")") : "") + ": 합계 " + fnum(c.sum) + " · 평균 " + fnum(c.avg) + " · 건수 " + c.count + (c.empty ? (" · 누락 " + c.empty) : ""); });
    var warn = [];
    var anyEmpty = a.cols.reduce(function (s, c) { return s + c.empty; }, 0);
    if (anyEmpty) warn.push("빈칸(누락) " + anyEmpty + "곳");
    if (a.dup) warn.push("중복행 " + a.dup + "개");
    return "<div class='fa-stat'>" + (lines.length ? ("📊 숫자 열 집계<br>" + lines.join("<br>")) : "숫자 열이 없습니다.") + (warn.length ? ("<br>⚠️ 확인 필요: " + warn.join(" · ")) : "") + "</div>";
  }
  var _lastAnalysis = [];
  function renderAnalysis(res) {
    var div = document.createElement("div"); div.className = "msg ai";
    var html = "<div class='av'>📎</div><div class='bubble'>";
    html += "<b>" + esc(res.name) + "</b> 분석 결과 <span class='fanote'>· 브라우저 안에서만 처리(외부 전송 없음)</span>";
    res.sheets.forEach(function (s) {
      html += "<div style='margin-top:8px'><b>[" + esc(s.name) + "]</b> " + s.a.rows.length + "행 × " + s.a.headers.length + "열</div>";
      html += sheetTableHtml(s.a) + statHtml(s.a);
    });
    html += "<div class='fanote' style='margin-top:8px'>※ 합계·평균은 파일의 실제 값으로 계산했습니다. 원본에 없는 값은 만들지 않습니다.</div>";
    html += "</div>";
    div.innerHTML = html;
    var bubble = div.querySelector(".bubble");
    var cr = document.createElement("div"); cr.className = "copyrow";
    ["엑셀(xlsx)", "CSV"].forEach(function (fmt) {
      var b = document.createElement("button"); b.className = "copybtn"; b.type = "button"; b.textContent = "⬇ " + fmt + " 다운로드";
      b.onclick = function () { downloadResult(res, fmt.indexOf("CSV") >= 0 ? "csv" : "xlsx"); };
      cr.appendChild(b);
    });
    bubble.appendChild(cr);
    logEl.appendChild(div); scrollDown();
  }
  function downloadResult(res, fmt) {
    try {
      var out = XLSX.utils.book_new();
      res.sheets.forEach(function (s, idx) {
        var aoa = [s.a.headers].concat(s.a.rows);
        var ws = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(out, ws, (s.name || ("Sheet" + (idx + 1))).slice(0, 28));
        // 집계 시트
        var stat = [["열", "단위", "합계", "평균", "건수", "누락", "최소", "최대"]];
        s.a.cols.forEach(function (c) { if (c.isNum) stat.push([c.name, c.unit, c.sum, c.avg, c.count, c.empty, c.min, c.max]); });
        if (stat.length > 1) XLSX.utils.book_append_sheet(out, XLSX.utils.aoa_to_sheet(stat), ("집계_" + (idx + 1)).slice(0, 28));
      });
      var base = "분석_" + (res.name.replace(/\.[^.]+$/, "") || "결과");
      if (fmt === "csv") {
        var csv = XLSX.utils.sheet_to_csv(out.Sheets[out.SheetNames[0]]);
        var blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
        var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = base + ".csv"; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
      } else {
        XLSX.writeFile(out, base + ".xlsx");
      }
      showToast("다운로드를 시작합니다");
    } catch (e) { addMsg("err", "다운로드 생성 중 오류: " + (e && e.message || e)); }
  }
  function analyzeFiles() {
    if (typeof XLSX === "undefined") { addMsg("err", "분석 라이브러리를 불러오지 못했습니다. 인터넷 연결 후 새로고침해 주세요."); return; }
    var files = attached.slice();
    addMsg("me", "📎 " + files.map(function (f) { return f.name; }).join(", ") + " 분석");
    attached = []; renderChips(); qEl.value = ""; updateCnt(); autoGrow();
    var typing = addTyping(); busy = true; sendEl.disabled = true;
    // 모든 파일을 먼저 읽은 뒤 → 개별 분석 + (표 2개면) 비교
    var bufs = new Array(files.length), pending = files.length;
    files.forEach(function (fobj, idx) {
      var fr = new FileReader();
      fr.onload = function () { bufs[idx] = { name: fobj.name, ext: (fobj.name.split(".").pop() || "").toLowerCase(), buf: new Uint8Array(fr.result) }; if (--pending === 0) processAll(bufs, typing); };
      fr.onerror = function () { bufs[idx] = { name: fobj.name, err: true }; if (--pending === 0) processAll(bufs, typing); };
      fr.readAsArrayBuffer(fobj.file);
    });
  }
  function processAll(bufs, typing) {
    var tables = [];   // {name, a(첫 시트)} — 비교용
    var chain = Promise.resolve();
    bufs.forEach(function (b) {
      if (!b || b.err) { addMsg("err", "'" + (b && b.name) + "' 읽기 실패"); return; }
      if (b.ext === "pdf") {
        chain = chain.then(function () { return analyzePdf(b.name, b.buf).then(renderPdf).catch(function (e) { addMsg("err", "'" + b.name + "' PDF 분석 실패: " + (e && e.message || e)); }); });
      } else {
        try { var r = analyzeWorkbook(b.name, b.buf); renderAnalysis(r); if (r.sheets[0] && r.sheets[0].a) tables.push({ name: b.name, a: r.sheets[0].a }); }
        catch (e) { addMsg("err", "'" + b.name + "' 분석 실패: " + (e && e.message || e)); }
      }
    });
    chain.then(function () {
      if (tables.length === 2) { try { renderCompare(tables[0], tables[1]); } catch (e) {} }
      typing.remove(); busy = false; sendEl.disabled = false;
    });
  }
  // ── 두 파일 비교: 이력번호(개체) 기준 추가/없어진 개체 ──
  function findKeyCol(a) {
    var byHeader = -1;
    a.headers.forEach(function (h, j) { if (byHeader < 0 && /이력|개체|식별|번호|number|id/i.test(String(h))) byHeader = j; });
    var best = -1, bestScore = 0;
    a.headers.forEach(function (h, j) {
      var idlike = a.rows.map(function (r) { return String((r || [])[j] == null ? "" : (r || [])[j]).replace(/\D/g, ""); }).filter(function (v) { return v.length >= 9 && v.length <= 15; }).length;
      if (idlike > bestScore) { bestScore = idlike; best = j; }
    });
    if (byHeader >= 0) return byHeader;
    if (best >= 0 && bestScore >= Math.max(2, a.rows.length * 0.4)) return best;
    return 0;
  }
  function ctxCols(a) { var out = []; a.headers.forEach(function (h, j) { if (/품종|축종|성별|구분|사육|산|농가/.test(String(h))) out.push(j); }); return out.slice(0, 2); }
  function renderCompare(f1, f2) {
    var normKey = function (v) { return String(v == null ? "" : v).replace(/\D/g, ""); };
    var k1 = findKeyCol(f1.a), k2 = findKeyCol(f2.a), c2 = ctxCols(f2.a), c1 = ctxCols(f1.a);
    var mapA = {}, mapB = {};
    f1.a.rows.forEach(function (r) { var k = normKey((r || [])[k1]); if (k.length >= 6) mapA[k] = r; });
    f2.a.rows.forEach(function (r) { var k = normKey((r || [])[k2]); if (k.length >= 6) mapB[k] = r; });
    var kA = Object.keys(mapA), kB = Object.keys(mapB);
    if (!kA.length || !kB.length) { addMsg("ai", "두 파일 비교: 공통 키(이력번호/개체식별번호) 열을 찾지 못했습니다. 각 파일에 이력번호 열이 있는지 확인해 주세요."); return; }
    var added = kB.filter(function (k) { return !(k in mapA); });
    var removed = kA.filter(function (k) { return !(k in mapB); });
    var common = kB.filter(function (k) { return (k in mapA); });
    var ctxOf = function (row, cols) { return cols.map(function (j) { return String((row || [])[j] == null ? "" : (row || [])[j]).trim(); }).filter(Boolean).join(" "); };
    var listHtml = function (keys, map, cols, cls) {
      if (!keys.length) return "<div style='color:#718096'>없음</div>";
      return "<div class='fa-scroll' style='max-height:180px'>" + keys.slice(0, 50).map(function (k) { var cx = ctxOf(map[k], cols); return "<div style='font-size:12.5px;padding:2px 2px'>" + esc(k) + (cx ? (" <span style='color:#718096'>· " + esc(cx) + "</span>") : "") + "</div>"; }).join("") + "</div>" + (keys.length > 50 ? ("<div class='fm' style='font-size:11px;color:#718096'>… 외 " + (keys.length - 50) + "건(다운로드에 전체 포함)</div>") : "");
    };
    var div = document.createElement("div"); div.className = "msg ai";
    var html = "<div class='av'>📊</div><div class='bubble'>";
    html += "<b>두 파일 비교</b> <span class='fanote'>· 이력번호 기준 · 브라우저 안에서만 처리</span>";
    html += "<div class='fm' style='font-size:11.5px;color:#718096;margin-top:3px'>이전: <b>" + esc(f1.name) + "</b>(" + kA.length + "두) → 이후: <b>" + esc(f2.name) + "</b>(" + kB.length + "두)</div>";
    html += "<div class='fa-stat'>🟢 <b>추가된 소</b> (이후에 새로 생김 = 구입·편입 등): <b>" + added.length + "두</b></div>" + listHtml(added, mapB, c2);
    html += "<div class='fa-stat' style='margin-top:8px'>🔴 <b>없어진 소</b> (이전엔 있었는데 이후 없음 = 판매·도태·폐사 등): <b>" + removed.length + "두</b></div>" + listHtml(removed, mapA, c1);
    html += "<div class='fa-stat' style='margin-top:8px'>⚪ 유지된 소: <b>" + common.length + "두</b> · 합계 확인: 이전 " + kA.length + " − 없어짐 " + removed.length + " + 추가 " + added.length + " = 이후 " + (kA.length - removed.length + added.length) + "두</div>";
    html += "<div class='fanote' style='margin-top:8px'>※ 이력번호(숫자)만으로 매칭했습니다. 순서(첨부 순)가 이전→이후입니다. 반대면 순서를 바꿔 다시 올려주세요.</div></div>";
    div.innerHTML = html;
    var bubble = div.querySelector(".bubble");
    var cr = document.createElement("div"); cr.className = "copyrow";
    var cb = document.createElement("button"); cb.className = "copybtn"; cb.type = "button"; cb.textContent = "⬇ 비교결과 엑셀";
    cb.onclick = function () {
      try {
        var wb = XLSX.utils.book_new();
        var mk = function (keys, map, cols, a) { var head = ["이력번호"].concat(cols.map(function (j) { return a.headers[j]; })); var rows = keys.map(function (k) { return [k].concat(cols.map(function (j) { return (map[k] || [])[j]; })); }); return XLSX.utils.aoa_to_sheet([head].concat(rows)); };
        XLSX.utils.book_append_sheet(wb, mk(added, mapB, c2, f2.a), "추가된소");
        XLSX.utils.book_append_sheet(wb, mk(removed, mapA, c1, f1.a), "없어진소");
        XLSX.utils.book_append_sheet(wb, mk(common, mapB, c2, f2.a), "유지된소");
        XLSX.writeFile(wb, "이력비교_추가_없어진소.xlsx"); showToast("다운로드를 시작합니다");
      } catch (e) { addMsg("err", "다운로드 생성 오류: " + (e && e.message || e)); }
    };
    cr.appendChild(cb); bubble.appendChild(cr);
    logEl.appendChild(div); scrollDown();
  }
  // ── PDF 텍스트 추출 (pdf.js · 브라우저 내) ──
  function pdfLines(tc) {
    var items = (tc && tc.items) || [];
    var lines = {}, order = [];
    items.forEach(function (it) { var y = Math.round((it.transform && it.transform[5]) || 0); if (!(y in lines)) { lines[y] = []; order.push(y); } lines[y].push({ x: (it.transform && it.transform[4]) || 0, s: it.str || "" }); });
    order.sort(function (a, b) { return b - a; });
    return order.map(function (y) { return lines[y].sort(function (a, b) { return a.x - b.x; }).map(function (o) { return o.s; }).join(" ").replace(/\s+/g, " ").trim(); }).filter(function (l) { return l !== ""; });
  }
  function analyzePdf(name, buf) {
    if (typeof pdfjsLib === "undefined") return Promise.reject(new Error("PDF 라이브러리를 불러오지 못했습니다(새로고침)."));
    return pdfjsLib.getDocument({ data: buf }).promise.then(function (pdf) {
      var maxP = Math.min(pdf.numPages, 20), pages = [], seq = Promise.resolve();
      for (var p = 1; p <= maxP; p++) (function (pn) { seq = seq.then(function () { return pdf.getPage(pn).then(function (pg) { return pg.getTextContent().then(function (tc) { pages.push({ page: pn, text: pdfLines(tc) }); }); }); }); })(p);
      return seq.then(function () { pages.sort(function (a, b) { return a.page - b.page; }); return { name: name, numPages: pdf.numPages, shown: maxP, pages: pages }; });
    });
  }
  function renderPdf(res) {
    var scanLike = res.pages.every(function (p) { return p.text.join("").replace(/\s/g, "").length < 3; });
    var allText = "";
    var div = document.createElement("div"); div.className = "msg ai";
    var html = "<div class='av'>📎</div><div class='bubble'>";
    html += "<b>" + esc(res.name) + "</b> PDF 분석 <span class='fanote'>· 브라우저 안에서만 처리(외부 전송 없음)</span>";
    html += "<div class='fm' style='font-size:11px;color:#718096;margin-top:4px'>총 " + res.numPages + "쪽 중 " + res.shown + "쪽 표시</div>";
    if (scanLike) html += "<div class='fa-stat'>⚠️ 텍스트가 거의 없습니다 — <b>스캔(이미지) PDF</b>로 보입니다. 이미지 OCR(다음 단계)이 필요합니다.</div>";
    res.pages.forEach(function (p) {
      var t = p.text.join("\n"); allText += "[" + p.page + "쪽]\n" + t + "\n\n";
      html += "<div style='margin-top:8px'><b>[" + p.page + "쪽]</b></div><div class='fa-scroll' style='max-height:200px'><div style='padding:6px 8px;font-size:12px;white-space:pre-wrap;line-height:1.5'>" + esc(t.slice(0, 2000)) + (t.length > 2000 ? "…" : "") + "</div></div>";
    });
    var nums = (allText.match(/[0-9][0-9,]{2,}(?:\.[0-9]+)?/g) || []).map(function (x) { return x.replace(/,/g, ""); }).filter(function (x) { return x.replace(/\D/g, "").length >= 3; });
    if (nums.length) html += "<div class='fa-stat'>🔢 추출된 숫자(상위 30): " + nums.slice(0, 30).map(function (n) { return Number(n).toLocaleString("ko-KR"); }).join(" · ") + "</div>";
    html += "<div class='fanote' style='margin-top:8px'>※ 추출 텍스트는 파일 원본입니다. 표 정렬이 깨질 수 있으니 확인 후 사용하세요.</div></div>";
    div.innerHTML = html;
    var bubble = div.querySelector(".bubble");
    var cr = document.createElement("div"); cr.className = "copyrow";
    var cb = document.createElement("button"); cb.className = "copybtn"; cb.type = "button"; cb.textContent = "⬇ 텍스트 다운로드";
    cb.onclick = function () { var blob = new Blob(["﻿" + allText], { type: "text/plain;charset=utf-8" }); var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "추출_" + res.name.replace(/\.[^.]+$/, "") + ".txt"; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500); showToast("다운로드를 시작합니다"); };
    var cc = document.createElement("button"); cc.className = "copybtn"; cc.type = "button"; cc.textContent = "📋 복사"; cc.onclick = function () { copyText(allText); };
    cr.appendChild(cb); cr.appendChild(cc); bubble.appendChild(cr);
    logEl.appendChild(div); scrollDown();
  }
  // 첨부 버튼 wiring
  (function wireAttach() {
    var bt = $("btnAttach"), fi = $("fileInput");
    if (bt && fi) {
      bt.onclick = function () { fi.click(); };
      fi.onchange = function () { if (fi.files && fi.files.length) addFiles(fi.files); fi.value = ""; };
    }
  })();

  // ── 조사표 작성(A단계) 답변 렌더 ──
  function confBadge(c) {
    var m = { high: ["확실", "#2e7a4e"], medium: ["보통", "#b7791f"], low: ["불명확", "#c53030"] };
    var x = m[c] || m.medium;
    return "<span class='confbadge' style='background:" + x[1] + "'>신뢰도 " + x[0] + "</span>";
  }
  function sval(v) { return (v == null || v === "null" || v === "") ? "— (확인 필요)" : v; }
  function surveyToText(st) {
    var L = ["[" + (st.form || "조사표") + "] 일계부 입력 안내"];
    (st.fields || []).forEach(function (f) { L.push("· " + f.label + ": " + sval(f.value)); });
    if (st.net) L.push("· " + st.net.label + ": " + st.net.value + " (" + st.net.formula + ")");
    if (st.related && st.related.length) L.push("연계 확인: " + st.related.join(" / "));
    if (st.unknown && st.unknown.length) L.push("확인 필요: " + st.unknown.join(", "));
    L.push("신뢰도: " + st.confidence);
    return L.join("\n");
  }
  function renderSurveyAnswer(st) {
    hideIntro();
    var rows = (st.fields || []).map(function (f) {
      var v = sval(f.value), cls = (f.value == null || f.value === "null" || f.value === "") ? " class='needchk'" : "";
      return "<tr><th>" + esc(f.label) + "</th><td" + cls + ">" + esc(v) + "</td></tr>";
    }).join("");
    if (st.net) rows += "<tr class='netrow'><th>" + esc(st.net.label) + "</th><td>" + esc(st.net.value) + "</td></tr>";
    var calcHtml = st.net ? "<div class='scalc'>계산: " + esc(st.net.formula) + "</div>" : "";
    var relHtml = (st.related && st.related.length) ? "<div class='srel'>🔗 연계 확인<br>" + st.related.map(esc).join("<br>") + "</div>" : "";
    var unkHtml = (st.unknown && st.unknown.length) ? "<div class='sunk'>⚠️ 확인 필요: " + st.unknown.map(esc).join(", ") + "</div>" : "";
    var noteHtml = st.note ? "<div class='snote'>" + esc(st.note) + "</div>" : "";
    var html = "<div class='scard'>" +
      "<div class='shead'>" + esc(st.form || "조사표 입력 안내") + " " + confBadge(st.confidence) + "</div>" +
      "<table class='stable'>" + rows + "</table>" + calcHtml + relHtml + unkHtml + noteHtml +
      "<div class='snote'>※ 작성 안내입니다. 실제 입력은 일계부 화면에서 확인 후 진행하세요. (부호는 조사표 부호표 조회, 계산은 프로그램이 재확인)</div>" +
      "</div>";
    var div = document.createElement("div"); div.className = "msg ai";
    div.innerHTML = "<div class='av'>🐮</div><div class='bubble'>" + html + "</div>";
    var txt = surveyToText(st);
    var cr = document.createElement("div"); cr.className = "copyrow";
    var cb = document.createElement("button"); cb.className = "copybtn"; cb.type = "button"; cb.textContent = "📋 복사";
    cb.onclick = function () { copyText(txt); };
    cr.appendChild(cb);
    // [B] 조사표 핸드오프(②구입·판매 / ①사육현황): 조사표로 값 전달 → 조사표에서 미리보기·확인 후 입력
    if (st.handoff && (st.handoff.form_id === "livestock_purchase_sale" || st.handoff.form_id === "livestock_status" || st.handoff.form_id === "product_sales_income")) {
      var hb = document.createElement("button"); hb.className = "copybtn"; hb.type = "button";
      hb.style.marginLeft = "6px"; hb.style.background = "#2b6cb0"; hb.style.color = "#fff"; hb.style.borderColor = "#2b6cb0";
      hb.textContent = "📝 조사표에 입력";
      hb.onclick = function () {
        try { localStorage.setItem("dudang_ai_handoff", JSON.stringify({ t: Date.now(), h: st.handoff })); }
        catch (e) { alert("브라우저 저장소에 접근할 수 없어 전달하지 못했습니다."); return; }
        // 플로팅 위젯(iframe) 안에서는 부모 창이 조사표로 반영하도록 알림, 아니면 직접 이동
        if (EMBED && window.parent && window.parent !== window) {
          try { window.parent.postMessage({ type: "dudang-ai-handoff" }, "*"); return; }
          catch (e) { /* 폴백: 직접 이동 */ }
        }
        location.href = "survey.html";
      };
      cr.appendChild(hb);
    }
    div.querySelector(".bubble").appendChild(cr);
    logEl.appendChild(div); scrollDown();
    recordMsg("ai", txt, "");   // 기록엔 텍스트로 저장
  }

  function buildMeta(sources) {
    if (!sources || !sources.length) return "";
    var links = {
      terms: ["📚 두당 축산용어 사전", "terms.html"],
      helper: ["📋 두당 조사도우미", "helper.html"],
      price: ["📊 소 산지가격", "cattle_price.html"],
      codes: ["🔢 조사표 부호(생산비조사)", "helper.html"]
    };
    var html = "", seen = {};
    sources.forEach(function (s) {
      var k = (typeof s === "string") ? s : s.type;
      var l = links[k];
      if (l && !seen[l[0]]) { seen[l[0]] = 1; html += "<a href='" + l[1] + "'>" + l[0] + " ›</a> &nbsp; "; }
    });
    return html ? "참고자료: " + html : "";
  }

  function showServerError(status, j) {
    var msg = (j && j.message) ? j.message :
      status === 429 ? "요청이 많아 잠시 제한되었습니다. 잠시 후 다시 시도해 주세요." :
      status === 400 ? "질문을 처리할 수 없습니다. 내용을 바꿔 다시 시도해 주세요." :
      "AI 서버에서 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    addMsg("err", msg);
  }

  // ── 목(mock) 답변: AWS 연결 전 화면 동작 확인용 ──
  function mockAnswer(text) {
    var typing = addTyping();
    setTimeout(function () {
      typing.remove();
      addMsg("ai",
        "✅ 질문이 정상 접수되었고, 개인정보 검사를 통과했습니다.\n\n" +
        "지금은 AI 서버(AWS·OpenAI) 연결 준비 중이라 실제 답변은 아직 제공하지 않습니다. " +
        "AWS Lambda를 배포하고 함수 URL을 연결하면, 두당의 공개 자료(축산용어·조사도우미·소 산지가격)를 근거로 한국어 답변을 드립니다.\n\n" +
        "— 화면·입력·개인정보 차단 기능은 정상 동작합니다. —",
        "현재 상태: 연동 준비 중(목 모드)");
    }, 600);
  }

  // ── 입력창 UX ──
  function updateCnt() {
    var n = qEl.value.length;
    cntEl.textContent = n + "/" + MAX_CHARS;
    cntEl.classList.toggle("over", n > MAX_CHARS);
  }
  function autoGrow() { qEl.style.height = "auto"; qEl.style.height = Math.min(qEl.scrollHeight, 160) + "px"; }

  function newChat() {
    activeId = ""; saveActive();   // 이전 대화는 기록에 남기고, 새 빈 대화 시작
    logEl.innerHTML = "";
    if (introEl) introEl.style.display = "";
    qEl.value = ""; updateCnt(); autoGrow(); qEl.focus();
  }

  // ── 모드 전환(일반 질문 / 조사표 작성) ──
  function setMode(name) {
    if (name === "stats") name = "chat";   // 통계탭은 질문탭에 통합(자동 라우팅)
    chatMode = name;
    var btn = { chat: $("modeChat"), survey: $("modeSurvey") };
    Object.keys(btn).forEach(function (k) { if (btn[k]) btn[k].classList.toggle("on", k === name); });
    qEl.placeholder = name === "survey"
      ? "조사내용을 말하듯 적으세요. 예: 번식우 암송아지 6개월 190kg, 30일 450만원 판매, 비용 10만원"
      : "용어·가격·통계·참고체중·소이력(이력번호)까지 질문하세요 (개인정보 제외). 예: 2025년 송아지 생산비 / 번식우 6개월 참고체중";
  }
  // 질문(일반) 탭에서 통계·체중 질의인지 자동 판별 → mode:stats로 서버 전송(아니면 일반 답변)
  function looksLikeStats(t) {
    var s = String(t || "").replace(/\s/g, "");
    if (/생산비|경영비|비용합계|사료비|노동비|감가상각|소득|순수익|총수입|사료급여량|급여량|노동시간|노동력투하|참고체중|공표통계|공표자료|코시스|kosis|통계자료|작년대비|전년대비|어떤자료|무슨자료|자료있|자료가있|조회가능|항목목록|뭐조회|뭐물어|무엇을물어/i.test(s)) return true;
    if (/\d+개월/.test(s) && /체중|생체중|무게/.test(s)) return true;   // 'N개월 체중' = 참고체중
    return false;
  }

  // ── 음성 입력: 녹음 → 서버(Whisper) 전사 → 텍스트 입력 (iOS·안드로이드 공통) ──
  function setStatus(t) { if (statusEl) statusEl.textContent = t; }
  function blobToBase64(blob) {
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onload = function () { var s = String(fr.result); var i = s.indexOf(","); res(i >= 0 ? s.slice(i + 1) : s); };
      fr.onerror = rej; fr.readAsDataURL(blob);
    });
  }
  function initVoice() {
    if (!micEl) return;
    var hasMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
    if (!hasMedia || !RELAY_URL) { micEl.hidden = true; return; }   // 녹음/전송 불가 환경 → 버튼 숨김
    micEl.hidden = false;

    var mediaRec = null, chunks = [], stream = null, recording = false, mimeType = "";
    function reset() { recording = false; micEl.classList.remove("rec"); }   // 아이콘은 SVG 고정, 상태는 class로만 표시
    function stopStream() { if (stream) { try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} stream = null; } }

    micEl.onclick = async function () {
      if (recording) { try { mediaRec.stop(); } catch (e) {} return; }   // 녹음 중 → 종료(전사 시작)
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
      catch (e) { setStatus("🎤 마이크 권한이 필요합니다. 브라우저/설정에서 마이크를 허용해 주세요."); return; }

      chunks = []; mimeType = "";
      ["audio/webm", "audio/mp4", "audio/mpeg", "audio/wav"].some(function (m) {
        if (window.MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) { mimeType = m; return true; } return false;
      });
      try { mediaRec = mimeType ? new MediaRecorder(stream, { mimeType: mimeType }) : new MediaRecorder(stream); }
      catch (e) { try { mediaRec = new MediaRecorder(stream); } catch (_) { stopStream(); setStatus("이 브라우저는 음성 입력을 지원하지 않습니다."); return; } }
      mimeType = mediaRec.mimeType || mimeType || "audio/mp4";

      mediaRec.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
      mediaRec.onstop = async function () {
        stopStream(); reset();
        var blob = new Blob(chunks, { type: mimeType });
        if (!blob.size) { setStatus("녹음된 소리가 없습니다. 다시 시도해 주세요."); return; }
        micEl.disabled = true; setStatus("🎤 음성을 텍스트로 변환 중…");
        try {
          var b64 = await blobToBase64(blob);
          var idToken = (window.__dudangAuth && window.__dudangAuth.getToken) ? await window.__dudangAuth.getToken() : null;
          var r = await fetch(RELAY_URL, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio: b64, mime: mimeType, idToken: idToken || undefined })
          });
          var j = await r.json().catch(function () { return {}; });
          if (!r.ok) { setStatus(j.message || "음성 변환에 실패했습니다. 다시 시도해 주세요."); }
          else {
            var t = (j.text || "").trim();
            if (!t) setStatus("음성을 인식하지 못했습니다. 다시 또렷하게 말씀해 주세요.");
            else {
              qEl.value = (qEl.value ? qEl.value.trim() + " " : "") + t;
              if (qEl.value.length > MAX_CHARS) qEl.value = qEl.value.slice(0, MAX_CHARS);
              updateCnt(); autoGrow(); qEl.focus();
              setStatus("🎤 음성 입력 완료 — 내용을 확인하고 전송하세요.");
            }
          }
        } catch (e) { setStatus("음성 변환 중 오류가 발생했습니다. 다시 시도해 주세요."); }
        micEl.disabled = false;
        setTimeout(function () { if ((statusEl.textContent || "").indexOf("🎤") === 0) setStatus(RELAY_URL ? "AI 서버 연결됨" : ""); }, 4000);
      };

      try { mediaRec.start(); recording = true; micEl.classList.add("rec"); setStatus("🎤 녹음 중… 다시 누르면 변환합니다."); }
      catch (e) { stopStream(); reset(); setStatus("녹음을 시작하지 못했습니다."); }
    };
  }

  function renderSuggestions() {
    suggEl.innerHTML = "";
    SUGGESTIONS.forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = s;
      b.onclick = function () { doSend(s.replace(/^[^\w가-힣]+\s*/, "")); };  // 이모지 접두 제거 후 전송
      suggEl.appendChild(b);
    });
  }

  // ── 초기화 ──
  function init() {
    logEl = $("log"); qEl = $("q"); sendEl = $("send"); cntEl = $("cnt");
    statusEl = $("status"); introEl = $("intro"); suggEl = $("sugg"); micEl = $("mic");

    renderSuggestions();
    updateCnt();
    statusEl.textContent = RELAY_URL ? "AI 서버 연결됨" : "연동 준비 중 — 화면/개인정보 차단은 동작합니다";
    restoreActive();  // 이 기기에 저장된 '현재 대화' 복원
    initVoice();      // 음성 입력(지원 시)

    // 모드 토글
    var mc = $("modeChat"); if (mc) mc.onclick = function () { setMode("chat"); };
    var ms = $("modeSurvey"); if (ms) ms.onclick = function () { setMode("survey"); };
    var mst = $("modeStats"); if (mst) mst.onclick = function () { setMode("stats"); };

    // 대화 기록 모달
    var bh = $("btnHistory"); if (bh) bh.onclick = openHist;
    var hc = $("histClose"); if (hc) hc.onclick = closeHist;
    var hm = $("histModal"); if (hm) hm.addEventListener("click", function (e) { if (e.target === hm) closeHist(); });

    sendEl.onclick = function () { doSend(); };
    $("btnNew").onclick = newChat;
    qEl.addEventListener("input", function () { updateCnt(); autoGrow(); });
    qEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); }   // Enter 전송, Shift+Enter 줄바꿈
    });

    // index.html 통합검색에서 넘어온 질문 자동 입력(선택): chatbot.html?q=...
    try {
      var p = new URLSearchParams(location.search).get("q");
      if (p) { qEl.value = p.slice(0, MAX_CHARS); updateCnt(); autoGrow(); }
    } catch (e) {}
    qEl.focus();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
