import React from "react";
import ResponsiveContainer from "../ResponsiveContainer";

import Code_embed_box from "../Code_embed_box";

const EmbededSteps = () => {
  return (
    <ResponsiveContainer>
      <div id="integration" className="py-20">
        <p className="text-4xl ">Drop-in simplicity. </p>

        <p className="text-zinc-700 mt-4 text-lg">
          No complex SDKs or user syncing. just add our script tag and
        </p>
        <p className="text-zinc-700  text-lg">
          you're live. We inherit your CSS variables automatically
        </p>

        <div className=" flex justify-between pt-10">
          <div className="flex justify-between ">
            <div>
              <div className="flex items-center  gap-3 ">
                <p className=" rounded-full text-sm  bg-zinc-900 flex justify-center items-center h-6 w-6">
                  1
                </p>
                <p className="text-sm text-zinc-400">Scan your document url</p>
              </div>

              <div className="h-10 w-1 ml-2.5 bg-zinc-900"></div>

              <div className="flex items-center  gap-3 ">
                <p className=" rounded-full text-sm  bg-zinc-900 flex justify-center items-center h-6 w-6">
                  2
                </p>
                <p className="text-sm text-zinc-400">Copy the embed code</p>
              </div>
              <div className="h-10 w-1 ml-2.5 bg-zinc-900"></div>

              <div className="flex items-center  gap-3 ">
                <p className=" rounded-full text-sm  bg-zinc-900 flex justify-center items-center h-6 w-6">
                  3
                </p>
                <p className="text-sm text-zinc-400">
                  Implement on your application
                </p>
              </div>
            </div>
          </div>
       <Code_embed_box showCopyButton={false}/>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default EmbededSteps;
