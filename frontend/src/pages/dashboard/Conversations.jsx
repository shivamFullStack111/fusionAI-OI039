import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import {
  Search,
  Send,
  Bot,
  User,
  Ticket,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { DB_URL } from "../../../utils/variables.js";

const Conversations = () => {
  const [allConversations, setAllConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingConversations(true);
        const accessToken = Cookies.get("accessToken");
        const res = await axios.post(
          DB_URL + "/conversation/get-all-user-conversations",
          {},
          { headers: { Authorization: accessToken } },
        );

        if (res.data.success) {
          setAllConversations(res.data.allConversations);
          if (res.data.allConversations?.length > 0) {
            setSelectedConversation(res.data.allConversations[0]);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch conversations");
      } finally {
        setLoadingConversations(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!selectedConversation?._id) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const accessToken = Cookies.get("accessToken");
        const res = await axios.post(
          DB_URL + "/message/get-all-messages-of-conversation",
          { conversationId: selectedConversation._id },
          { headers: { Authorization: accessToken } },
        );

        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch messages");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // Resolve ticket
  const handleResolveTicket = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      const res = await axios.post(
        DB_URL + "/conversation/resolve-ticket",
        { conversationId: selectedConversation._id },
        { headers: { Authorization: accessToken } },
      );

      if (res.data?.success) {
        setSelectedConversation({
          ...selectedConversation,
          ticketResolved: true,
        });

        setAllConversations((prev) => {
          return prev.map((con) => {
            if (con?._id == selectedConversation?._id) {
              return {
                ...con,
                ticketResolved: true,
              };
            } else {
              return con;
            }
          });
        });

        toast.success("Ticket resolved!");
      } else {
        toast.error(res?.data?.message || "Failed to resolve ticket");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to resolve ticket");
    }
  };

  // Send message (admin response when ticketRaised is true)
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!selectedConversation?.isTicketRaised) {
      toast.error("Cannot send message. Ticket not raised.");
      return;
    }

    setIsSending(true);
    const messageToSend = inputMessage;
    setInputMessage("");

    // Optimistically add message to UI
    const tempMessage = {
      _id: Date.now(),
      role: "support",
      content: messageToSend,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const accessToken = Cookies.get("accessToken");
      const res = await axios.post(
        DB_URL + "/message/send-message-by-support", // SUPPORT is for admin and their users responses after ticket is raised
        {
          message: messageToSend,
          conversationId: selectedConversation._id,
        },
        { headers: { Authorization: accessToken } },
      );

      if (res.data.success) {
        toast.success("Response sent to user");
      } else {
        // Remove temp message on failure
        setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
        toast.error(res.data?.message || "Failed to send response");
      }
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send response");
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (
        selectedConversation?.isTicketRaised &&
        inputMessage.trim() &&
        !isSending
      ) {
        handleSendMessage();
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex w-full h-screen">
        {/* LEFT SIDEBAR - Conversations List */}
        <div className="w-[30%] border-r flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-zinc-300">Inbox</p>
              <p className="text-xs text-zinc-500">
                {allConversations?.length || 0} conversations
              </p>
            </div>

            {/* Search */}
            <div className="flex gap-2 items-center border border-zinc-800 p-2 mt-4 bg-zinc-950 rounded-lg">
              <Search size={18} className="text-zinc-500" />
              <input
                placeholder="Search conversations..."
                className="w-full outline-none text-sm bg-transparent text-zinc-300 placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loadingConversations ? (
              <div className="text-center text-zinc-500 py-8">Loading...</div>
            ) : allConversations.length === 0 ? (
              <div className="text-center text-zinc-500 py-8">
                No conversations
              </div>
            ) : (
              allConversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedConversation?._id === conv._id
                      ? "bg-zinc-900 border-l-4 border-l-blue-600"
                      : "bg-zinc-950 hover:bg-zinc-900/50 border border-zinc-900"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm text-zinc-300 font-medium truncate">
                          #{conv.externaluserId || "Visitor"}
                        </p>
                        {conv.isTicketRaised && !conv.ticketResolved && (
                          <span className="text-xs bg-yellow-600/20 text-yellow-500 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <AlertCircle size={10} />
                            Open
                          </span>
                        )}
                        {conv.ticketResolved && (
                          <span className="text-xs bg-green-600/20 text-green-500 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <CheckCircle size={10} />
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 mt-1 truncate">
                        {conv.title || "No title"}
                      </p>
                    </div>
                    <p className="text-xs text-zinc-700 shrink-0 ml-2">
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div className="border-b p-4 bg-zinc-950/50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-zinc-300">
                  #{selectedConversation?.externaluserId || "Visitor"}
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  Conversation ID: {selectedConversation?._id?.slice(-8)}
                </p>
              </div>
              {/* Ticket Status & Actions */}
              {selectedConversation && (
                <div>
                  {selectedConversation?.isTicketRaised &&
                    !selectedConversation?.ticketResolved && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-yellow-600/20 text-yellow-500 px-3 py-1.5 rounded-full flex items-center gap-2">
                          <AlertCircle size={12} />
                          Ticket Open - You can respond
                        </span>
                        <Button
                          onClick={handleResolveTicket}
                          size="sm"
                          variant="outline"
                          className="gap-2 border-green-600 text-green-600 hover:bg-green-600/10"
                        >
                          <CheckCircle size={14} />
                          Mark Resolved
                        </Button>
                      </div>
                    )}
                  {selectedConversation.ticketResolved && (
                    <span className="text-xs bg-green-600/20 text-green-500 px-3 py-1.5 rounded-full flex items-center gap-2">
                      <CheckCircle size={12} />
                      Ticket Resolved
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingMessages ? (
              <div className="text-center text-zinc-500 py-8">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-zinc-500 py-8">
                <Bot size={40} className="mx-auto mb-3 text-zinc-700" />
                <p>No messages yet</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <MessageBubble key={msg._id || idx} message={msg} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Enabled only if ticketRaised is true */}
          <div className="border-t p-4 bg-zinc-950/30">
            {!selectedConversation ? (
              <div className="text-center text-zinc-600 text-sm py-3">
                Select a conversation to view messages
              </div>
            ) : selectedConversation?.ticketResolved ? (
              <div className="text-center text-green-600/70 text-sm py-3 bg-green-600/5 rounded-lg border border-green-600/20">
                <CheckCircle size={16} className="inline mr-2" />
                This ticket has been resolved. Cannot send more messages.
              </div>
            ) : selectedConversation?.isEnded ? (
              <div className="text-center text-green-600/70 text-sm py-3 bg-green-600/5 rounded-lg border border-green-600/20">
                <CheckCircle size={16} className="inline mr-2" />
                This Conversation is Ended
              </div>
            ) : selectedConversation.isTicketRaised &&
              !selectedConversation.ticketResolved ? (
              <div className="flex gap-3">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your response to the user..."
                  className="min-h-15 max-h-30 resize-none bg-zinc-900 border-zinc-800 text-zinc-300 placeholder:text-zinc-600"
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputMessage.trim()}
                  className="self-end gap-2"
                >
                  <Send size={16} />
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </div>
            ) : selectedConversation?.ticketResolved ? (
              <div className="text-center text-green-600/70 text-sm py-3 bg-green-600/5 rounded-lg border border-green-600/20">
                <CheckCircle size={16} className="inline mr-2" />
                This ticket has been resolved. Cannot send more messages.
              </div>
            ) : (
              <div className="text-center text-zinc-600 text-sm py-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <AlertCircle
                  size={16}
                  className="inline mr-2 text-yellow-600"
                />
                Raise a ticket to respond to this user
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Message Bubble Component
const MessageBubble = ({ message }) => {
  const isAi = message.role === "ai" || message.role === "support"; // SUPPORT messages are also shown on left side as they are from admin/support
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}>
      {isAi && (
        <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center shrink-0">
          <Bot size={14} className="text-purple-500" />
        </div>
      )}

      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isAi
            ? "bg-zinc-900 text-zinc-300 rounded-tl-sm border border-zinc-800"
            : "bg-blue-600 text-white rounded-br-sm"
        }`}
      >
        <p className="whitespace-pre-wrap wrap-break-words">
          {message.content}
        </p>
        <p
          className={`text-[10px] mt-1 ${isAi ? "text-zinc-600" : "text-blue-200/70"}`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
          <User size={14} className="text-zinc-400" />
        </div>
      )}
    </div>
  );
};

export default Conversations;
