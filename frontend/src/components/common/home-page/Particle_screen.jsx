import React from "react";
import Squares from "./Squares";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { ArrowRight } from "lucide-react";

const Particle_screen = () => {
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
          <Button className={"py-5 rounded-full px-5 cursor-pointer"}>
            Start for free <ArrowRight />{" "}
          </Button>
          <Button variant="outline" className={"py-5 dark bg-black/40!  rounded-full px-5 cursor-pointer"}>
            View Demo  {" "}
          </Button>
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
