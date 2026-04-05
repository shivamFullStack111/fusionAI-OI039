import { Button } from "@/components/ui/button";

import { Edit, Eye, Folder, X } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "./textarea";
import { Label } from "@/components/ui/label.jsx";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import axios from "axios";
import { DB_URL } from "../../../utils/variables.js";

import { getAccessToken } from "../../../utils/functions.js";

function ViewKnowledge_drawer({ knowledge, allKnowledges, setallKnowledges }) {
  const [loading, setloading] = useState(false);
  const [isEditable, setisEditable] = useState(false);
  const [isActive, setisActive] = useState(false);

  useEffect(() => {
    setisActive(knowledge?.isActive == true ? true : false);
  }, [knowledge]);

  const handleUpdate = async () => {
    try {
      const res = await axios.post(
       `${DB_URL}/knowledge/update`,
        { isActive, knowledgeId: knowledge?._id },
        { headers: { Authorization: getAccessToken() } },
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        const updatedKnowledges = allKnowledges.map((k) => {
          if (k?._id == knowledge?._id) {
            return {
              ...k,
              isActive: isActive,
            };
          }
          return k;
        });

        setallKnowledges(updatedKnowledges);
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
        <div className="p-2 text-whit hover:text-blue-600 bg-zinc-800  w-min rounded-lg cursor-pointer ">
          <Eye size={20} />
        </div>
      </DrawerTrigger>
      <DrawerContent className="bg-black! min-w-110 border-gray-950">
        <DrawerHeader className={"border-b border-zinc-900"}>
          <DrawerTitle className={`text-zinc-100`}>View Knowledge</DrawerTitle>
          <DrawerDescription className={`text-zinc-500`}>
            You can view and update knowledge.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex p-5 pb-0 mt-6 justify-between items-center">
          <div className="  flex gap-2 items-center">
            <p className=" text-zinc-400 capitalize ">knowledge type: </p>
            <p className=" text-zinc- uppercase text-blue-500 ">
              {knowledge?.knowledgeType}
            </p>
          </div>{" "}
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
        {knowledge?.knowledgeType == "website" && (
          <TypeWebsiteContent
            isActive={isActive}
            setisActive={setisActive}
            isEditable={isEditable}
            knowledge={knowledge}
          />
        )}
        {knowledge?.knowledgeType == "text" && (
          <TypeTextContent
            isActive={isActive}
            setisActive={setisActive}
            isEditable={isEditable}
            knowledge={knowledge}
          />
        )}
        {knowledge?.knowledgeType == "file" && (
          <TypeFileContent
            isActive={isActive}
            setisActive={setisActive}
            isEditable={isEditable}
            knowledge={knowledge}
          />
        )}
        <DrawerFooter>
          {!isEditable && (
            <div className="p-4 bg-[#ff000024] rounded-lg">
              <p className="text-red-600">Danger Zone</p>
              <p className="text-red-800 text-xs mt-1">
                Deleting this knowledge will remove unlink from section which
                uses this knowledge.
              </p>

              <DeleteKnowledgeModal
                setallKnowledges={setallKnowledges}
                knowledgeId={knowledge?._id}
                allKnowledges={allKnowledges}
              />
            </div>
          )}
          {isEditable && (
            <DrawerClose asChild>
              <Button onClick={handleUpdate} variant="outline">
                Update
              </Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ViewKnowledge_drawer;

const TypeWebsiteContent = ({
  knowledge,
  isEditable,
  isActive,
  setisActive,
}) => {
  

  return (
    <div className="no-scrollbar overflow-y-auto px-4">
      <FieldGroup className={"gap-1"}>
        <Field>
          <FieldLabel
            className={`text-zinc-500 text-xs mt-5`}
            htmlFor="section-name"
          >
            Website URL
          </FieldLabel>
          <Input
            disabled
            value={knowledge?.webite?.url}
            className={"border-zinc-700 bg-zinc-800! text-zinc-300 h-10"}
            id="section-name"
            placeholder="e.g. Billing Policy"
          />
        </Field>
        <Field>
          <FieldLabel
            className={`text-zinc-500 text-xs mt-5`}
            htmlFor="section-name"
          >
            Content
          </FieldLabel>
          <Textarea
            disabled
            className={
              "border-zinc-700  scrollbar-slim bg-zinc-800! text-zinc-300 max-h-50"
            }
            id="section-name"
            value={knowledge?.webite?.content}
            placeholder="e.g. Billing Policy"
          />
        </Field>

        <p className={`text-zinc-500  text-xs mt-5`} htmlFor="section-name">
          Status
        </p>
        <div className="flex mt-1 items-center space-x-2">
          <Switch
            checked={isActive}
            onCheckedChange={(value) => {
              if (!isEditable) return;
              setisActive(value);
            }}
            className={`${isActive ? " bg-green-400! " : " bg-red-400! "}`}
          />{" "}
          <Label className={"text-zinc-500"} htmlFor="airplane-mode">
            {" "}
            {isActive ? "Active" : "Inactive"}
          </Label>
        </div>
      </FieldGroup>
    </div>
  );
};

const TypeTextContent = ({ knowledge, isEditable, isActive, setisActive }) => {
  return (
    <div className="no-scrollbar overflow-y-auto px-4">
      <FieldGroup className={"gap-1"}>
        <Field>
          <FieldLabel
            className={`text-zinc-500 text-xs mt-5`}
            htmlFor="section-name"
          >
            Title
          </FieldLabel>
          <Input
            disabled
            value={knowledge?.text?.title}
            className={"border-zinc-700 bg-zinc-800! text-zinc-300 h-10"}
            id="section-name"
            placeholder="e.g. Billing Policy"
          />
        </Field>
        <Field>
          <FieldLabel
            className={`text-zinc-500 text-xs mt-5`}
            htmlFor="section-name"
          >
            Content
          </FieldLabel>
          <Textarea
            disabled
            className={
              "border-zinc-700  scrollbar-slim bg-zinc-800! text-zinc-300 max-h-50"
            }
            id="section-name"
            value={knowledge?.text?.content}
            placeholder="e.g. Billing Policy"
          />
        </Field>

        <p className={`text-zinc-500  text-xs mt-5`} htmlFor="section-name">
          Status
        </p>
        <div className="flex mt-1 items-center space-x-2">
          <Switch
            checked={isActive}
            onCheckedChange={(value) => {
              if (!isEditable) return;
              setisActive(value);
            }}
            className={`${isActive ? " bg-green-400! " : " bg-red-400! "}`}
          />{" "}
          <Label className={"text-zinc-500"} htmlFor="airplane-mode">
            {" "}
            {isActive ? "Active" : "Inactive"}
          </Label>
        </div>
      </FieldGroup>
    </div>
  );
};

const TypeFileContent = ({ knowledge, isEditable, isActive, setisActive }) => {
  return (
    <div className="no-scrollbar overflow-y-auto px-4">
      <div className="mt-6">
        <p className="text-[12px] text-zinc-500">File</p>
        <div className="bg-zinc-900 mt-2 p-5 rounded-lg flex flex-col items-center">
          <Folder className="text-zinc-500" />
          <p className="text-[11px] mt-2 text-zinc-400 ">
            {knowledge?.file?.fileName}
          </p>
        </div>
      </div>

      <FieldGroup className={"gap-1"}>
        <Field>
          <FieldLabel
            className={`text-zinc-500 text-xs mt-5`}
            htmlFor="section-name"
          >
            Content
          </FieldLabel>
          <Textarea
            disabled
            className={
              "border-zinc-700  scrollbar-slim bg-zinc-800! text-zinc-300 max-h-50"
            }
            id="section-name"
            value={knowledge?.file?.content}
            placeholder="e.g. Billing Policy"
          />
        </Field>

        <p className={`text-zinc-500  text-xs mt-5`} htmlFor="section-name">
          Status
        </p>
        <div className="flex mt-1 items-center space-x-2">
          <Switch
            checked={isActive}
            onCheckedChange={(value) => {
              if (!isEditable) return;
              setisActive(value);
            }}
            className={`${isActive ? " bg-green-400! " : " bg-red-400! "}`}
          />{" "}
          <Label className={"text-zinc-500"} htmlFor="airplane-mode">
            {" "}
            {isActive ? "Active" : "Inactive"}
          </Label>
        </div>
      </FieldGroup>
    </div>
  );
};

const DeleteKnowledgeModal = ({
  knowledgeId,
  setallKnowledges,
  allKnowledges,
}) => {
  const handleDelete = async () => {
    try {
      const res = await axios.post(
       `${DB_URL}/knowledge/delete`,
        {
          knowledgeId,
        },
        { headers: { Authorization: getAccessToken() } },
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);

        const updatedKnowledges = allKnowledges?.filter(
          (know) => know?._id !== knowledgeId,
        );
        setallKnowledges(updatedKnowledges);
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
          <Button className={"w-full mt-3 h-10"} variant="destructive">
            Delete Knowledge
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm dark">
          <DialogHeader>
            <DialogTitle className={"text-zinc-200"}>
              Delete Knowledge
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this knowledge. deleting this
              section also remove all
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className={"text-zinc-400"} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DrawerClose asChild>
              <Button onClick={handleDelete} type="submit">
                Confirm
              </Button>
            </DrawerClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
