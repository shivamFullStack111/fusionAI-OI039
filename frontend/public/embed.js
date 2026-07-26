(function () {
  const script = document.currentScript;

  const userId = script.getAttribute("data-external-user-id");
  const botId = script.getAttribute("data-bot-id");

  const iframe = document.createElement("iframe");

  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.border = "none";
  iframe.style.zIndex = "9999";
  iframe.style.border = "1px solid black";
  iframe.style.display = "flex";
  iframe.style.justifyContent = "center";
  iframe.style.alignItems = "center";
  iframe.style.overflow = "hidden";
  iframe.style.backgroundColor = "#000";

  // bot id is required else show error
  if (botId) {
    // iframe.src = `http://localhost:5173/chatbot?user_id=${userId}&bot_id=${botId}`;
    iframe.src = `https://fusion-ai-zeta.vercel.app/chatbot?user_id=${userId}&bot_id=${botId}`;

    iframe.style.borderRadius = "50%";
    iframe.style.width = "55px";
    iframe.style.height = "55px";
  } else {
    iframe.style.width = "220px";
    iframe.style.height = "45px";
    // iframe.src = `http://localhost:5173/chatbot-id-not-found`;
    iframe.src = `https://fusion-ai-zeta.vercel.app/chatbot-id-not-found`;
  }

  document.body.appendChild(iframe);

  function openWidget() {
    const isMobile = window.innerWidth <= 768;

    Object.assign(iframe.style, {
      width: isMobile ? "95vw" : "500px",
      height: isMobile ? "600px" : "600px",
      right: isMobile ? "2.5vw" : "20px",
      bottom: "20px",
      borderRadius: isMobile ? "12px" : "15px",
      border: "0",
    });
  }

  function closeWidget() {
    Object.assign(iframe.style, {
      width: "55px",
      height: "55px",
      borderRadius: "50%",
      border: "1px solid black",
      overflow: "hidden",
      right: "20px",
      bottom: "20px",
    });
  }

  window.addEventListener("message", (e) => {
    if (e.data == "widget:open") {
      openWidget();

      // console.log("hbfhvbfhvbhfb");
    }
    if (e.data == "widget:close") {
      closeWidget();
    }
  });
})();
