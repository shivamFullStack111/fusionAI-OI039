import React from "react";
import ResponsiveContainer from "../ResponsiveContainer";

import Code_embed_box from "../Code_embed_box";

const EmbededSteps = () => {
  return (
    <ResponsiveContainer>
      <div id="integration" className="px-5 mt-10 md:mt-25 lg:mt-40">
        <p className="text-lg md:text-2xl  max-md:text-centerlg:text-4xl ">Drop-in simplicity. </p>

        <p className="text-zinc-700 mt-4 text-lg">
          No complex SDKs or user syncing. just add our script tag and
        </p>
        <p className="text-zinc-700  text-lg">
          you're live. We inherit your CSS variables automatically
        </p>

        <div className="flex flex-col justify-between gap-10 pt-10 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-8 max-w-xl">
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
          <div className="w-full lg:w-1/2">
            <Code_embed_box showCopyButton={false} />
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default EmbededSteps;
