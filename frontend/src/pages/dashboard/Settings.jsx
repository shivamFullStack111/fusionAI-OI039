import Code_embed_box from "@/components/common/Code_embed_box";
import Chatbot_playground from "@/components/common/dashboard-page/Chatbot_playground";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Code, Info, Palette, Plus, Save } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

import React, { useEffect, useState } from "react";
import { DB_URL } from "../../../utils/variables.js";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
  const { user } = useSelector((state) => state.auth);

  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const getMembersOfUser = async () => {
      try {
        setLoading(true);

        const res = await axios.post(
          `${DB_URL}/member/get-user-members`,
          {
            userId: user?._id,
          },
          {
            headers: {
              Authorization: Cookies.get("accessToken"),
            },
          },
        );

        if (res?.data?.success) {
          setAllMembers(res?.data?.members || []);
        } else {
          toast.error(res?.data?.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    getMembersOfUser();
  }, [user]);

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      setDeleteLoading(true);

      const res = await axios.post(
        `${DB_URL}/member/delete`,
        {
          memberId: memberToDelete?._id,
        },
        {
          headers: {
            Authorization: Cookies.get("accessToken"),
          },
        },
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);

        setAllMembers((prev) =>
          prev.filter((member) => member._id !== memberToDelete._id),
        );

        setMemberToDelete(null);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-lg mt-5 bg-zinc-950 p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-zinc-300 text-lg font-medium">Team Members</p>

            <p className="text-sm text-zinc-600">
              General settings for your organization.
            </p>
          </div>

          <AddUserDialog
            setAllMembers={setAllMembers}
            allMembers={allMembers}
          />
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 rounded-lg bg-zinc-900 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && allMembers.length === 0 && (
          <p className="text-center mt-10 mb-6 text-zinc-600 text-sm">
            No team members yet.
          </p>
        )}

        {/* Members List */}
        {!loading && allMembers.length > 0 && (
          <div className="mt-6 space-y-3">
            {allMembers.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg p-4"
              >
                <div>
                  <h3 className="text-white font-medium">{member?.name}</h3>

                  <p className="text-sm text-zinc-500">{member?.email}</p>
                </div>

                <button
                  onClick={() => setMemberToDelete(member)}
                  disabled={member?._id === user?._id}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!memberToDelete}
        onOpenChange={(open) => {
          if (!open) setMemberToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold">{memberToDelete?.name}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteMember}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};



const LogOut = ({ navigate }) => {
  const handleLogOut = async () => {
    try {
      const res = await axios.get(DB_URL + "/user/logout", {
        withCredentials: true,
      });

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        Cookies.remove("accessToken");

        navigate("/");
        window.location.reload();
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      return toast.error(error?.message);
    }
  };
  return (
    <>
      <div className="flex w-full" onClick={handleLogOut}>
        <div className="p-4 w-full bg-[#ff000024] rounded-lg mt-5">
          <p className="text-red-600">Sign Out</p>
          <p className="text-red-800 text-xs mt-1">
            Sign out of your account and end your current session on this
            device.
          </p>
          <Button
            onClick={handleLogOut}
            className={"w-full mt-3 h-10"}
            variant="destructive"
          >
            Log Out
          </Button>
        </div>
      </div>
    </>
  );
};

const AddUserDialog = ({ setAllMembers, allMembers }) => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const [isLoading, setisLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    try {
      const accessToken = Cookies.get("accessToken");
      const res = await axios.post(
        DB_URL + "/member/create",
        {
          name,
          email,
          password,
          userId: user?._id,
        },
        {
          headers: {
            Authorization: accessToken,
          },
          withCredentials: true,
        },
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setAllMembers((prev) => [res?.data?.member, ...allMembers]);
        setname("");
        setemail("");
        setpassword("");

        setOpen(false); // dialog close
      } else {
        toast.error(res?.data?.message || "Error creating member!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setisLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={""}>
          <Plus />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm dark">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className={"text-zinc-300"}>Add Member</DialogTitle>
            <DialogDescription>
              Add to your organization. they will be added immediately
            </DialogDescription>
            <br />
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label className={"text-zinc-400"} htmlFor="name-1">
                Name
              </Label>
              <Input
                onChange={(e) => setname(e.target.value)}
                placeholder={"John joe"}
                className={"h-10 placeholder:text-zinc-600 text-gray-200"}
                id="name-1"
                name="name"
              />
            </Field>
            <Field>
              <Label className={"text-zinc-400"} htmlFor="email">
                Email
              </Label>
              <Input
                onChange={(e) => setemail(e.target.value)}
                placeholder={"john@gmail.com"}
                className={"h-10 placeholder:text-zinc-600 text-gray-200"}
                id="email"
                name="email"
              />
            </Field>
            <Field>
              <Label className={"text-zinc-400 "} htmlFor="email">
                Password
              </Label>
              <Input
                onChange={(e) => setpassword(e.target.value)}
                placeholder={"********"}
                className={"h-10 placeholder:text-zinc-600 text-gray-200"}
                id="password"
                name="password"
              />
            </Field>
            <br />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
