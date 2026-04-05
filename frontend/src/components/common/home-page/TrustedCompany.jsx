import React from "react";
import ResponsiveContainer from "../ResponsiveContainer";

const TrustedCompany = () => {
  return (
    <div id="features" className="py-8 mt-16 bg-[#08080854]">
      <ResponsiveContainer>
        <div className="flex items-center flex-col ">
          <p className="capitalize text-sm text-[#6d6c6c]">
            trusted by modern products
          </p>

          <div className="flex items-center mt-4 justify-center gap-14">
            <div className="text-3xl text-[#999999] font-semibold font-sans italic">
              SPHERE
            </div>
            <div className="text-3xl text-[#999999] font-semibold font-serif italic">
              NEXUS
            </div>
            <div className="text-3xl text-[#999999] font-semibold font-mono">
              LORA
            </div>
            <div className="text-3xl text-[#999999] font-semibold underline font-mono">
              VANTAGE.
            </div>
            <div className="text-3xl text-[#999999] font-normal  font-mono">
              HORIZONE
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default TrustedCompany;
