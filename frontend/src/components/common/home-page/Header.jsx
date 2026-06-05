import React, { useState } from "react";
import { Button } from "../../ui/button";
import ResponsiveContainer from "../ResponsiveContainer";
import { Link } from "react-router-dom";
import SignIn_SignUp from "./SignIn_SignUp";
import { useSelector } from "react-redux";

const Header = () => {
  const [loginOpen, setloginOpen] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <ResponsiveContainer>
      <header className="flex justify-between  items-center py-3">
        <div className="flex gap-2  items-center justify-center">
          <img
            className="h-12 w-12 object-cover p-1 rounded-full border-2 border-gray-300 "
            src="https://res.cloudinary.com/dosyxpa1r/image/upload/v1779451314/logo_bbzx0w.png"
            alt=""
          />
          <p className="font-semibold">FusionAI</p>
        </div>
        <div className="flex gap-8">
          <a
            href="#features"
            className="text-gray-400 text-sm text hover:text-gray-200 cursor-aointer"
          >
            Features
          </a>
          <a
            href="#integration"
            className="text-gray-400 text-sm text hover:text-gray-200 cursor-aointer"
          >
            Intergration
          </a>

          <a
            href="#pricing"
            className="text-gray-400 text-sm text hover:text-gray-200 cursor-aointer"
          >
            Pricing
          </a>
        </div>
        <div
          href="#features"
          className="flex gap-4  items-center justify-center"
        >
          {!isAuthenticated && (
            <>
              {" "}
              <SignIn_SignUp
                buttonClassName={
                  "text-gray-400 text-sm hover:text-gray-200 cursor-pointer border-0"
                }
                type="signin"
              />{" "}
              {/* <Button
                className={"bg-white text-black cursor-pointer rounded-full"}
              >
                Get Started
              </Button> */}
            </>
          )}
          {isAuthenticated && (
            <Link to={"/dashboard"}>
              {" "}
              <Button
                className={"bg-white text-black cursor-pointer rounded-full"}
              >
                Dashboard
              </Button>
            </Link>
          )}
        </div>
      </header>
    </ResponsiveContainer>
  );
};

export default Header;
