import React, { useState } from "react";
import { Button } from "../../ui/button";
import ResponsiveContainer from "../ResponsiveContainer";
import { Link } from "react-router-dom";
import SignIn_SignUp from "./SignIn_SignUp";
import { useSelector } from "react-redux";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <ResponsiveContainer>
      <header className="relative flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex px-5 gap-2 items-center">
          <img
            className=" w-8 md:w-10 lg:h-12  h-8 md:h-10 lg:w-12 object-cover p-1 rounded-full border-2 border-gray-300"
            src="https://res.cloudinary.com/dosyxpa1r/image/upload/v1779451314/logo_bbzx0w.png"
            alt="FusionAI logo"
          />
          <p className="font-semibold">FusionAI</p>
        </div>

        <div className="hidden md:flex gap-8">
          <a
            href="#features"
            className="text-gray-400 text-sm hover:text-gray-200"
          >
            Features
          </a>
          <a
            href="#integration"
            className="text-gray-400 text-sm hover:text-gray-200"
          >
            Integration
          </a>
          <a
            href="#pricing"
            className="text-gray-400 text-sm hover:text-gray-200"
          >
            Pricing
          </a>
        </div>

        <div className="hidden md:flex gap-4 items-center justify-center">
          {!isAuthenticated && (
            <SignIn_SignUp
              buttonClassName="text-gray-400 text-sm hover:text-gray-200 cursor-pointer border-0"
              type="signin"
            />
          )}
          {isAuthenticated && (
            <Link to="/dashboard">
              <Button className="bg-white text-black rounded-full">
                Dashboard
              </Button>
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden mr-3 inline-flex items-center justify-center rounded-2xl h-10 w-10 border border-zinc-700 p-2 text-zinc-300"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>

        {mobileOpen && (
          <div className="absolute z-50! inset-x-4 top-full  mt-3 rounded-3xl border border-zinc-800 bg-background p-4 shadow-2xl md:hidden">
            <div className="flex flex-col gap-3">
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="text-gray-400 text-sm hover:text-gray-200"
              >
                Features
              </a>
              <a
                href="#integration"
                onClick={() => setMobileOpen(false)}
                className="text-gray-400 text-sm hover:text-gray-200"
              >
                Integration
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="text-gray-400 text-sm hover:text-gray-200"
              >
                Pricing
              </a>
              <div className="border-t border-zinc-800 pt-3">
                {!isAuthenticated && (
                  <SignIn_SignUp
                    buttonClassName="text-gray-400 text-sm hover:text-gray-200 cursor-pointer border-0"
                    type="signin"
                  />
                )}
                {isAuthenticated && (
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-white text-black rounded-full">
                      Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </ResponsiveContainer>
  );
};

export default Header;
