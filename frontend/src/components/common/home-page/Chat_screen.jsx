import React from "react";
import ChatBox from "./ChatBox";
import { Card } from "../../ui/card";

const Chat_screen = () => {
  return (
    <div className=" pt-12  max-md:px-5 rounded-t-[30px] md:rounded-t-[60px] lg:rounded-t-[100px] bg-black -translate-y-10 border-t  flex justify-center items-center">
      <ChatBox></ChatBox>
    </div>
  );
};

export default Chat_screen;
