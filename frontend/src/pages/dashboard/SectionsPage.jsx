import CreateSession_drawer from "@/components/common/dashboard-page/CreateSection_drawer";
import ViewSession_drawer from "@/components/common/dashboard-page/ViewSection_drawer";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAccessToken } from "../../../utils/functions.js";
import { DB_URL } from "../../../utils/variables.js";

import { SkeletonList } from "./KnowledgePage.jsx";

const SectionPage = () => {
  const [allSections, setallSections] = useState([]);
  const [viewDrawerOpen, setviewDrawerOpen] = useState(null); // ✅ null/id based
  const [isLoadingSections, setisLoadingSections] = useState(true);

  useEffect(() => {
    const getAllSections = async () => {
      try {
        const res = await axios.post(
          `${DB_URL}/section/get-all`,
          {},
          { headers: { Authorization: getAccessToken() } },
        );
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setallSections(res?.data?.sections);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setisLoadingSections(false);
      }
    };
    getAllSections();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8 w-full">
        <div className="flex justify-between items-center">
          <div>
            <h5 className="text-xl">Sections</h5>
            <p className="text-sm mt-1 text-zinc-600">
              Define behaviour and tone for different topics.
            </p>
          </div>
          <CreateSession_drawer
            allSections={allSections}
            setallSections={setallSections}
          />
        </div>

        <div className="bg-zinc-950 mt-7 border rounded-lg">
          <Table className={"mt-4"}>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm text-zinc-500 w-50">
                  SECTION NAME
                </TableHead>
                <TableHead className="text-sm text-zinc-500">SOURCES</TableHead>
                <TableHead className="text-sm text-zinc-500">TONE</TableHead>
                <TableHead className="text-sm text-zinc-500">
                  ALLOWED TOPICS
                </TableHead>
                <TableHead className="text-sm text-zinc-500">
                  BLOCKED TOPICS
                </TableHead>
                <TableHead className="text-sm text-zinc-500">STATUS</TableHead>
                <TableHead className="text-sm text-zinc-500">PREVIEW</TableHead>
              </TableRow>
            </TableHeader>
            {allSections?.map((section) => (
              <TableBody key={section?._id}>
                <TableRow>
                  <TableCell>
                    <p className="text-zinc-400">{section?.sectionName}</p>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-zinc-600">
                      {section?.knowledgeSourceIds?.length} sources
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm uppercase text-zinc-600">
                      {section?.tone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-zinc-600">
                      {section?.allowedTopics?.length} TOPICS
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-zinc-600">
                      {section?.blockedTopics?.length} TOPICS
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`text-xs px-2 rounded-full w-min border ${section?.isActive ? "bg-[#1af95224] border-green-700 text-green-700" : "bg-[#f91a1a24] border-red-700 text-red-700"}`}
                    >
                      {section?.isActive ? "Active" : "In Active"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ViewSession_drawer
                      section={section}
                      viewDrawerOpen={viewDrawerOpen === section?._id} // ✅ sirf is row ka open hoga
                      setviewDrawerOpen={(val) =>
                        setviewDrawerOpen(val ? section?._id : null)
                      }
                      setAllSections={setallSections}
                      allSections={allSections}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
            {isLoadingSections && <SkeletonList totalCell={7} />}

            {!isLoadingSections && allSections?.length === 0 && (
              <TableBody >
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="text-zinc-500">
                      No sections found. Create a new one.
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SectionPage;
