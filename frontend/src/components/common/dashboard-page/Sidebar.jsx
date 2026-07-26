import {
  BookOpen,
  Bot,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Settings,
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  // get current path
  const currentPath = window.location.pathname;

  console.log(currentPath);

  return (
    <div className="h-full overflow-y-auto  flex flex-col border-r w-15 md:w-70 lg:w-70">
      <Link to={"/"} className="flex gap-2 max-md:hidden items-center  p-3 border-b">
        <img
          className="h-7 w-7 object-cover p-1 rounded-full border-2 border-gray-300 "
          src="https://res.cloudinary.com/dosyxpa1r/image/upload/v1779451314/logo_bbzx0w.png"
          alt=""
        />
        <p className="font-semibold">FusionAI</p>
      </Link>

      <div className="p-2 md:p-3 lg:p-5 flex mt-6 flex-col gap-2">
        <Link
          to={"/dashboard"}
          className={`flex items-center   cursor-pointer p-2 rounded-lg hover:bg-zinc-950 gap-3 ${currentPath === "/dashboard" ? "bg-zinc-950 text-blue-500" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <LayoutDashboard className="w-10" />
          <p className="text-sm max-md:hidden ">Dashboard</p>
        </Link>

        <Link
          to={"/dashboard/knowledge"}
          className={`flex items-center   cursor-pointer p-2 rounded-lg hover:bg-zinc-950 gap-3 ${currentPath === "/dashboard/knowledge" ? "bg-zinc-950 text-blue-500" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <BookOpen className="w-10" />
          <p className="text-sm max-md:hidden ">Knowledge</p>
        </Link>

        <Link
          to={"/dashboard/sections"}
          className={`flex items-center   cursor-pointer p-2 rounded-lg hover:bg-zinc-950 gap-3 ${currentPath === "/dashboard/sections" ? "bg-zinc-950 text-blue-500" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <Layers className="w-10" />
          <p className="text-sm max-md:hidden ">Sections</p>
        </Link>

        <Link
          to={"/dashboard/chatbot"}
          className={`flex items-center   cursor-pointer p-2 rounded-lg hover:bg-zinc-950 gap-3 ${currentPath === "/dashboard/chatbot" ? "bg-zinc-950 text-blue-500" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <Bot className="w-10" />
          <p className="text-sm max-md:hidden ">Chatbot</p>
        </Link>

        <Link
          to={"/dashboard/conversations"}
          className={`flex items-center   cursor-pointer p-2 rounded-lg hover:bg-zinc-950 gap-3 ${currentPath === "/dashboard/conversations" ? "bg-zinc-950 text-blue-500" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <MessageCircle className="w-10" />
          <p className="text-sm max-md:hidden ">Conversations</p>
        </Link>

        <Link
          to={"/dashboard/settings"}
          className={`flex items-center   cursor-pointer p-2 rounded-lg hover:bg-zinc-950 gap-3 ${currentPath === "/dashboard/settings" ? "bg-zinc-950 text-blue-500" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <Settings className="w-10" />
          <p className="text-sm max-md:hidden ">Settings</p>
        </Link>
      </div>

      <div className="mt-auto p-4 max-md:hidden flex gap-3">
        <p className="bg-zinc-900 text-zinc-600 text-lg rounded-full min-h-9 max-h-9 max-w-9 min-w-9 justify-center items-center flex">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </p>
        <div>
          <p className="text-xs lg:text-sm font-semibold">{user?.name || "User"}</p>
          <p className="text-[10px] lg:text-xs text-zinc-700 ">{user?.email || ""}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
