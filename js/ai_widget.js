/* ai_widget.js · 두당 플로팅 AI 위젯 · 저장: 2026-11-02 05:30 KST
   역할: 모든 페이지 우측 하단에 🐮 AI 버튼을 띄우고, 누르면 팝업(iframe=chatbot.html?embed=1)으로
         어디서나 질문·검색. 조사표(②) 답변의 [📝 조사표에 입력]을 누르면 부모창(이 스크립트)이 받아서
         조사표 페이지면 그 자리에서 미리보기, 아니면 survey.html로 이동해 반영.
   원칙: 자립형(다른 코드 무변경, 페이지엔 <script src="js/ai_widget.js"></script> 한 줄만 추가).
         챗봇 자신(chatbot.html)·iframe 내부에서는 표시하지 않음. */
(function () {
  "use strict";
  try {
    // chatbot 자신 / iframe 내부에서는 위젯 미표시
    if (window.self !== window.top) return;
    if (/chatbot\.html$/i.test(location.pathname)) return;
    if (window.__dudangAiWidget) return;  // 중복 주입 방지
    window.__dudangAiWidget = true;

    var CHAT_URL = "chatbot.html?embed=1";
    var open = false, built = false;
    var btn, overlay, panel, frame;

    function build() {
      if (built) return; built = true;

      // 플로팅 버튼
      btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "두당 AI 열기");
      btn.innerHTML = "<span style='font-size:22px;line-height:1'>🐮</span><span class='lbl'>AI</span>";
      btn.style.cssText =
        "position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:2147483000;" +
        "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;" +
        "width:60px;height:60px;border-radius:50%;border:0;cursor:pointer;" +
        "background:linear-gradient(135deg,#1a365d,#2a4a7f);color:#fff;font-weight:800;" +
        "box-shadow:0 6px 18px rgba(26,54,93,.42);-webkit-tap-highlight-color:transparent;";
      var lbl = btn.querySelector(".lbl");
      if (lbl) lbl.style.cssText = "font-size:10px;letter-spacing:.3px;";
      btn.onclick = toggle;

      // 팝업 오버레이 + 패널
      overlay = document.createElement("div");
      overlay.style.cssText =
        "position:fixed;inset:0;z-index:2147483001;background:rgba(0,0,0,.35);display:none;";
      overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });

      panel = document.createElement("div");
      panel.style.cssText =
        "position:fixed;z-index:2147483002;background:#fff;display:flex;flex-direction:column;overflow:hidden;" +
        "right:16px;bottom:16px;width:min(400px,calc(100vw - 24px));height:min(640px,calc(100dvh - 24px));" +
        "border-radius:16px;box-shadow:0 14px 48px rgba(0,0,0,.33);";

      var bar = document.createElement("div");
      bar.style.cssText =
        "flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:8px;" +
        "padding:10px 12px;background:linear-gradient(135deg,#1a365d,#2a4a7f);color:#fff;";
      bar.innerHTML = "<div style='font-weight:800;font-size:14px'>💬 두당 AI</div>";
      var x = document.createElement("button");
      x.type = "button"; x.setAttribute("aria-label", "닫기"); x.textContent = "✕";
      x.style.cssText = "background:rgba(255,255,255,.16);border:0;color:#fff;border-radius:8px;width:30px;height:30px;font-size:15px;cursor:pointer;";
      x.onclick = close;
      bar.appendChild(x);

      frame = document.createElement("iframe");
      frame.title = "두당 AI";
      frame.setAttribute("allow", "microphone");
      frame.style.cssText = "flex:1;width:100%;border:0;background:#f4f7fb;";
      // src는 첫 열람 때 지정(지연 로드 → Firebase/챗봇은 열 때만 로드)

      panel.appendChild(bar);
      panel.appendChild(frame);
      overlay.appendChild(panel);

      // 모바일: 거의 전체화면
      applyResponsive();
      window.addEventListener("resize", applyResponsive);

      (document.body || document.documentElement).appendChild(btn);
      (document.body || document.documentElement).appendChild(overlay);
    }

    function applyResponsive() {
      if (!panel) return;
      if (window.innerWidth <= 520) {
        panel.style.right = "0"; panel.style.bottom = "0";
        panel.style.width = "100vw"; panel.style.height = "100dvh";
        panel.style.borderRadius = "0";
      } else {
        panel.style.right = "16px"; panel.style.bottom = "16px";
        panel.style.width = "min(400px,calc(100vw - 24px))";
        panel.style.height = "min(640px,calc(100dvh - 24px))";
        panel.style.borderRadius = "16px";
      }
    }

    function toggle() { open ? close() : openPanel(); }

    function openPanel() {
      build();
      if (!frame.getAttribute("src")) frame.setAttribute("src", CHAT_URL);  // 첫 열람 시 로드
      overlay.style.display = "block";
      btn.style.display = "none";
      open = true;
      try { document.documentElement.style.overflow = "hidden"; } catch (e) {}
    }

    function close() {
      if (overlay) overlay.style.display = "none";
      if (btn) btn.style.display = "flex";
      open = false;
      try { document.documentElement.style.overflow = ""; } catch (e) {}
    }

    // 챗봇(iframe)에서 온 메시지 처리: 조사표 핸드오프 / 닫기
    window.addEventListener("message", function (ev) {
      var d = ev && ev.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "dudang-ai-close") { close(); return; }
      if (d.type === "dudang-ai-handoff") {
        close();
        // 조사표 페이지면 그 자리에서 미리보기 모달 열기, 아니면 조사표로 이동(로드 시 자동 열림)
        if (typeof window.__aiHandoffOpen === "function") {
          try { window.__aiHandoffOpen(); return; } catch (e) {}
        }
        location.href = "survey.html";
      }
    });

    // Esc로 닫기
    window.addEventListener("keydown", function (e) { if (open && e.key === "Escape") close(); });

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
    else build();
  } catch (e) { /* 위젯 실패는 페이지에 영향 주지 않음 */ }
})();
