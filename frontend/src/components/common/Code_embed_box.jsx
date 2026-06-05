import axios from "axios";
import { CopyIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { DB_URL, isInProduction } from "../../../utils/variables.js";
import Loader from "./Loader.jsx";
import { getAccessToken } from "../../../utils/functions.js";

const Code_embed_box = ({ showCopyButton, width }) => {
  const [chatbot, setchatbot] = useState();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const getChatbot = async () => {
      try {
        const res = await axios.get(DB_URL + "/chatbot/get-user-chatbot", {
          headers: {
            Authorization: getAccessToken(),
          },
        });

        setchatbot(res.data?.chatbot);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setloading(false);
      }
    };

    getChatbot();
  }, []);
  return (
    <div className="bg-zinc-950 border rounded-lg border-zinc-900 p-8">
      {loading && (
        <div className="flex justify-center">
          <Loader />
        </div>
      )}

      {!loading && (
        <div className="">
          <div className="flex relative justify-between items-center">
            <div className="flex gap-2">
              <p className="h-3 w-3 rounded-full bg-red-400 border border-red-600"></p>
              <p className="h-3 w-3 rounded-full bg-yellow-400 border border-yellow-600"></p>
              <p className="h-3 w-3 rounded-full bg-green-400 border border-green-600"></p>
            </div>
            <div className="text-sm text-zinc-500">index.html</div>
            {showCopyButton && (
              <CopyIcon
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `<script \n src="${isInProduction ? "https://aai-agent-saas-bay.vercel.app/embed.js" : "http://localhost:5173/embed.js"}" \n data-external-user-id="unique-user-id" \n data-bot-id="${chatbot?._id || "your-chatbot-id"}"  >\n</script>`,
                  );
                  toast.success("Copied!");
                }}
                size={40}
                className="text-zinc-200  absolute -top-12 -right-10 rounded-lg p-3 bg-zinc-900 hover:text-blue-400 cursor-pointer text-sm"
              />
            )}
          </div>
          <SyntaxHighlighter
            language="html"
            style={{ ...oneDark }}
            customStyle={{
              background: "transparent",
              paddingLeft: 0,
              paddingRight: 0,
            }}
            codeTagProps={{
              style: { background: "transparent" },
            }}
          >
            {`<script \n src="${isInProduction ? "https://aai-agent-saas-bay.vercel.app/embed.js" : "http://localhost:5173/embed.js"}" \n data-external-user-id="unique-user-id" \n data-bot-id="${chatbot?._id || "your-chatbot-id"}"  >\n</script>`}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default Code_embed_box;
