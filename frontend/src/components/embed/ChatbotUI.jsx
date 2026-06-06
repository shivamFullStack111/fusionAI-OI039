import React, { useEffect, useState, useRef } from "react";
import {
  Send,
  X,
  MessageCircle,
  Zap,
  Bot,
  ThumbsUp,
  Star,
  Check,
  LineSquiggle,
  MessagesSquare,
  PanelRightClose,
  SquarePen,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { DB_URL } from "../../../utils/variables.js";
import Loader from "../common/Loader";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ChatbotUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatbot, setChatbot] = useState(null);
  const [sections, setSections] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [userCurrentPlan, setuserCurrentPlan] = useState(null);

  const [currentConversationId, setcurrentConversationId] = useState("");

  const [conversationSidebarOpen, setconversationSidebarOpen] = useState(false);

  const [userAllConversations, setuserAllConversations] = useState([]);

  useEffect(() => {
    const chatbotId = params.get("bot_id");
    const external_userId = params.get("user_id");

    if (!chatbotId) {
      setError({
        title: "Not Found!",
        message: "Provide chatbot id in script tag",
      });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          DB_URL + "/chatbot/get-chatbot-and-required-data",
          {
            chatbotId,
            external_userId,
          },
        );

        if (res.data?.success) {
          setChatbot(res.data.chatbot);
          setSections(res.data.sections);
          setConversation(res.data.conversation);
          setcurrentConversationId(res?.data.conversation?._id || "");

          setAllMessages([
            {
              role: "ai",
              content:
                res.data.chatbot?.welcomeMessage ||
                "Hi there! How can I assist you today?",
            },
          ]);
        } else {
          setError({
            title: "Error fetching data",
            message: res.data?.message,
          });
        }
      } catch (err) {
        setError({
          title: "Error fetching data",
          message: err?.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpen = () => {
    window.parent.postMessage("widget:open", "*");
    setTimeout(() => setIsOpen(true), 50);
  };

  const handleClose = () => {
    window.parent.postMessage("widget:close", "*");
    setIsOpen(false);
  };

  // send message
  const handleSend = async (text) => {
    const chatbotId = params.get("bot_id");
    const external_userId = params.get("user_id");

    const userMessage = { role: "user", content: text };
    setAllMessages((prev) => [...prev, userMessage]);
    if (!conversation?.isTicketRaised) setIsTyping(true);
    else setIsTyping(false);

    try {
      const res = await axios.post(DB_URL + "/message/send-message", {
        message: text,
        conversationId: conversation?._id,
        chatbotId: chatbot?._id,
        sections,
        allMessages,
        userId: chatbot?.userId,

        // for create conversation on first message if not exist
        external_userId: external_userId,
      });

      if (res.data?.success) {
        if (res?.data?.isNewConversation) {
          setuserAllConversations((prev) => [
            {
              _id: res.data?.conversation?._id,
              chatbotId: chatbotId,
              externaluserId: external_userId,
            },
            ...prev,
          ]);
        }

        if (res?.data?.conversationWithTicketRaised) {
          // do nothing
        } else {
          const aiMessage = {
            role: "ai",
            content: res.data.aiMessage?.content,
          };
          setAllMessages((prev) => [...prev, aiMessage]);
          if (res?.data?.aiMessage?.content == "Conversation Ended") {
            setConversation((p) => ({ ...p, isEnded: true }));
          }
          if (res?.data?.aiMessage?.content == "Ticket Raised!") {
            toast.success(
              "A support ticket has been raised. Our team will get back to you soon.",
            );
            setConversation((p) => ({ ...p, isTicketRaised: true }));
          }

          setConversation(res.data.conversation);
          setcurrentConversationId(res.data.conversation?._id);
        }
      } else {
        toast.error(res?.data?.message);
      }
    } catch {
      setAllMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const primaryColor = chatbot?.primaryColor || "#6366f1";

  return (
    <div className="flex bg-transparent justify-end items-end w-full h-full">
      {!isOpen && (
        <ChatButton onClick={handleOpen} primaryColor={primaryColor} />
      )}

      {isOpen && (
        <div className="w-full h-full">
          {loading && <LoadingState onClose={handleClose} />}
          {error && !loading && (
            <ErrorState error={error} onClose={handleClose} />
          )}
          {!loading && !error && (
            <ChatWindow
              conversationSidebarOpen={conversationSidebarOpen}
              setcurrentConversationId={setcurrentConversationId}
              setconversationSidebarOpen={setconversationSidebarOpen}
              conversation={conversation}
              setConversation={setConversation}
              chatbot={chatbot}
              messages={allMessages}
              setmessages={setAllMessages}
              isTyping={isTyping}
              onSend={handleSend}
              onClose={handleClose}
              primaryColor={primaryColor}
              currentConversationId={currentConversationId}
              userAllConversations={userAllConversations}
              setuserAllConversations={setuserAllConversations}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Modern Chat Button
const ChatButton = ({ onClick, primaryColor }) => (
  <button
    onClick={onClick}
    className="group flex cursor-pointer mt-auto ml-auto w-[48px] h-[48px] items-center justify-center rounded-full shadow-lg  transition-all duration-300"
    style={{ backgroundColor: primaryColor }}
  >
    <MessageCircle size={24} className="text-white" />
    <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </button>
);

// Loading State
const LoadingState = ({ onClose }) => (
  <div className="h-[600px] w-full bg-[#0f0f13] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
    <div className="p-4 flex justify-end border-b border-white/10">
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X className="text-white/60 hover:text-white" size={18} />
      </button>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <Loader />
    </div>
  </div>
);

// Error State
const ErrorState = ({ error, onClose }) => (
  <div className="h-[600px] w-full bg-[#0f0f13] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
    <div className="p-4 flex justify-end border-b border-white/10">
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X className="text-white/60 hover:text-white" size={18} />
      </button>
    </div>
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="bg-red-500/10 rounded-xl p-5 max-w-sm border border-red-500/20">
        <div className="flex gap-2 items-center mb-2">
          <span className="text-red-500 text-lg">⚠️</span>
          <p className="text-red-500 font-semibold">{error?.title}</p>
        </div>
        <p className="text-red-400/70 text-sm">{error?.message}</p>
      </div>
    </div>
  </div>
);

// Main Chat Window
const ChatWindow = ({
  chatbot,
  messages,
  setmessages,
  isTyping,
  onSend,
  onClose,
  primaryColor,
  conversation,
  setConversation,
  setconversationSidebarOpen,
  conversationSidebarOpen,
  currentConversationId,
  setcurrentConversationId,

  userAllConversations,
  setuserAllConversations,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [visibleMessages, setVisibleMessages] = useState(new Set());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    const newIds = new Set(messages.map((_, i) => i));
    setTimeout(() => setVisibleMessages(newIds), 50);
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="h-150 relative w-full bg-[#0f0f13] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
      {/* Header */}

      {/* sidebar of user conversations   */}
      <SidebarOfUserConversations
        currentConversationId={currentConversationId}
        setcurrentConversationId={setcurrentConversationId}
        conversationSidebarOpen={conversationSidebarOpen}
        setconversationSidebarOpen={setconversationSidebarOpen}
        chatbot={chatbot}
        setConversation={setConversation}
        allMessages={messages}
        setAllMessages={setmessages}
        userAllConversations={userAllConversations}
        setuserAllConversations={setuserAllConversations}
      />

      <div className="relative p-4 border-b border-white/10 bg-linear-to-br from-[#1a1a1f] to-[#0f0f13]">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            onClick={() => {
              setconversationSidebarOpen(true);
            }}
            className="w-10 h-10 text-gray-400 hover:text-white cursor-pointer rounded-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <MessagesSquare size={20} />
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            {chatbot?.avatarUrl ? (
              <img
                src={chatbot.avatarUrl}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <Bot size={20} style={{ color: primaryColor }} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="text-white font-semibold text-base">
              {chatbot?.name || "FusionAI"}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white/40 text-xs">Online</span>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="text-white/60 hover:text-white" size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {messages && messages?.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Bot
                size={40}
                style={{ color: `${primaryColor}40` }}
                className="mx-auto mb-3"
              />
              <p className="text-white/40 text-sm">Ask me anything!</p>
            </div>
          </div>
        )}
        {messages &&
          messages?.map((msg, idx) => (
            <MessageBubble
              setConversation={setConversation}
              message={msg}
              isVisible={visibleMessages.has(idx)}
              primaryColor={primaryColor}
              conversation={conversation}
            />
          ))}

        {isTyping && <TypingIndicator primaryColor={primaryColor} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input & Branding */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-t from-[#1a1a1f] to-transparent">
        {!conversation?.isEnded && (
          <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 transition-all placeholder:text-white/30"
              style={{
                borderColor: `${primaryColor}40`,
                focusRingColor: primaryColor,
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-xl px-4 py-2.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                backgroundColor: input.trim() ? primaryColor : "#27272a",
                boxShadow: input.trim()
                  ? `0 4px 12px ${primaryColor}40`
                  : "none",
              }}
            >
              <Send size={16} className="text-white" />
            </button>
          </form>
        )}

        {conversation?.isEnded && (
          <div className="flex gap-2 mb-2">
            <p className="  text-zinc-600   w-full text-center ">
              This Conversation is Ended!
            </p>
          </div>
        )}

        {/* Branding */}
        {chatbot?.isBranding && (
          <div className="flex items-center justify-center gap-1.5">
            <Zap size={10} style={{ color: `${primaryColor}80` }} />
            <span className="text-[10px] text-white/30 tracking-wide">
              Powered by{" "}
              <span className="font-semibold" style={{ color: primaryColor }}>
                {chatbot?.brandName || "BotFlow"}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const SidebarOfUserConversations = ({
  setconversationSidebarOpen,
  setConversation,
  setcurrentConversationId,
  conversationSidebarOpen,
  currentConversationId,
  chatbot,
  allMessages,
  setAllMessages,
  userAllConversations,
  setuserAllConversations,
}) => {
  const [params] = useSearchParams();
  const [external_userId, setexternal_userId] = useState("");

  useEffect(() => {
    const external_userId = params.get("user_id");
    setexternal_userId(external_userId);
  }, []);

  useEffect(() => {
    if (!external_userId) return;

    const fetchUserAllConversations = async () => {
      const chatbotId = params.get("bot_id");

      try {
        const res = await axios.post(
          DB_URL + "/conversation/get-external-user-all-conversations",
          {
            chatbotId: chatbotId,
            externalUserId: external_userId,
          },
        );

        console.log(res.data);
        if (res.data?.success) {
          setuserAllConversations(res.data.allConversations);
        } else {
          toast.error(res.data?.message || "Failed to fetch conversations");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchUserAllConversations();
  }, [external_userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
        const res = await axios.post(
          DB_URL + "/message/get-all-messages-of-conversation",
          { conversationId: currentConversationId },
          { headers: { Authorization: accessToken } },
        );

        if (res.data.success) {
          setAllMessages(res.data?.messages);
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.message);
      }
    };

    fetchMessages();
  }, [currentConversationId]);

  const handleNewChat = () => {
    setcurrentConversationId("");
    setConversation(null);
    setAllMessages([
      {
        role: "ai",
        content:
          chatbot?.welcomeMessage || "Hi there! How can I assist you today?",
      },
    ]);

    setconversationSidebarOpen(false);
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{
        x: conversationSidebarOpen ? 0 : -300,
        opacity: conversationSidebarOpen ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      className="w-80 top-0 left-0  h-full bg-[#0f0f13b3] backdrop-blur-sm  absolute z-50"
    >
      {/* close buttoon  */}
      <div
        onClick={() => {
          setconversationSidebarOpen(false);
        }}
        className="p-3  flex justify-end border-b border-white/10 "
      >
        <PanelRightClose className=" text-gray-400 hover:text-white cursor-pointer  " />
      </div>

      <div className="p-3">
        <div className="p-3 bg-black/20 hover:bg-black/40 rounded-lg cursor-pointer  ">
          <div onClick={handleNewChat} className=" flex gap-3 items-center ">
            <SquarePen size={20} />
            <h2 className="text-[12px]">New Chat</h2>
          </div>
        </div>
      </div>

      <p className="border-b h-1"></p>
      <div className="p-3">
        <h2 className="text-sm font-semibold   text-gray-400">Conversations</h2>
        <div className="flex mt-3 flex-col">
          {userAllConversations?.map((con, i) => (
            <div
              onClick={() => {
                setcurrentConversationId(con?._id);
                setConversation(con);
                setconversationSidebarOpen(false);
              }}
              key={i}
              className="p-3 hover:bg-black/40 rounded-lg cursor-pointer  "
            >
              <div className=" flex justify-between  gap-3 items-center ">
                <h2 className="text-[12px] font-semibold">{con?.title}</h2>
                <h6 className="text-[10px] text-gray-600">
                  {new Date(con?.updatedAt).toLocaleDateString()}
                </h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

import Cookies from "js-cookie";

const MessageBubble = ({
  message,
  isVisible,
  primaryColor,
  conversation,
  onReviewSubmitted,
  setConversation,
}) => {
  const isAi = message.role === "ai" || message.role === "support";
  const text = message.content;
  const isConversationEnded = text === "Conversation Ended";

  const [ratings, setRatings] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (ratings === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const accessToken = Cookies.get("accessToken");
      const res = await axios.post(
        DB_URL + "/conversation/submit-review",
        {
          conversationId: conversation?._id,
          ratings: ratings,
          message: reviewMessage,
        },
        {
          headers: { Authorization: accessToken },
        },
      );

      if (res.data.success) {
        toast.success("Thank you for your feedback!");
        setConversation((p) => ({
          ...p,
          review: {
            ratings,
            message: reviewMessage,
          },
        }));
        onReviewSubmitted &&
          onReviewSubmitted({ ratings, message: reviewMessage });
      } else {
        toast.error(res.data?.message || "Failed to submit review");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (conversation?.review?.ratings) {
      setRatings(conversation.review.ratings);
    }
    if (conversation?.review?.message) {
      setReviewMessage(conversation.review.message);
    }
  }, [conversation]);

  return (
    <div
      className={`flex gap-2.5 ${isAi ? "justify-start" : "justify-end"} transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {isConversationEnded && !conversation?.review?.ratings && (
        <div className="w-full max-w-md mx-auto my-4">
          <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 mb-3">
                <ThumbsUp size={24} className="text-yellow-500" />
              </div>
              <h3 className="text-white font-semibold text-lg">
                How was your experience?
              </h3>
              <p className="text-white/40 text-sm mt-1">
                Your feedback helps us improve
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatings(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`transition-all ${
                      star <= (hoverRating || ratings)
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-white/10 text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Rating Labels */}
            <div className="flex gap-2 justify-center text-xs text-white/40 mb-4 px-2">
              <span>Very Poor</span>
              <span>Poor</span>
              <span>Average</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>

            {/* Feedback Message */}
            <div className="mb-4">
              <label className="text-sm text-white/60 mb-2 block">
                Additional feedback (optional)
              </label>
              <div className="relative">
                <textarea
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  placeholder="Tell us what you liked or how we can improve..."
                  rows="3"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all resize-none"
                />
                <MessageCircle
                  size={16}
                  className="absolute right-3 bottom-3 text-white/20"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {/* <button
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-all"
              >
                Skip
              </button> */}
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting || ratings === 0}
                style={{ backgroundColor: primaryColor }}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-t text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isConversationEnded && conversation?.review?.ratings && (
        <div className="w-full max-w-md mx-auto my-4">
          <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 mb-3">
                <ThumbsUp size={24} className="text-yellow-500" />
              </div>
              <h3 className="text-white font-semibold text-lg">
                How was your experience?
              </h3>
              <p className="text-white/40 text-sm mt-1">
                Your feedback helps us improve
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`transition-all ${
                      star <= (hoverRating || ratings)
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-white/10 text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Rating Labels */}
            <div className="flex gap-2 justify-center text-xs text-white/40 mb-4 px-2">
              <span>Very Poor</span>
              <span>Poor</span>
              <span>Average</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>

            {/* Feedback Message */}
            <div className="mb-4">
              <label className="text-sm text-white/60 mb-2 block">
                Additional feedback (optional)
              </label>
              <div className="relative">
                <textarea
                  disabled
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  placeholder="Tell us what you liked or how we can improve..."
                  rows="3"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all resize-none"
                />
                <MessageCircle
                  size={16}
                  className="absolute right-3 bottom-3 text-white/20"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {/* <button
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-all"
              >
                Skip
              </button> */}
              <button
                onClick={handleSubmitReview}
                disabled={true}
                style={{ backgroundColor: primaryColor }}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-t text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <>
                  Submited
                  <Check />
                </>
              </button>
            </div>
          </div>
        </div>
      )}

      {!isConversationEnded && (
        <>
          {isAi && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Bot size={14} style={{ color: primaryColor }} />
            </div>
          )}
          <div
            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              isAi
                ? "bg-white/5 text-white/90 rounded-tl-sm border border-white/10"
                : "text-white rounded-br-sm shadow-lg"
            }`}
            style={!isAi ? { backgroundColor: primaryColor } : {}}
          >
            {text}
          </div>
          {!isAi && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center shrink-0">
              <span className="text-xs">👤</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Modern Typing Indicator
const TypingIndicator = ({ primaryColor }) => (
  <div className="flex gap-2.5 justify-start">
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${primaryColor}15` }}
    >
      <Bot size={14} style={{ color: primaryColor }} />
    </div>
    <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-2.5 border border-white/10">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.8s",
              backgroundColor: primaryColor,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default ChatbotUI;
