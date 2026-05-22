import Code_embed_box from "@/components/common/Code_embed_box";
import Chatbot_playground from "@/components/common/dashboard-page/Chatbot_playground";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Code, Info, Palette, Plus, Save } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";

import React, { useState } from "react";
import { DB_URL } from "../../../utils/variables.js";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <div className="p-8 w-full">
        {/* header  */}
        <div className="flex justify-between items-center ">
          <div>
            <h5 className="text-xl ">Settings</h5>
            <p className="text-sm mt-1 text-zinc-600">
              Manage workspace preferences, security and billing{" "}
            </p>
          </div>
        </div>

        <div className="mt-7 flex justify-center ">
          <div className="w-full max-w-200 ">
            <WorkspaceSettings />
            <TeamMembers />
            <DangerZone />
            <LogOut navigate={navigate} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

const WorkspaceSettings = () => {
  return (
    <div className="rounded-lg  bg-zinc-950 p-4 ">
      <div>
        <p className="text-zinc-300">Workspace Settings</p>
        <p className="text-sm text-zinc-600">
          General settings for your organzation, (Read only)
        </p>

        <div className="mt-6 grid gap-4 grid-cols-2">
          <div>
            <FieldLabel className={"text-zinc-400"} htmlFor="workspace-name">
              Workspace Name
            </FieldLabel>
            <Input
              className={"mt-2 h-10"}
              id="workspace-name"
              type="text"
              placeholder="Your workspace name"
            />
          </div>
          <div>
            <FieldLabel className={"text-zinc-400"} htmlFor="primary-website">
              Primary Website
            </FieldLabel>
            <Input
              className={"mt-2 h-10"}
              id="primary-website"
              type="text"
              placeholder="Your primary website"
            />
          </div>
          <div>
            <FieldLabel className={"text-zinc-400"} htmlFor="language">
              Default Language
            </FieldLabel>
            <Input
              className={"mt-2 h-10"}
              id="language"
              type="text"
              placeholder="Your primary language"
            />
          </div>
          <div>
            <FieldLabel className={"text-zinc-400"} htmlFor="timezone">
              Timezone
            </FieldLabel>
            <Input
              className={"mt-2 h-10"}
              id="timezone"
              type="text"
              placeholder="your timezone"
              defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamMembers = () => {
  return (
    <div className="rounded-lg  mt-5 bg-zinc-950 p-4 ">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-zinc-300">Team Members</p>
          <p className="text-sm text-zinc-600">
            General settings for your organzation, (Read only)
          </p>
        </div>

        <AddUserDialog />
      </div>
      <p className="text-center mt-10 mb-6 text-zinc-600 text-sm">
        No team members yet.
      </p>
    </div>
  );
};

const DangerZone = () => {
  return (
    <div className="p-4 bg-[#ff000024] rounded-lg mt-5">
      <p className="text-red-600">Danger Zone</p>
      <p className="text-red-800 text-xs mt-1">
        Deleting this section will remove all associated routing rules.{" "}
      </p>
      <Button className={"w-full mt-3 h-10"} variant="destructive">
        Delete Section
      </Button>
    </div>
  );
};

const LogOut = ({ navigate }) => {
  const handleLogOut = async () => {
    try {
      const res = await axios.get(DB_URL + "/user/logout",{
        withCredentials:true
      });

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        Cookies.remove("accessToken");
        
        navigate("/");
      window.location.reload()
        
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      return toast.error(error?.message);
    }
  };
  return (
    <>
      <div className="flex" onClick={handleLogOut}>
        <Button
          className={
            "w-full ml-auto bg-zinc-900 text-zinc-400 cursor-pointer mt-5 w-30 h-10"
          }
        >
          Log Out
        </Button>
      </div>
    </>
  );
};

const AddUserDialog = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className={""}>
            <Plus />
            Add Member
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm dark">
          <DialogHeader>
            <DialogTitle className={"text-zinc-300"}>Add Member</DialogTitle>
            <DialogDescription>
              Add to your organization. they will be added immediately
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label className={"text-zinc-400"} htmlFor="name-1">
                Name
              </Label>
              <Input
                placeholder={"John joe"}
                className={"h-10 placeholder:text-zinc-600"}
                id="name-1"
                name="name"
              />
            </Field>
            <Field>
              <Label className={"text-zinc-400"} htmlFor="email">
                Email
              </Label>
              <Input
                placeholder={"john@gmail.com"}
                className={"h-10 placeholder:text-zinc-600"}
                id="email"
                name="email"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
