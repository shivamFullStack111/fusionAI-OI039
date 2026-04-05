import React, { useEffect, useState } from "react";
import ResponsiveContainer from "../ResponsiveContainer";
import { Card } from "../../ui/card";
import {
  BookOpen,
  Check,
  CopyIcon,
  MessageCircleHeart,
  ShieldCheck,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "../../ui/button";
import { DB_URL } from "../../../../utils/variables.js";

import axios from "axios";
import Confirm_payment_modal from "./Confirm_payment_modal";

const Pricing = ({ showCopyButton = false }) => {
  const [allPlan, setallPlan] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const getAllPlan = async () => {
      try {
        const res = await axios.get(`${DB_URL}/plan/get-all`);

        if (res.data.success) {
          setallPlan(res.data.allPlan);
        } else {
          toast.error(res.data?.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getAllPlan();
  }, []);

  return (
    <ResponsiveContainer>
      <div id="pricing" className="py-20">
        <p className="text-4xl text-center ">
          Plans That Grow With Your Business{" "}
        </p>

        <p className="text-zinc-700 text-center mt-4 text-lg">
          Choose a plan that fits your needs. Start for free and{" "}
        </p>
        <p className="text-zinc-700 text-center  text-lg">
          upgrade anytime as your chatbot grows.{" "}
        </p>

        <div className=" flex justify-evenly pt-10 ">
          {allPlan.length > 0 &&
            allPlan?.map((p, index) => {
              return (
                <div
                  className={`bg-zinc-950  mt-10 relative flex flex-col w-70 h-100  border rounded-lg border-zinc-900 p-8`}
                >
                  {p.planType == "popular" && (
                    <div className="absolute bg-zinc-800 top-0 right-0 px-4 p-1 text-sm rounded-bl-lg rounded-tr-lg">
                      Popular{" "}
                    </div>
                  )}
                  <p className="text-sm uppercase text-zinc-400 mb-2">
                    {p?.planType}
                  </p>
                  <div>
                    <span className="text-4xl font-semibold"> ₹{p?.price}</span>{" "}
                    <span className="text-zinc-600">/m</span>
                  </div>

                  <div className="flex flex-col gap-1.5 py-6 text-sm text-zinc-500">
                    <div className="flex  gap-3 items-center">
                      <Check size={15} />
                      <p>{p?.totalMessages} Message per month</p>
                    </div>
                    <div className="flex  gap-3 items-center">
                      <Check size={15} />
                      <p>{p?.totalKnowledges} Knowledges </p>
                    </div>
                    {p.totalTeamMembers > 0 && (
                      <div className="flex  gap-3 items-center">
                        <Check size={15} />
                        <p>{p?.totalTeamMembers} Team Members </p>
                      </div>
                    )}
                    {p.conversationHistory > 0 && (
                      <div className="flex  gap-3 items-center">
                        <Check size={15} />
                        <p>Conversation history </p>
                      </div>
                    )}
                    {p.customizePromt > 0 && (
                      <div className="flex  gap-3 items-center">
                        <Check size={15} />
                        <p>Customize prompt </p>
                      </div>
                    )}
                    <div className="flex  gap-3 items-center">
                      <Check size={15} />
                      <p>Show Branding</p>
                    </div>
                  </div>

                  {/* <Button
                    variant="outline"
                    className={`w-full p-5 mt-auto  ${index % 2 != 0 ? "bg-gray-200! hover:bg-white!  !text-zinc-800" : " text-gray-300"}`}
                  ></Button> */}
                 <div className="mt-auto">
                   <Confirm_payment_modal
                   plan={p}
                    className={`w-full p-5 mt-auto  ${index % 2 != 0 ? "bg-gray-200! hover:bg-white!  !text-zinc-800" : " text-gray-300"}`}
                    title={
                      index == 0
                        ? "Start Free"
                        : index == 1
                          ? "Upgrade"
                          : index == 2 && "Upgrade"
                    }
                  />
                 </div>
                </div>
              );
            })}
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default Pricing;
