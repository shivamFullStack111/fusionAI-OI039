import React from "react";
import ResponsiveContainer from "../ResponsiveContainer";
import { Card } from "../../ui/card";
import { BookOpen, MessageCircleHeart, ShieldCheck } from "lucide-react";

const Trust_component = () => {
  return (
    <ResponsiveContainer>
      <div className="py-20 pt-40">
        <p className="text-4xl ">Designed for trust. </p>

        <p className="text-zinc-700 mt-4 text-lg">
          Most AI support tools hallucinate. Ours is strictly grounded in{" "}
        </p>
        <p className="text-zinc-700  text-lg">
          your content, with a personality you control
        </p>

        <div className="justify-evenly flex pt-14">
          <Card className={"h-50 w-90 p-6 bg-[#08080854]"}>
            <div className="flex border p-2 bg-black rounded-xl w-min">
              <BookOpen size={30} />
            </div>
            <p className="text-lg">Knowledge Graph</p>
            <p className="text-zinc-500">
              We crawl your site and docs to build a structure understanding of
              your project. no manual training required
            </p>
          </Card>

          <Card className={"h-50 w-90 p-6 bg-[#08080854]"}>
            <div className="flex border p-2 bg-black rounded-xl w-min">
              <ShieldCheck size={30} />
            </div>
            <p className="text-lg">Strict Guardarils</p>
            <p className="text-zinc-500">
              Define exactly what the AI can and cannot say. it will politely
              decline out-of-Scop questions
            </p>
          </Card>

          <Card className={"h-50 w-90 p-6 bg-[#08080854]"}>
            <div className="flex border p-2 bg-black rounded-xl w-min">
              <MessageCircleHeart size={30} />
            </div>
            <p className="text-lg">Tone Matching</p>
            <p className="text-zinc-500">
              Weather you are professional, quirky or concise the AI mimics your
              brand voice perfectly
            </p>
          </Card>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default Trust_component;
