import { Progress } from "@/components/ui/progress";
import { ArrowRight, Building2, Globe, Link2 } from "lucide-react";
import React, { useState } from "react";
import ResponsiveContainer from "../ResponsiveContainer";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "What is the name of your bussiness?",
    description: "This will be the identity of your Organization.",
    icons: Building2,
    placeholder: "e.g. ABC Corp",
  },
  {
    title: "What is your website URL?",
    description: "We will scrape your data from here to train your agent",
    icons: Globe,
    placeholder: "https://your-domain.com",
  },
  {
    title: "Any other links to add?",
    description:
      "Add external links like Notion pages or help docs to improve knowledge.",
    icons: Link2,
    placeholder: "https://your-domain.com",
  },
];

const CompleteProfile = ({ setisProfileCompleted }) => {
  const [step, setstep] = useState(1);

  const currentStep = steps[step - 1];
  const Icon = currentStep.icons;

  return (
    <div className="w-full flex flex-col h-screen">
      <Progress
        value={(step / steps.length) * 100}
        strowColor={"bg-blue-800"}
      />

      <div className="flex w-full justify-end">
        <div className="bg-zinc-950 rounded-full px-4 py-2 text-sm text-zinc-600 capitalize m-6">
          Setup your account
        </div>
      </div>

      <ResponsiveContainer className="flex-1">
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-120 mb-30 flex-col">
            <span className="bg-[#4f75fd1f] border py-1 px-2 rounded-lg text-xs text-blue-800">
              STEP {step} OF {steps.length}
            </span>

            <p className="py-3 mt-4 text-3xl">{currentStep.title}</p>
            <p className="text-zinc-500">{currentStep.description}</p>

            <div className="mt-8 relative w-full">
              <input
                type="text"
                className="outline-none p-1 pb-2 focus:border-blue-800 border-b-2 w-full"
                placeholder={currentStep.placeholder}
              />

              <div className="absolute right-0 top-2">
                <Icon className="text-zinc-500" />
              </div>
            </div>

            <div className="mt-10 flex">
              <p className="text-xs justify-between items-center flex w-full text-zinc-600">
                Press enter to {step === steps.length ? "submit" : "continue"}
              </p>

              <Button
                onClick={() => {
                  if (step === steps.length) {
                    setisProfileCompleted(true);
                    return;
                  }
                  setstep((p) => p + 1);
                }}
                variant="outline"
                className="rounded-full hover:bg-white! px-4 py-4 hover:text-zinc-700 text-zinc-500 cursor-pointer"
              >
                {step === steps.length ? "Submit" : "Continue"} <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default CompleteProfile;
