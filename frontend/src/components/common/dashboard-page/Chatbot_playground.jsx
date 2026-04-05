// import React from "react";
// import { Loader, RefreshCw, Send } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { DB_URL } from "../../../../utils/variables.js";

// const Chatbot_playground = ({ className, fullHeight }) => {
//   const testChatApi = async ({
//     userId,
//     conversationId,
//     chatbotId,
//     message,
//     sections,
//     allMessages,
//   }) => {
//     try {
//       const res = await axios.post(DB_URL+"/api/chat/test-message", {
//         userId,
//         conversationId,
//         chatbotId,
//         message,
//         sections,
//         allMessages,
//       });

//       return res.data;
//     } catch (error) {
//       return {
//         success: false,
//         message: error.message,
//       };
//     }
//   };

//   return (
//     <div
//       className={`border-2 rounded-xl flex flex-col   w-full rounded-ld p-2 ${className}`}
//     >
//       {/* head  */}
//       <div className="p-4 flex gap-3  items-center bg-[#0d0d0d] rounded-t-xl">
//         <p className="bg-green-500 h-2 w-2 rounded-full"></p>
//         <p className="text-sm text-white/60 ">Test Environment</p>
//         <Button
//           variant="secondary"
//           className={"ml-auto text-xs! cursor-pointer"}
//         >
//           <RefreshCw size={17} /> Reset
//         </Button>
//       </div>

//       {/* messages conatiner  */}
//       <div
//         className={`  px-8 flex flex-col gap-4 py-4 overflow-y-auto scrollbar-slim  ${fullHeight || "min-h-100 max-h-100 "}`}
//       >
//         <UserMessage />
//         <AiMessage />
//         <UserMessage />
//         <AiMessage />
//       </div>

//       {/* footer  */}
//       <div className="">
//         <div className="flex rounded-lg bg-zinc-950 p-3 items-center">
//           <input
//             placeholder="Type a message..."
//             className={
//               " w-full text-gray-300 text-sm outline-none! scrollbar-slim"
//             }
//           ></input>
//           <Send className="hover:scale-105 cursor-pointer" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chatbot_playground;

// const UserMessage = () => {
//   return (
//     <div className="flex ml-auto justify-start gap-3 max-w-[80%] ">
//       <div className="p-2 bg-[#1e1e1e] rounded-lg rounded-tr-xs  text-white/70 text-sm  ">
//         {" "}
//         Lorem, ipsum dolor sit amet consectetur adipisicing elit. A, praesentium
//         odit? Animi sed, iste nulla nesciunt maiores nihil labore error!
//       </div>
//       <img
//         className="h-8 w-8 rounded-full"
//         src="data:image/png;base64,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"
//         alt=""
//       />
//     </div>
//   );
// };

// const AiMessage = () => {
//   return (
//     // ..
//     <div className="flex justify-start gap-3 max-w-[80%] ">
//       <img
//         className="h-8 w-8 rounded-full"
//         src="data:image/png;base64,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"
//         alt=""
//       />
//       <div className="p-2 bg-white rounded-xl rounded-tl-xs text-black/80 text-sm  ">
//         {" "}
//         Lorem, ipsum dolor sit amet consectetur adipisicing elit. A, praesentium
//         odit? Animi sed, iste nulla nesciunt maiores nihil labore error!
//       </div>
//     </div>
//   );
// };

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, RefreshCw, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DB_URL } from "../../../../utils/variables.js";
import Cookies from "js-cookie";

const Chatbot_playground = ({
  className,
  fullHeight,
  primaryColorr,
  welcomeMessage,
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages(
      welcomeMessage ? [{ role: "ai", content: welcomeMessage }] : [],
    );
  }, [welcomeMessage]);

  const testChatApi = async (messageText) => {
    try {
      const accessToken = Cookies.get("accessToken");
      const res = await axios.post(
        DB_URL + "/message/test-message",
        {
          message: messageText,
          allMessages: messages,
        },
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );

      return res.data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // SEND MESSAGE
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const res = await testChatApi(input);

    if (res.success) {
      setMessages((prev) => [...prev, { role: "ai", content: res.aiResponse }]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Error: " + res.message,
        },
      ]);
    }

    setIsTyping(false);
  };

  // RESET CHAT
  const handleReset = () => {
    setMessages([]);
  };

  const primaryColor = primaryColorr || "#6366f1";

  return (
    <div className={`border rounded-xl flex flex-col w-full ${className}`}>
      {/* HEADER */}
      <div className="p-4 flex items-center bg-[#0d0d0d] rounded-t-xl">
        <span className="h-2 w-2 bg-green-500 rounded-full mr-2" />
        <p className="text-sm text-white/60">Test Environment</p>

        <Button
          onClick={handleReset}
          className="ml-auto text-xs"
          variant="secondary"
        >
          <RefreshCw size={14} /> Reset
        </Button>
      </div>

      {/* CHAT AREA */}
      <div
        className={`flex-1 min-h-100  px-4 py-4 overflow-y-auto flex flex-col gap-3 ${
          fullHeight || "max-h-[500px]"
        }`}
      >
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center text-white/40 text-sm">
              Ask anything to test your AI...
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} primaryColor={primaryColor} />
        ))}

        {isTyping && <TypingIndicator primaryColor={primaryColor} />}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-white/10 bg-[#111]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            className="flex-1 bg-white/5 text-white text-sm px-3 py-2 rounded-lg outline-none"
          />

          <button
            onClick={handleSend}
            className="px-4 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot_playground;

//////////////////// UI ////////////////////

const MessageBubble = ({ msg, primaryColor }) => {
  const isAi = msg.role === "ai";

  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
          isAi ? "bg-white/10 text-white" : "text-white"
        }`}
        style={!isAi ? { backgroundColor: primaryColor } : {}}
      >
        {msg.content}
      </div>
    </div>
  );
};

const TypingIndicator = ({ primaryColor }) => (
  <div className="flex gap-2 items-center">
    <Bot size={16} style={{ color: primaryColor }} />
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{
            backgroundColor: primaryColor,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  </div>
);
