import React from "react";
import ResponsiveContainer from "../ResponsiveContainer";

const TrustedCompany = () => {
  return (
    <div id="features" className="px-5 mt-10 md:mt-25 lg:mt-40 bg-[#08080854]">
      <ResponsiveContainer>
        <div className="flex items-center flex-col ">
          <p className="capitalize text-sm text-[#6d6c6c]">
            trusted by modern products
          </p>

          <div className="flex overflow-x-auto no-scrollbar overflow-y-hidden max-w-[100vw] w-full px-5 items-center mt-4 justify-center gap-5 md:gap-8 lg:gap-14">
            <div className="text-sm  md:text-2xl lg:text-3xl text-[#999999] font-semibold font-sans italic">
              SPHERE
            </div>
            <div className="text-sm  md:text-2xl lg:text-3xl text-[#999999] font-semibold font-serif italic">
              NEXUS
            </div>
            <div className="text-sm  md:text-2xl lg:text-3xl text-[#999999]  font-semibold font-mono">
              LORA
            </div>
            <div className="text-sm  md:text-2xl lg:text-3xl text-[#999999] font-semibold underline font-mono">
              VANTAGE.
            </div>
            <div className="text-sm  md:text-2xl lg:text-3xl text-[#999999] max-md:hidden font-normal  font-mono">
              HORIZONE
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default TrustedCompany;
