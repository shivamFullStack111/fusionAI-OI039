import React from "react";
import ResponsiveContainer from "../ResponsiveContainer";

const Footer = () => {
  return (
    <div className="bg-zinc-950 py-6">
      <ResponsiveContainer>
        <div className="flex justify-between items-center">
          <div className="flex gap-2  items-center justify-center">
            <img
              className="h-12 w-12 object-cover p-1 rounded-full border-2 border-gray-300 "
              src="https://res.cloudinary.com/dosyxpa1r/image/upload/v1779451314/logo_bbzx0w.png"
              alt=""
            />
            <p className="font-semibold">FusionAI</p>
          </div>
          <div className="flex gap-4 ">
            <p className="text-sm text-zinc-500">Privacy</p>
            <p className="text-sm text-zinc-500">Terms</p>
            <p className="text-sm text-zinc-500">Twitter</p>
          </div>

          <div className="text-sm text-zinc-500">
            © 2026 All Rights Reserved
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default Footer;
