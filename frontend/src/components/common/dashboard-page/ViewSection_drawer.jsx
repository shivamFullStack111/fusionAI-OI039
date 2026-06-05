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
  ChevronDown,
  Check,
  Eye,
  FileText,
  Folder,
  Globe,
  X,
  Edit,
} from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "../../../../utils/functions.js";
import toast from "react-hot-toast";
import Loader from "../Loader.jsx";
import { DB_URL } from "../../../../utils/variables.js";
import { Switch } from "@/components/ui/switch.jsx";
import { useSelector } from "react-redux";

function ViewSection_drawer({
  section: sn,
  viewDrawerOpen,
  setviewDrawerOpen,
  setAllSections,
  allSections,
}) {
  const [knowledgeSourceIds, setknowledgeSourceIds] = useState([]);

  const [description, setdescription] = useState("");
  const [sectionName, setsectionName] = useState("");
  const [tone, settone] = useState("");
  const [allKnowledges, setallKnowledges] = useState([]);
  const [isActive, setisActive] = useState(true);
  const [allowedTopics, setallowedTopics] = useState("");
  const [blockedTopics, setblockedTopics] = useState("");

  const [isEditable, setisEditable] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const canDeleteSection = user?.role !== "member";

  const [loading, setloading] = useState(false);
  const [ksOpen, setksOpen] = useState(false);
  const [ksSearch, setksSearch] = useState("");

  // ✅ ek hi useEffect — seedha sn se knowledgeIds set karo
  useEffect(() => {
    if (!viewDrawerOpen || !sn) return;
    const knowledgeIds = sn?.knowledgeSourceIds?.map((kn) => kn?._id) || [];
    setknowledgeSourceIds(knowledgeIds);
  }, [sn, viewDrawerOpen]);

  useEffect(() => {
    if (!viewDrawerOpen || !sn) return;
    setisActive(sn?.isActive);
    setallowedTopics(sn?.allowedTopics?.join(","));
    setblockedTopics(sn?.blockedTopics.join(","));
    setsectionName(sn?.sectionName);
    setdescription(sn?.description);
    settone(sn?.tone);
  }, [sn, viewDrawerOpen]);

  useEffect(() => {
    setksOpen(false);
  }, [viewDrawerOpen]);

  // ✅ API call sirf tab jab drawer open ho
  useEffect(() => {
    if (!viewDrawerOpen) return;
    const getAllKnowledge = async () => {
      try {
        setloading(true);
        const res = await axios.post(
          `${DB_URL}/knowledge/get-all`,
          {},
          { headers: { Authorization: getAccessToken() } },
        );
        if (res.data?.success) {
          setallKnowledges(res?.data?.knowledges);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setloading(false);
      }
    };
    getAllKnowledge();
  }, [viewDrawerOpen]);

  const handleUpdate = async () => {
    try {
      const res = await axios.post(
        `${DB_URL}/section/update`,
        {
          sectionId: sn?._id,
          sectionName,
          description,
          knowledgeSourceIds,
          isActive,
          tone,
          allowedTopics,
          blockedTopics,
        },
        {
          headers: {
            Authorization: getAccessToken(),
          },
        },
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);

        setAllSections((prev) =>
          prev.map((sec) => {
            if (sec?._id == sn?._id) {
              return {
                ...sec,
                sectionName,
                description,
                knowledgeSourceIds: allKnowledges?.filter((k) =>
                  knowledgeSourceIds.includes(k?._id),
                ),
                tone,
                isActive,
                allowedTopics:
                  allowedTopics?.length > 0
                    ? allowedTopics
                        ?.trim()
                        .split(",")
                        .filter((topic) => topic !== "")
                    : [],
                blockedTopics:
                  blockedTopics?.length > 0
                    ? blockedTopics
                        ?.trim()
                        .split(",")
                        .filter((topic) => topic !== "")
                    : [],
              };
            } else {
              return sec;
            }
          }),
        );
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Drawer
      open={viewDrawerOpen}
      onOpenChange={setviewDrawerOpen}
      direction="right"
    >
      <DrawerTrigger asChild>
        <div className="p-2 text-white hover:text-blue-600 bg-zinc-800 w-min rounded-lg cursor-pointer">
          <Eye size={20} />
        </div>
      </DrawerTrigger>
      <DrawerContent className="bg-black! min-w-110 border-gray-950">
        <DrawerHeader className={"border-b border-zinc-900"}>
          <DrawerTitle className="text-zinc-100">View Section</DrawerTitle>
          <DrawerDescription className="text-zinc-500">
            Configure how AI behave for this specific topic.
          </DrawerDescription>
        </DrawerHeader>

        {loading && <Loader />}
        {!loading && (
          <div className="no-scrollbar overflow-y-auto px-4">
            <div className="flex mt-6 justify-between items-center">
              <p className=" text-zinc-400 text-xs">BASICS</p>
              {isEditable ? (
                <Button
                  onClick={() => setisEditable(false)}
                  className="p-2 bg-red-900 text-zinc-400 hover:text-zinc-100 cursor-pointer  rounded-lg"
                >
                  {" "}
                  <X size={30} />
                </Button>
              ) : (
                <Button
                  onClick={() => setisEditable(true)}
                  className="p-2 bg-zinc-900 text-zinc-400 hover:text-zinc-100 cursor-pointer  rounded-lg"
                >
                  {" "}
                  <Edit size={30} />
                </Button>
              )}
            </div>

            <FieldGroup className={"gap-1"}>
              <Field>
                <FieldLabel
                  className="text-zinc-500 text-xs mt-5"
                  htmlFor="section-name"
                >
                  Section Name
                </FieldLabel>
                <Input
                  value={sectionName || ""}
                  onChange={(e) => setsectionName(e.target?.value)}
                  className="border-zinc-700 text-zinc-300 h-10"
                  disabled={!isEditable}
                  id="section-name"
                  placeholder="e.g. Billing Policy"
                />
              </Field>

              <Field>
                <FieldLabel
                  className="text-zinc-500 text-xs mt-5"
                  htmlFor="description"
                >
                  Description
                </FieldLabel>
                <Textarea
                  disabled={!isEditable}
                  id="description"
                  onChange={(e) => setdescription(e.target?.value)}
                  className="border-zinc-700 text-zinc-300 max-h-40 min-h-20"
                  value={description || ""}
                  placeholder="When should the AI use this?"
                />
                <FieldDescription className="text-xs">
                  Used by the routing model to decide when to activate this
                  section.
                </FieldDescription>
              </Field>

              {/* Knowledge Sources */}
              <div className="flex justify-between items-center">
                <p className="mt-6 text-zinc-400 uppercase text-xs">
                  Knowledge sources
                </p>
                <p className="mt-6 text-zinc-500 text-xs">
                  {knowledgeSourceIds.length} Attached
                </p>
              </div>

              <div className="relative">
                {isEditable && (
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
                )}

                {isEditable && ksOpen && (
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
                              className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer text-sm text-zinc-300 hover:bg-zinc-900 ${isSelected ? "bg-zinc-900" : ""}  ${k?.isActive == false && " border! border-red-400!  bg-[#ff00001c]!"} `}
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-white border-white" : "border-zinc-600"}  `}
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
                              {k?.isActive==false&&<span className="text-xs text-red-600">(Disabled)</span>}
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
                        className={`flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-xs text-zinc-300 ${k?.isActive == false && " border! border-red-400! text-red-600! bg-[#ff00001c]!"} `}
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
                          {isEditable && <X size={10} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <p
                className={`text-zinc-500  text-xs mt-5`}
                htmlFor="section-name"
              >
                Status
              </p>
              <div className="flex mt-1 items-center space-x-2">
                <Switch
                  checked={isActive}
                  disabled={!isEditable}
                  onCheckedChange={(value) => setisActive(value)}
                  className={`${isActive ? " bg-green-400! " : " bg-red-400! "}`}
                />{" "}
                <Label className={"text-zinc-500"} htmlFor="airplane-mode">
                  {" "}
                  {isActive ? "Active" : "Inactive"}
                </Label>
              </div>

              {/* Tone */}
              <p className="mt-6 text-zinc-400 uppercase text-xs">TONE</p>
              <RadioGroup
                onValueChange={(value) => {
                  if (!isEditable) return;
                  settone(value);
                }}
                value={tone}
                className="w-full mb-4 mt-4"
              >
                {[
                  {
                    value: "strict",
                    label: "Strict",
                    desc: "Only answer if fully confident. No small talk.",
                    badge: "Fact based",
                  },
                  {
                    value: "neutral",
                    label: "Neutral",
                    desc: "Professional, concise, and direct.",
                  },
                  {
                    value: "friendly",
                    label: "Friendly",
                    desc: "Warm and conversational. Good for general FAQ.",
                  },
                  {
                    value: "empathetic",
                    label: "Empathetic",
                    desc: "Support-first, apologetic, and calming.",
                  },
                ].map((t) => (
                  <div
                    key={t.value}
                    className="flex items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800 gap-2"
                  >
                    <RadioGroupItem value={t.value} id={t.value} />
                    <Label className="text-zinc-300" htmlFor={t.value}>
                      {t.label}
                      {t.badge && (
                        <span className="ml-1 bg-[#f002] py-0.5 border border-red-700 text-red-700 px-2 text-[10px] rounded-lg">
                          {t.badge}
                        </span>
                      )}
                      <p className="text-[11px] text-zinc-600">{t.desc}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FieldGroup>

            <div className="mb-6 flex items-center text-zinc-600 text-sm gap-3">
              <Field>
                <FieldLabel
                  className="text-zinc-500 text-xs mt-5"
                  htmlFor="allowed-topics"
                >
                  Allowed Topics
                </FieldLabel>
                <Input
                  value={allowedTopics}
                  onChange={(e) => setallowedTopics(e.target.value)}
                  className="border-zinc-700 text-zinc-300 h-10"
                  disabled={!isEditable}
                  id="allowed-topics"
                  placeholder="terms, billing"
                />
              </Field>
              <Field>
                <FieldLabel
                  className="text-zinc-500 text-xs mt-5"
                  htmlFor="blocked-topics"
                >
                  Blocked Topics
                </FieldLabel>
                <Input
                  onChange={(e) => setblockedTopics(e.target.value)}
                  value={blockedTopics}
                  className="border-zinc-700 text-zinc-300 h-10"
                  disabled={!isEditable}
                  id="blocked-topics"
                  placeholder="competitors, employee details"
                />
              </Field>
            </div>
          </div>
        )}

        {!isEditable && canDeleteSection && (
          <DrawerFooter className="p-4 bg-[#ff000024]">
            <div>
              <p className="text-red-600">Danger Zone</p>
              <p className="text-red-800 text-xs mt-1">
                Deleting this section will remove all associated routing rules.
              </p>

              <DeleteSectionModal
                setAllSections={setAllSections}
                allSections={allSections}
                sectionId={sn?._id}
              />
            </div>
          </DrawerFooter>
        )}

        {isEditable && (
          <DrawerFooter className="p-4  ">
            <DialogClose asChild>
              <Button
                onClick={handleUpdate}
                className="w-full mt-3 h-10"
                variant="outline"
              >
                Update Section
              </Button>
            </DialogClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default ViewSection_drawer;

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DeleteSectionModal = ({ sectionId, setAllSections, allSections }) => {
  const handleDelete = async () => {
    try {
      const res = await axios.post(
        `${DB_URL}/section/delete`,
        {
          sectionId,
        },
        { headers: { Authorization: getAccessToken() } },
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);

        const updatedSection = allSections?.filter(
          (sec) => sec?._id !== sectionId,
        );
        setAllSections(updatedSection);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="w-full mt-3 h-10" variant="destructive">
            Delete Section
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm dark">
          <DialogHeader>
            <DialogTitle className={"text-zinc-200"}>
              Delete Section
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Section.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className={"text-zinc-400"} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleDelete} type="submit">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
