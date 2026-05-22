import AddKnowledgeModal from "@/components/common/dashboard-page/AddKnowledgeModal";
import RightDrawer from "@/components/common/dashboard-page/CreateSection_drawer";
import ResponsiveContainer from "@/components/common/ResponsiveContainer";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import {
  Eye,
  FileArchive,
  FileText,
  Filter,
  FilterIcon,
  Folder,
  Globe,
  Notebook,
  Plus,
  Text,
  Upload,
} from "lucide-react";
import { DB_URL } from "../../../utils/variables.js";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAccessToken } from "../../../utils/functions.js";
import ViewKnowledge_drawer from "@/components/ui/ViewKnowledge_drawer.jsx";

const KnowledgePage = () => {
  const [addKnowledgeOpen, setaddKnowledgeOpen] = useState(false);
  const [knowledgeType, setknowledgeType] = useState("");
  const [allKnowledges, setallKnowledges] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const fetchAllKnowledges = async () => {
      try {
        setloading(true);
        const payload = {
          knowledgeType,
        };

        const res = await axios.post(`${DB_URL}/knowledge/get-all`, payload, {
          headers: { Authorization: getAccessToken() },
          withCredentials: true,
        });

        if (res.data.success) {
          setallKnowledges(res.data?.knowledges);
          toast.success(res.data?.message);
        } else {
          toast.error(res.data?.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setloading(false);
      }
    };

    fetchAllKnowledges();
  }, [knowledgeType]);

  return (
    <DashboardLayout>
      <div className="p-8 w-full">
        {/* drawer  */}
        <AddKnowledgeModal
          allKnowledges={allKnowledges}
          setallKnowledges={setallKnowledges}
          open={addKnowledgeOpen}
          setopen={setaddKnowledgeOpen}
        />
        {/* header  */}
        <div className="flex justify-between items-center ">
          <div>
            <h5 className="text-xl ">Knowledge Base</h5>
            <p className="text-sm mt-1 text-zinc-600">
              Manage your website sources, documents,and uploads.{" "}
            </p>
          </div>

          {/* <RightDrawer /> */}
          <Button
            onClick={() => setaddKnowledgeOpen(true)}
            className={"cursorpo"}
          >
            <Plus />
            Add Knowledge
          </Button>
        </div>

        {/* 3 boxes of add sources types */}
        <div className="grid grid-cols-3 gap-5 mt-7">
          <div
            onClick={() => setaddKnowledgeOpen(true)}
            className="p-5 cursor-pointer hover:border-blue-600 py-8  bg-zinc-950 border rounded-lg "
          >
            <div className="flex justify-center">
              <Globe
                size={40}
                className="text-blue-700 p-2 rounded-full bg-[#203aff26] border-blue-700"
              />
            </div>
            <p className="text-sm my-1 text-zinc-300 text-center">
              Add Website
            </p>
            <p className="text-xs mt-2 text-zinc-600 text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia,
              fugiat! Lorem, ipsum dolor.
            </p>
          </div>
          <div
            onClick={() => setaddKnowledgeOpen(true)}
            className="p-5 cursor-pointer hover:border-green-600 py-8  bg-zinc-950 border rounded-lg "
          >
            <div className="flex justify-center">
              <Upload
                size={40}
                className="text-green-700 p-2 rounded-full bg-[#49ff2026] border-green-700"
              />
            </div>
            <p className="text-sm my-1 text-zinc-300 text-center">
              Upload File
            </p>
            <p className="text-xs mt-2 text-zinc-600 text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia,
              fugiat! Lorem, ipsum dolor.
            </p>
          </div>
          <div
            onClick={() => setaddKnowledgeOpen(true)}
            className="p-5 cursor-pointer hover:border-yellow-600 py-8  bg-zinc-950 border rounded-lg "
          >
            <div className="flex justify-center">
              <Text
                size={40}
                className="text-yellow-700 p-2 rounded-full bg-[#fbff2026] border-yellow-700"
              />
            </div>
            <p className="text-sm my-1 text-zinc-300 text-center">
              Manual Text
            </p>
            <p className="text-xs mt-2 text-zinc-600 text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia,
              fugiat! Lorem, ipsum dolor.
            </p>
          </div>
        </div>

        {/* source list box  */}
        <KnowledgeTableList
          loading={loading}
          allKnowledges={allKnowledges}
          knowledgeType={knowledgeType}
          setknowledgeType={setknowledgeType}
          setallKnowledges={setallKnowledges}
        />
      </div>
    </DashboardLayout>
  );
};

