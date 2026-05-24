import Code_embed_box from "@/components/common/Code_embed_box";
import Chatbot_playground from "@/components/common/dashboard-page/Chatbot_playground";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Code, Edit, Info, Palette, Save, X } from "lucide-react";
import { DB_URL } from "../../../utils/variables.js";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAccessToken } from "../../../utils/functions.js";
import Loader from "@/components/common/Loader";

const Chatbot = () => {
  const [chatbot, setchatbot] = useState();
  const [primaryColor, setprimaryColor] = useState("");
  const [welcomeMessage, setwelcomeMessage] = useState("");
  const [loading, setloading] = useState(false);

  const [isEditable, setisEditable] = useState(false);
  useEffect(() => {
    const getChatbot = async () => {
      try {
        const res = await axios.get(`${DB_URL}/chatbot/get-user-chatbot`, {
          headers: { Authorization: getAccessToken() },
        });

        if (res.data?.success) {
          toast.success(res?.data?.message);

          setchatbot(res?.data?.chatbot);

          setprimaryColor(res?.data?.chatbot?.primaryColor);
          setwelcomeMessage(res?.data?.chatbot?.welcomeMessage);
        } else {
          toast.error(res.data?.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    getChatbot();
  }, []);

  const handleUpdate = async () => {
    setloading(true);
    try {
      const res = await axios.post(
        `${DB_URL}/chatbot/update`,
        {
          chatbotId: chatbot?._id,
          primaryColor,
          welcomeMessage,
        },
        { headers: { Authorization: getAccessToken() } },
      );

      if (res.data?.success) {
        toast.success(res?.data?.message);
        setchatbot(res?.data?.chatbot);
      } else {
        toast.error(res.data?.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 w-full">
        {/* header  */}
        <div className="flex justify-between items-center ">
          <div>
            <h5 className="text-xl ">Chatbot Playground</h5>
            <p className="text-sm mt-1 text-zinc-600">
              Test your assistant, customize apperance and deploy it.{" "}
            </p>
          </div>
        </div>

        <div className="flex mt-7 gap-5 ">
          <div className="w-[60%]  ">
            <Chatbot_playground welcomeMessage={welcomeMessage}  primaryColorr={primaryColor}/>
          </div>
          <div className="w-[40%] h-min ">
            <Apperance_Box
              loading={loading}
              setloading={setloading}
              handleUpdate={handleUpdate}
              primaryColor={primaryColor}
              setprimaryColor={setprimaryColor}
              chatbot={chatbot}
              welcomeMessage={welcomeMessage}
              setwelcomeMessage={setwelcomeMessage}
              setchatbot={setchatbot}
              isEditable={isEditable}
              setisEditable={setisEditable}
            />
            <EmbedCode />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;

const Apperance_Box = ({
  loading,
  setloading,
  isEditable,
  setisEditable,
  chatbot,
  setchatbot,
  primaryColor,
  setprimaryColor,
  welcomeMessage,
  setwelcomeMessage,
  handleUpdate,
}) => {
  return (
    <div className="bg-zinc-950 border-2 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Palette size={20} />{" "}
          <p className="uppercase text-zinc-300 text-sm">Apperance</p>
        </div>
        {isEditable ? (
          <Button
            onClick={() => {
              setisEditable(false);
              setprimaryColor(chatbot?.primaryColor);
              setwelcomeMessage(chatbot.primaryColor);
            }}
            className="p-2 bg-red-900 text-zinc-400 hover:text-zinc-100 cursor-pointer  rounded-lg"
          >
            {" "}
            <X size={30} />
          </Button>
        ) : (
          <Button
            onClick={() => setisEditable(true)}
            className="p-2 bg-zinc-900 text-zinc-400 hover:text-zinc-100 cursor-pointer  rounded-lg"
          >
            {" "}
            <Edit size={30} />
          </Button>
        )}
      </div>
      <div>
        <p className="text-sm text-zinc-500 mt-6 font-semibold">
          Primary Color
        </p>
        <div className="flex gap-2 items-center mt-3">
          {["#8f41bf", "#bf416b", "#45bf41", "#bf9741"].map((c) => (
            <p
              style={{ backgroundColor: c }}
              onClick={() => {
                if (isEditable) {
                  setprimaryColor(c);
                }
              }}
              className={`h-6 w-6 ${c == primaryColor && " border-4 border-zinc-300   "} rounded-full `}
            ></p>
          ))}
        </div>

        <Field>
          <FieldLabel
            className={"text-sm text-zinc-500 mt-4 font-semibold"}
            htmlFor="textarea-disabled"
          >
            Welcome Message
          </FieldLabel>
          <Textarea
            onChange={(e) => setwelcomeMessage(e.target.value)}
            value={welcomeMessage}
            id="textarea-disabled"
            placeholder="Type your welcome message."
            disabled={!isEditable}
          />
          <Button
            onClick={handleUpdate}
            disabled={!isEditable || loading}
            className={"mt-2"}
          >
            {!loading ? (
              <>
                <Save /> Save
              </>
            ) : (
              <Loader />
            )}
          </Button>
        </Field>
      </div>
    </div>
  );
};

const EmbedCode = () => {
  return (
    <div className="bg- border-2 p-4 mt-5 rounded-lg">
      <div className="flex gap-2 items-center">
        <Code size={20} />{" "}
        <p className="uppercase text-zinc-300 text-sm">Embed Code </p>
      </div>

      <div className="mt-4">
        <Code_embed_box showCopyButton={true} />
      </div>
      <div className="flex p-1 px-2 mt-3 rounded-lg border  border-yellow-600 text-xs text-yellow-600 gap-2 bg-[#ffea2d27] items-center ">
        <Info size={17} />{" "}
        <p>Paste this code before the {`<head>`} closing tag. </p>
      </div>
    </div>
  );
};
