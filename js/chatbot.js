/* chatbot.js · 두당 AI 챗봇 · 저장: 2026-10-31 05:18 KST · v90[접근제어]: 전송 시 Firebase ID토큰 첨부(window.__dudangAuth.getToken) → 서버 승인검증. 게이트는 chatbot.html 모듈 스크립트. v89[조사표 부호 연동]: 답변 참고자료에 '🔢 조사표 부호' 링크 추가(buildMeta codes 매핑·중복제거). 서버(Lambda v4)가 codes.json으로 부호 근거 제공. v88[PWA 헤더 수정]. v87[3단계 연결완료]: RELAY_URL에 aws_dudang_ai 함수 URL 입력 → 실제 OpenAI 답변 연결. (AWS 검증완료: 빈질문400·개인정보차단·OpenAI한국어답변200). v86[3단계 연결준비]: 서버 전송 history를 '현재 질문 제외 이전 맥락'으로 정정(서버가 뒤에 현재 질문 추가 → 중복 방지). v85[신규·2단계 화면]
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
  var logEl, qEl, sendEl, cntEl, statusEl, introEl, suggEl;
  var history = [];      // {role:'user'|'assistant', content} — 메모리에만. 새 대화 시 비움.
  var busy = false;

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
  function scrollDown() { try { window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); } catch (e) { window.scrollTo(0, document.body.scrollHeight); } }

  function addMsg(role, text, metaHtml) {
    hideIntro();
    var cls = role === "me" ? "me" : role === "err" ? "err" : "ai";
    var av = role === "me" ? "🧑" : role === "err" ? "⚠️" : "🐮";
    var div = document.createElement("div");
    div.className = "msg " + cls;
    div.innerHTML = "<div class='av'>" + av + "</div><div class='bubble'>" + esc(text).replace(/\n/g, "<br>") +
      (metaHtml ? "<div class='meta'>" + metaHtml + "</div>" : "") + "</div>";
    logEl.appendChild(div);
    scrollDown();
    return div;
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
    text = (text || qEl.value || "").trim();
    if (!text) return;
    if (text.length > MAX_CHARS) { addMsg("err", "질문이 너무 깁니다. " + MAX_CHARS + "자 이내로 줄여 주세요. (현재 " + text.length + "자)"); return; }

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

    addMsg("me", text);
    var priorHist = history.slice(-8);          // 이전 맥락(현재 질문 제외) — 서버에서 현재 질문을 뒤에 붙임
    history.push({ role: "user", content: text });
    qEl.value = ""; updateCnt(); autoGrow();

    if (!RELAY_URL) { mockAnswer(text); return; }   // 목 모드(AWS 연결 전)

    busy = true; sendEl.disabled = true;
    var typing = addTyping();
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, REQUEST_TIMEOUT_MS);

    // 로그인 토큰(있으면) 첨부 → 서버에서 승인 검증
    var tokP = (window.__dudangAuth && window.__dudangAuth.getToken) ? window.__dudangAuth.getToken() : Promise.resolve(null);
    tokP.then(function (idToken) {
      return fetch(RELAY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: priorHist, idToken: idToken || undefined }),
        signal: ctrl.signal
      });
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, j: j }; }); })
      .then(function (res) {
        clearTimeout(timer); typing.remove();
        if (!res.ok) { showServerError(res.status, res.j); return; }
        var j = res.j || {};
        if (j.blocked) { addMsg("err", j.message || "개인정보가 포함되어 서버에서 전송이 차단되었습니다. 식별정보를 빼고 다시 질문해 주세요."); return; }
        var ans = j.answer || j.message || "답변을 받지 못했습니다.";
        addMsg("ai", ans, buildMeta(j.sources));
        history.push({ role: "assistant", content: ans });
      })
      .catch(function (e) {
        clearTimeout(timer); typing.remove();
        if (e && e.name === "AbortError") addMsg("err", "응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.");
        else addMsg("err", "AI 서버에 연결하지 못했습니다. 네트워크 상태를 확인하고 다시 시도해 주세요.");
      })
      .then(function () { busy = false; sendEl.disabled = false; });
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
  function autoGrow() { qEl.style.height = "auto"; qEl.style.height = Math.min(qEl.scrollHeight, 120) + "px"; }

  function newChat() {
    history = [];
    logEl.innerHTML = "";
    if (introEl) introEl.style.display = "";
    qEl.value = ""; updateCnt(); autoGrow(); qEl.focus();
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
    statusEl = $("status"); introEl = $("intro"); suggEl = $("sugg");

    renderSuggestions();
    updateCnt();
    statusEl.textContent = RELAY_URL ? "AI 서버 연결됨" : "연동 준비 중 — 화면/개인정보 차단은 동작합니다";

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
