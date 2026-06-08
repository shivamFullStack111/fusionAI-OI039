import React from "react";
import Squares from "./Squares";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Particle_screen = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div className="relative">
      <div className="w-full  flex bg-transparent absolute  text-white z-50 mt-28 items-center flex-col ">
        <Card
          className={
            "flex mb-8 gap-3 items-center justify-center flex-row p-2 px-3 "
          }
        >
          <p className="bg-green-500 h-2 w-2 rounded-full"></p>
          <p className="text-xs text-white/60 ">Version 1.0.0 available now</p>
        </Card>
        <h1 className="text-6xl">Human-friendly support,</h1>
        <h3 className="text-5xl mt-4 text-zinc-500">Powered by AI</h3>
        <p className="mt-6 text-lg text-white/60">
          Instantly resolve customer with an assistant that reads your
        </p>
        <p className=" text-lg text-white/60">
          docs and speaks with empathy. No robotic replies, just answers.
        </p>

        <div className="flex mt-8 justify-center items-center gap-6 ">
          {isAuthenticated && (
            <Button
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/dashboard");
                }
              }}
              className={"py-5 rounded-full px-5 cursor-pointer"}
            >
              Dashboard <ArrowRight />{" "}
            </Button>
          )}

          {!isAuthenticated && (
            <a
              href="#pricing"
              className={
                "px-3 text-black font-semibold gap-4 py-2 rounded-full bg-white flex justify-center items-center px-5 cursor-pointer"
              }
            >
              Start for free <ArrowRight />{" "}
            </a>
          )}
          <a
            href="#integration"
            className={
              "px-3 text-white font-semibold gap-4 py-2 rounded-full  border border-zinc-900 flex justify-center items-center px-5 cursor-pointer"
            }
          >
            Integration Steps
            <ArrowRight />{" "}
          </a>
        </div>
      </div>
      <Squares
        speed={0.26}
        squareSize={40}
        direction="diagonal" // up, down, left, right, diagonal
        borderColor="#3b3b3b"
        hoverFillColor="#222"
        // borderColor="#2e2d2e"
        hoverColor="#222222"
        size={28}
      />
    </div>
  );
};

export default Particle_screen;
