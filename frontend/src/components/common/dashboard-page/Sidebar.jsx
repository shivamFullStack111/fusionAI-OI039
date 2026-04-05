import {
  BookOpen,
  Bot,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Settings,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-full overflow-y-auto  flex flex-col border-r w-70">
      <Link to={"/"} className="flex gap-2  items-center  p-3 border-b">
        <img
          className="h-7 w-7 object-cover p-1 rounded-full border-2 border-gray-300 "
          src="icons/logo.png"
          alt=""
        />
        <p className="font-semibold">FusionAI</p>
      </Link>

      <div className="p-5 flex mt-6 flex-col gap-2">
        <Link
          to={"/dashboard"}
          className="flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer p-2 rounded-lg hover:bg-zinc-950 gap-3"
        >
          <LayoutDashboard size={20} />
          <p className="text-sm ">Dashboard</p>
        </Link>

        <Link
          to={"/dashboard/knowledge"}
          className="flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer p-2 rounded-lg hover:bg-zinc-950 gap-3"
        >
          <BookOpen size={20} />
          <p className="text-sm ">Knowledge</p>
        </Link>

        <Link
          to={"/dashboard/sections"}
          className="flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer p-2 rounded-lg hover:bg-zinc-950 gap-3"
        >
          <Layers size={20} />
          <p className="text-sm ">Sections</p>
        </Link>

        <Link
          to={"/dashboard/chatbot"}
          className="flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer p-2 rounded-lg hover:bg-zinc-950 gap-3"
        >
          <Bot size={20} />
          <p className="text-sm ">Chatbot</p>
        </Link>

        <Link
          to={"/dashboard/conversations"}
          className="flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer p-2 rounded-lg hover:bg-zinc-950 gap-3"
        >
          <MessageCircle size={20} />
          <p className="text-sm ">Conversations</p>
        </Link>

        <Link
          to={"/dashboard/settings"}
          className="flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer p-2 rounded-lg hover:bg-zinc-950 gap-3"
        >
          <Settings size={20} />
          <p className="text-sm ">Settings</p>
        </Link>
      </div>

      <div className="mt-auto p-4 flex gap-3">
        <p className="bg-zinc-900 text-zinc-600 text-lg rounded-full h-9 w-9 justify-center items-center flex">
          s
        </p>
        <div>
          <p className="text-sm font-semibold">Shivam Org.</p>
          <p className="text-xs text-zinc-700 ">shivam@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
