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
    iframe.src = `http://localhost:5173/chatbot?user_id=${userId}&bot_id=${botId}`;
    // iframe.src = `https://fusion-ai-zeta.vercel.app/chatbot?bot_id=${botId}`;

    iframe.style.borderRadius = "50%";
    iframe.style.width = "55px";
    iframe.style.height = "55px";
  } else {
    iframe.style.width = "220px";
    iframe.style.height = "45px";
    iframe.src = `http://localhost:5173/chatbot-id-not-found`;
  }

  document.body.appendChild(iframe);

  window.addEventListener("message", (e) => {
    if (e.data == "widget:open") {
      Object.assign(iframe.style, {
        width: "500px",
        height: "600px",
        borderRadius: "15px",
        border: "0px solid black",
      });
      // console.log("hbfhvbfhvbhfb");
    }
    if (e.data == "widget:close") {
      Object.assign(iframe.style, {
        width: "55px",
        height: "55px",
        borderRadius: "100px",
        border: "1px solid black",
      });
    }
  });
})();