export default KnowledgePage;

const KnowledgeTableList = ({
  loading,
  allKnowledges,
  knowledgeType,
  setknowledgeType,
  setallKnowledges,
}) => {
  return (
    <div className="  bg-zinc-950 mt-7 border rounded-lg ">
      <div className="flex p-5  justify-between items-center">
        <p>Sources</p>
        <div className="flex justify-center items-center gap-4">
          {/* <Input placeholder="Search Sources..."></Input> */}
          <Select
            onValueChange={(value) => {
              if (value === "all") setknowledgeType(null);
              else setknowledgeType(value);
            }}
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Select Knowledge Type" />
            </SelectTrigger>
            <SelectContent className={"dark"}>
              <SelectGroup>
                <SelectLabel>Knowledge Types</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="file">File</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={`text-sm text-zinc-500  w-50`}>
              SOURCE
            </TableHead>
            <TableHead className={`text-sm text-zinc-500  `}>TYPE</TableHead>
            <TableHead className={`text-sm text-zinc-500  `}>STATUS</TableHead>
            <TableHead className={`text-sm text-zinc-500  `}>
              CREATED AT
            </TableHead>
            <TableHead className={`text-sm text-zinc-500  `}>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading &&
            allKnowledges?.map((knowledge, i) => {
              return (
                <TableRow key={knowledge?._id}>
                  <TableCell>
                    {knowledge?.knowledgeType == "text" && (
                      <div className="flex gap-2 items-center">
                        <FileText size={18} className="text-blue-700" />
                        <div>
                          <p className="text-xs capitalize text-zinc-300">
                            {knowledge?.text?.title}
                          </p>
                          <p className="text-[11px] text-zinc-600">
                            {knowledge?.text?.content?.slice(0, 20) + "..."}
                          </p>
                        </div>
                      </div>
                    )}
                    {knowledge?.knowledgeType == "website" && (
                      <div className="flex gap-2 items-center">
                        <Globe size={18} className="text-blue-700" />
                        <div>
                          <p className="text-xs text-zinc-300">
                            {knowledge?.webite?.url}
                          </p>
                          <p className="text-[11px] text-zinc-600">
                            {knowledge?.webite?.content?.slice(0, 20) + "..."}
                          </p>
                        </div>
                      </div>
                    )}
                    {knowledge?.knowledgeType == "file" && (
                      <div className="flex gap-2 items-center">
                        <Folder size={18} className="text-blue-700" />
                        <div>
                          <p className="text-xs text-zinc-300">
                            {knowledge?.file?.fileName}
                          </p>
                          <p className="text-[11px] text-zinc-600">
                            {knowledge?.file?.content?.slice(0, 20) + "..."}
                          </p>
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm  uppercase text-zinc-600 h-full flex items-center">
                      {knowledge?.knowledgeType}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`text-xs  px-2 rounded-full  w-min border  ${knowledge?.isActive ? " bg-[#1af95224] border-green-700  text-green-700 " : " bg-[#f91a1a24] border-red-700  text-red-700 "} h-full flex items-center`}
                    >
                      {knowledge?.isActive ? "Active" : "In Active"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-zinc-600 text-sm">
                      {String(new Date(knowledge?.createdAt)).slice(4, 15)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ViewKnowledge_drawer
                      setallKnowledges={setallKnowledges}
                      allKnowledges={allKnowledges}
                      knowledge={knowledge}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>

        {!loading && allKnowledges?.length === 0 && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                <div className="text-zinc-500">No knowledge found. Add a new one.</div>
              </TableCell>
            </TableRow>
          </TableBody>
        )}

        {loading && <SkeletonList />}
      </Table>
    </div>
  );
};

export const SkeletonList = ({ totalCell }) => {
  return (
    <TableBody>
      {Array.from({ length: 6 }).map(() => (
        <TableRow>
          {Array.from({ length: totalCell || 6 }).map(() => {
            return (
              <TableCell className={"animate-pulse bg-zinc-900 "}>
                <div className="text-zinc-600 min-h-6 text-sm "></div>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
};
