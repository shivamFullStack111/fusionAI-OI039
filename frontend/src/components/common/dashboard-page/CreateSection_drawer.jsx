import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Check,
  ChevronDown,
  Cross,
  File,
  FileText,
  Folder,
  Globe,
  Plus,
  X,
} from "lucide-react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axios, { all } from "axios";
import { getAccessToken } from "../../../../utils/functions.js";
import { useEffect, useState } from "react";
import React from "react";
import Loader from "../Loader.jsx";
import toast from "react-hot-toast";
import { DB_URL } from "../../../../utils/variables.js";


function CreateSection_drawer({ allSection, setallSections }) {
  const anchor = useComboboxAnchor();

  const [allKnowledges, setallKnowledges] = useState([]);
  const [sectionName, setsectionName] = useState("");
  const [description, setdescription] = useState("");
  const [knowledgeSourceIds, setknowledgeSourceIds] = useState([]);
  const [tone, settone] = useState("strict");
  const [allowedTopics, setallowedTopics] = useState([]);
  const [blockedTopics, setblockedTopics] = useState([]);

  const [loading, setloading] = useState(false);
  const [ksOpen, setksOpen] = useState(false);
  const [ksSearch, setksSearch] = useState("");

  useEffect(() => {
    const getAllKnowledge = async () => {
      const res = await axios.post(
       `${DB_URL}/knowledge/get-all`,
        {
          isActive: true,
        },
        {
          headers: {
            Authorization: getAccessToken(),
          },
        },
      );

      if (res.data?.success) {
        setallKnowledges(res?.data?.knowledges);
      }
    };

    getAllKnowledge();
  }, []);

  const handleSubmit = async () => {
    try {
      setloading(true);

      if (!sectionName) {
        throw new Error("Section Name is required");
      }
      if (knowledgeSourceIds == 0) {
        throw new Error(
          "Minimum 1 knowledge source is required if not have then add knowledge first",
        );
      }
      if (!tone) {
        throw new Error("Tone is required");
      }

      const res = await axios.post(
        `${DB_URL}/section/create`,
        {
          sectionName,
          description,
          knowledgeSourceIds,
          tone,
          allowedTopics: allowedTopics || "",
          blockedTopics: blockedTopics || "",
        },
        {
          headers: {
            Authorization: getAccessToken(),
          },
        },
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setallSections((prev) => [res?.data?.section, ...prev]);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button className={"cursor-pointer"}>
          <Plus />
          Create Section
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-black! min-w-110 border-gray-950">
        <DrawerHeader className={"border-b border-zinc-900"}>
          <DrawerTitle className={`text-zinc-100`}>Create Section</DrawerTitle>
          <DrawerDescription className={`text-zinc-500`}>
            Configure how AI behave for this specific topic.
          </DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
          <p className="mt-6 text-zinc-400 text-xs">BASICS</p>

          <FieldGroup className={"gap-1"}>
            <Field>
              <FieldLabel
                className={`text-zinc-500 text-xs mt-5`}
                htmlFor="section-name"
              >
                Section Name
              </FieldLabel>
              <Input
                value={sectionName}
                onChange={(e) => {
                  setsectionName(e.target.value);
                }}
                className={"border-zinc-700 h-10 text-zinc-400"}
                id="section-name"
                placeholder="e.g. Billing Policy"
              />
            </Field>
            <Field>
              <FieldLabel
                className={`text-zinc-500 text-xs mt-5`}
                htmlFor="description"
              >
                Description
              </FieldLabel>
              <Input
                value={description}
                onChange={(e) => {
                  setdescription(e.target.value);
                }}
                id="description"
                className={"border-zinc-700 h-10 text-zinc-400"}
                type="email"
                placeholder="When should the AI use this?"
              />
              <FieldDescription className={"text-xs"}>
                Used by the routing model to decide when to activate this
                section.
              </FieldDescription>
            </Field>

            {/* Knowledge Sources */}
            <div className="mt-6">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <p className="text-zinc-400 uppercase text-xs">
                  Knowledge sources
                </p>
                <p className="text-zinc-500 text-xs">
                  {knowledgeSourceIds.length} Attached
                </p>
              </div>

              <div className="relative">
                {/* Trigger */}
                <div
                  onClick={() => setksOpen((p) => !p)}
                  className="flex items-center justify-between w-full px-3 h-10 border border-zinc-700 rounded-lg cursor-pointer text-zinc-500 text-sm hover:border-zinc-600"
                >
                  <span>Select knowledge sources</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${ksOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {/* close dropdown  */}
                {ksOpen && (
                  <div
                    onClick={() => setksOpen(false)}
                    className="absolute z-50 bg-zinc-900 -left-2 cursor-pointer top-6 rounded-full p-1  "
                  >
                    <X size={20} className="text-white " />
                  </div>
                )}

                {/* Dropdown */}
                {ksOpen && (
                  <div className="absolute z-40 mt-1 w-full border border-zinc-700 rounded-lg bg-zinc-950 overflow-hidden">
                    <div className="p-2 border-b border-zinc-800">
                      <input
                        autoFocus
                        value={ksSearch}
                        onChange={(e) => setksSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-300 placeholder-zinc-600 outline-none"
                      />
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                      {allKnowledges
                        .filter((k) => {
                          const label =
                            k.knowledgeType === "file"
                              ? k?.file?.fileName
                              : k.knowledgeType === "website"
                                ? k?.webite?.url
                                : k?.text?.title;
                          return label
                            ?.toLowerCase()
                            .includes(ksSearch.toLowerCase());
                        })
                        .map((k) => {
                          const label =
                            k.knowledgeType === "file"
                              ? k?.file?.fileName
                              : k.knowledgeType === "website"
                                ? k?.webite?.url
                                : k?.text?.title;
                          const isSelected = knowledgeSourceIds.includes(k._id);
                          return (
                            <div
                              key={k._id}
                              onClick={() =>
                                setknowledgeSourceIds((prev) =>
                                  isSelected
                                    ? prev.filter((v) => v !== k._id)
                                    : [...prev, k._id],
                                )
                              }
                              className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer text-sm text-zinc-300 hover:bg-zinc-900 ${isSelected ? "bg-zinc-900" : ""}`}
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-white border-white" : "border-zinc-600"}`}
                              >
                                {isSelected && (
                                  <Check
                                    size={10}
                                    strokeWidth={3}
                                    color="black"
                                  />
                                )}
                              </div>
                              {k.knowledgeType === "file" && (
                                <Folder size={13} className="text-zinc-500" />
                              )}
                              {k.knowledgeType === "website" && (
                                <Globe size={13} className="text-zinc-500" />
                              )}
                              {k.knowledgeType === "text" && (
                                <FileText size={13} className="text-zinc-500" />
                              )}
                              <span className="flex-1 truncate">{label}</span>
                              <span className="text-xs text-zinc-600">
                                {k.knowledgeType}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              {/* Chips */}
              {knowledgeSourceIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {knowledgeSourceIds.map((id) => {
                    const k = allKnowledges.find((i) => i._id === id);
                    if (!k) return null;
                    const label =
                      k.knowledgeType === "file"
                        ? k?.file?.fileName
                        : k.knowledgeType === "website"
                          ? k?.webite?.url
                          : k?.text?.title;
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-xs text-zinc-300"
                      >
                        {k.knowledgeType === "file" && (
                          <Folder size={11} className="text-zinc-500" />
                        )}
                        {k.knowledgeType === "website" && (
                          <Globe size={11} className="text-zinc-500" />
                        )}
                        {k.knowledgeType === "text" && (
                          <FileText size={11} className="text-zinc-500" />
                        )}
                        <span className="max-w-32 truncate">{label}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setknowledgeSourceIds((prev) =>
                              prev.filter((v) => v !== id),
                            )
                          }
                          className="text-zinc-600 hover:text-zinc-300 cursor-pointer bg-transparent border-none p-0"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* tone  */}
            <p className="mt-6 text-zinc-400 uppercase text-xs ">TONE</p>

            <RadioGroup
              onValueChange={(value) => settone(value)}
              value={tone}
              defaultValue="strict"
              className="w-full mb-4 mt-4"
            >
              <div className="flex flex-col w-full  gap-2">
                <div className="flex items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800 gap-2">
                  <RadioGroupItem value="strict" id="r1" />
                  <Label className={"text-zinc-300"} htmlFor="r1">
                    Strict{" "}
                    <div className="bg-[#f002] py-0.5 border border-red-700 text-red-700 px-2 text-[10px] rounded-lg ">
                      Fact based
                    </div>{" "}
                    <p className="text-[11px] text-zinc-600">
                      Only answer if fully confident. No small talk.{" "}
                    </p>
                  </Label>
                </div>
              </div>

              <div className="flex flex-col w-full  gap-2">
                <div className="flex items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800 gap-2">
                  <RadioGroupItem value="neutral" id="r2" />
                  <Label className={"text-zinc-300"} htmlFor="r2">
                    Neutral{" "}
                    <p className="text-[11px] text-zinc-600">
                      Porfessional, concise, and direct.
                    </p>
                  </Label>
                </div>
              </div>

              <div className="flex flex-col w-full  gap-2">
                <div className="flex items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800 gap-2">
                  <RadioGroupItem value="friendly" id="r2" />
                  <Label className={"text-zinc-300"} htmlFor="r3">
                    Friendly{" "}
                    <p className="text-[11px] text-zinc-600">
                      Warm and conversational. Good for general FAQ.
                    </p>
                  </Label>
                </div>
              </div>

              <div className="flex flex-col w-full  gap-2">
                <div className="flex items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800 gap-2">
                  <RadioGroupItem value="empahetic" id="r2" />
                  <Label className={"text-zinc-300"} htmlFor="r4">
                    Empahetic{" "}
                    <p className="text-[11px] text-zinc-600">
                      Support-first, apologetic, and calming.
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </FieldGroup>
          <div className="mb-6 flex items-center text-zinc-600 text-sm gap-3">
            <Field>
              <FieldLabel
                className={`text-zinc-500 text-xs mt-5`}
                htmlFor="allowed-topics"
              >
                Allowed Topics
              </FieldLabel>
              <Input
                value={allowedTopics}
                onChange={(e) => {
                  setallowedTopics(e.target.value);
                }}
                className={"border-zinc-700 h-10 text-zinc-400"}
                id="allowed-topics"
                placeholder="terms, billing"
              />
            </Field>{" "}
            <Field>
              <FieldLabel
                className={`text-zinc-500 text-xs mt-5`}
                htmlFor="blocked-topics"
              >
                Blocked Topics
              </FieldLabel>
              <Input
                value={blockedTopics}
                onChange={(e) => {
                  setblockedTopics(e.target.value);
                }}
                className={"border-zinc-700 h-10 text-zinc-400"}
                id="blocked-topics"
                placeholder="competitors, employee details"
              />
            </Field>
          </div>
        </div>

        <DrawerFooter onClick={handleSubmit}>
          <Button disable={loading} className={"h-10"} variant="outline">
            {loading && <Loader />}
            {!loading && "Create Section"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default CreateSection_drawer;
