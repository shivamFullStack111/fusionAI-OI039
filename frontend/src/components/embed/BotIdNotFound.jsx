import { FlaskRound, TriangleAlert } from "lucide-react";
import React from "react";

const BotIdNotFound = () => {
  return (
    <div className="h-[41.5px] w-[217px] p-2 flex justify-center items-center   ">
      <div className="flex items-center gap-2 justify-center w-full p-1 rounded-full border-2 border-red-600 bg-[#ff000020] ">
      <TriangleAlert size={20}  className="text-red-700"/>
        <p className="text-red-700 text-xs  font-semibold">Chatbot Id Not Found</p>
      </div>
    </div>
  );
};

export default BotIdNotFound;
