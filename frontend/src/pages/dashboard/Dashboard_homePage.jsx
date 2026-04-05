// import Code_embed_box from "@/components/common/Code_embed_box";
// import DashboardLayout from "@/components/layout/DashboardLayout";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   ArrowRight,
//   ArrowUpRight,
//   Check,
//   CheckCheck,
//   Globe,
//   MoveUpRight,
//   Plus,
//   Text,
//   Upload,
// } from "lucide-react";
// import React, { useState } from "react";
// import { useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";

// const Dashboard_homePage = () => {
//   const [sections, setsections] = useState([]);
//   const [knowledges, setknowledges] = useState([]);
//   const [recent5Conversations, recent5Conversations] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const accessToken = Cookies.get("accessToken");
//         if (!accessToken) {
//           toast.error("Access token not found. Please log in.");
//           return;
//         }

//         const res = await axios.get("/api/user/dashboard/get-data",{
//           headers: {
//             Authorization:  accessToken,
//           },
//         });
//         if (res.data.success) {
//           console.log(res.data.data);
//           toast.success(
//             res.data.message || "Dashboard data fetched successfully",
//           );
//           setsections(res.data.sections);
//           setknowledges(res.data.knowledges);
//           recent5Conversations(res.data.recent5Conversations);
//         } else {
//           toast.error(res.data.message || "Failed to fetch dashboard data");
//         }
//       } catch (error) {
//         toast.error(error.message || "Error fetching dashboard data");
//       }
//     };
//     fetchDashboardData();
//   }, []);
//   return (
//     <DashboardLayout>
//       <div className="p-8 w-full">
//         <SetupProgress navigate={navigate} knowledges={knowledges} sections={sections} />
//         <div className="flex gap-5 mt-5">
//           <div className="flex w-[60%] flex-col gap-5">
//             <KnowledgeBase  knowledges={knowledges} />
//             <Sections sections={sections} />
//           </div>
//           <div className="flex w-[40%] flex-col gap-5">
//             <RecentChats recent5Conversations={recent5Conversations} />
//             <InstallWidget />
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Dashboard_homePage;

// const SetupProgress = () => {
//   return (
//     <div className="w-full">
//       <h5 className="text-xl ">Setup Progress</h5>
//       <div className=" grid-cols-3 w-full grid  gap-5 mt-6">
//         <div
//           className={`flex w-full rounded-lg border bg-zinc-950 p-5  flex-row  text-zinc-600 justify-between items-center`}
//         >
//           <p className="text-sm  ">Knowledge Added</p>
//           <Check size={15} />
//         </div>
//         <div
//           className={`flex w-full rounded-lg border bg-zinc-950 p-5  flex-row  text-zinc-600 justify-between items-center`}
//         >
//           <p className="text-sm  ">Section Configured</p>
//           <Check size={15} />
//         </div>
//         <div
//           className={`flex w-full rounded-lg border border-blue-800 bg-[#0f5afd28] p-5  flex-row  text-zinc-600 justify-between items-center`}
//         >
//           <p className="text-sm  text-gray-300 ">Widget Installed</p>
//           <ArrowUpRight className="text-blue-800" size={15} />
//         </div>
//       </div>
//     </div>
//   );
// };

// const KnowledgeBase = () => {
//   return (
//     <div className="p-4 w-full border rounded-lg">
//       <div className="flex justify-between ">
//         <p>Knowledge Base</p>
//         <Button
//           variant="outline"
//           className="text-xs text-zinc-500 rounded-lg border px-2 py-1"
//         >
//           Manage sources
//         </Button>
//       </div>

//       <div className="grid gap-4 grid-cols-3">
//         <div className="w-full mt-3 border bg-zinc-950 p-3 rounded-lg ">
//           <div className="flex text-zinc-600 items-center gap-2">
//             <Globe className="text-blue-500" size={15} />
//             <p className="text-xs">Pages</p>
//           </div>
//           <p className="text-2xl text-gray-300 mt-1">0</p>
//         </div>
//         <div className="w-full mt-3 border bg-zinc-950 p-3 rounded-lg ">
//           <div className="flex text-zinc-600 items-center gap-2">
//             <Text className="text-blue-500" size={15} />
//             <p className="text-xs">Manual Texts</p>
//           </div>
//           <p className="text-2xl text-gray-300 mt-1">0</p>
//         </div>
//         <div className="w-full mt-3 border bg-zinc-950 p-3 rounded-lg ">
//           <div className="flex text-zinc-600 items-center gap-2">
//             <Upload className="text-blue-500" size={15} />
//             <p className="text-xs">Uploads</p>
//           </div>
//           <p className="text-2xl text-gray-300 mt-1">0</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Sections = () => {
//   return (
//     <div className="p-4 min-h-80 w-full border rounded-lg">
//       <div className="flex justify-between ">
//         <div>
//           <p>Sections</p>
//           <p className="text-xs text-zinc-600">
//             Configure behaviour for different topics
//           </p>
//         </div>
//         <Button className="text-xs rounded-lg border px-2 py-1">
//           <Plus /> Create Section
//         </Button>
//       </div>
//       <p className="text-center text-zinc-600 mt-10 text-sm">
//         No sections configured yet
//       </p>
//     </div>
//   );
// };

// const RecentChats = () => {
//   return (
//     <div className="p-4 min-h-80 w-full border rounded-lg">
//       <div className="flex justify-between ">
//         <div>
//           <p>Recent Chats</p>
//         </div>
//         <Button
//           variant="outline"
//           className="text-xs text-zinc-500 rounded-lg border px-2 py-1"
//         >
//           View all <ArrowRight />
//         </Button>
//       </div>
//       <p className="text-center text-zinc-600 mt-10 text-sm">No chats yet.</p>
//     </div>
//   );
// };

// const InstallWidget = () => {
//   return (
//     <div className="p-4 w-full border rounded-lg">
//       <div className="flex justify-between ">
//         <div>
//           <p>Install Widget</p>
//         </div>
//       </div>
//       <p className="text-xs mt-1 text-zinc-500">
//         Add this code to your website appropriate page.{" "}
//       </p>
//       <div className="mt-5">
//         <Code_embed_box showCopyButton={true} />
//       </div>
//     </div>
//   );
// };

import Code_embed_box from "@/components/common/Code_embed_box";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Globe,
  Plus,
  Text,
  Upload,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const Dashboard_homePage = () => {
  const [sections, setsections] = useState([]);
  const [knowledges, setknowledges] = useState([]);
  const [recent5Conversations, setrecent5Conversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const accessToken = Cookies.get("accessToken");

        if (!accessToken) {
          toast.error("Please login again");
          return;
        }

        const res = await axios.get("/api/user/dashboard/get-data", {
          headers: {
            Authorization: accessToken,
          },
        });

        if (res.data.success) {
          setsections(res.data.sections || []);
          setknowledges(res.data.knowledges || []);
          setrecent5Conversations(res.data?.recent5Conversations || []);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8 w-full">
        <SetupProgress knowledges={knowledges} sections={sections} />

        <div className="flex gap-5 mt-5">
          <div className="flex w-[60%] flex-col gap-5">
            <KnowledgeBase knowledges={knowledges} />
            <Sections sections={sections} navigate={navigate} />
          </div>

          <div className="flex w-[40%] flex-col gap-5">
            <RecentChats recent5Conversations={recent5Conversations} />
            <InstallWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard_homePage;

const SetupProgress = ({ knowledges, sections }) => {
  const knowledgeDone = knowledges?.length > 0;
  const sectionDone = sections?.length > 0;

  return (
    <div className="w-full">
      <h5 className="text-xl ">Setup Progress</h5>

      <div className="grid-cols-3 w-full grid gap-5 mt-6">
        {/* Knowledge */}
        <div className="flex w-full rounded-lg border bg-zinc-950 p-5 justify-between items-center">
          <p className="text-sm">Knowledge Added</p>
          {knowledgeDone ? <Check size={15} /> : <ArrowUpRight size={15} />}
        </div>

        {/* Sections */}
        <div className="flex w-full rounded-lg border bg-zinc-950 p-5 justify-between items-center">
          <p className="text-sm">Section Configured</p>
          {sectionDone ? <Check size={15} /> : <ArrowUpRight size={15} />}
        </div>

        {/* Widget */}
        <Link to={'/dashboard/chatbot'}  className="flex w-full rounded-lg border border-blue-800 bg-[#0f5afd28] p-5 justify-between items-center">
          <p className="text-sm text-gray-300">Widget Installed</p>
          <ArrowUpRight className="text-blue-500" size={15} />
        </Link>
      </div>
    </div>
  );
};

const KnowledgeBase = ({ knowledges }) => {
  const pages = knowledges.filter(k => k.knowledgeType === "website").length;
  const texts = knowledges.filter(k => k.knowledgeType === "text").length;
  const uploads = knowledges.filter(k => k.knowledgeType === "file").length;

  return (
    <div className="p-4 w-full border rounded-lg">
      <div className="flex justify-between">
        <p>Knowledge Base</p>
        <Button variant="outline" className="text-xs">
          Manage sources
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-3 mt-3">
        <CardItem icon={<Globe size={15} />} title="Pages" value={pages} />
        <CardItem icon={<Text size={15} />} title="Manual Texts" value={texts} />
        <CardItem icon={<Upload size={15} />} title="Uploads" value={uploads} />
      </div>
    </div>
  );
};

const CardItem = ({ icon, title, value }) => (
  <div className="border bg-zinc-950 p-3 rounded-lg">
    <div className="flex text-zinc-500 items-center gap-2">
      {icon}
      <p className="text-xs">{title}</p>
    </div>
    <p className="text-2xl text-gray-300 mt-1">{value}</p>
  </div>
);

const Sections = ({ sections, navigate }) => {
  return (
    <div className="p-4 min-h-80 w-full border rounded-lg">
      <div className="flex justify-between">
        <div>
          <p>Sections</p>
          <p className="text-xs text-zinc-600">
            Configure behaviour for different topics
          </p>
        </div>

        <Button
          className="text-xs"
          onClick={() => navigate("/dashboard/sections")}
        >
          <Plus size={14} /> Create
        </Button>
      </div>

      {sections?.length === 0 ? (
        <p className="text-center text-zinc-600 mt-10 text-sm">
          No sections yet
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {sections?.map((sec) => (
            <div
              key={sec._id}
              className="p-3 flex items-center justify-between border rounded-lg bg-zinc-900 text-sm"
            >
             <p> {sec?.sectionName}</p>
             <Link to={`/dashboard/sections`}><Button variant="outline" size="xs">View</Button></Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RecentChats = ({ recent5Conversations }) => {
  return (
    <div className="p-4 min-h-80 w-full border rounded-lg">
      <div className="flex justify-between">
        <p>Recent Chats</p>

        <Button variant="outline" className="text-xs">
          View all <ArrowRight size={14} />
        </Button>
      </div>

      {recent5Conversations.length === 0 ? (
        <p className="text-center text-zinc-600 mt-10 text-sm">
          No chats yet
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {recent5Conversations?.map((con) => (
            <div
              key={con?._id}
              className="p-2 flex items-center border rounded bg-zinc-900 text-sm"
            >
              {/* {con?.content?.slice(0, 40)}... */}
              <span>{con?.externaluserId}</span>
              <Link className={'ml-auto'} to={'/dashboard/conversations'}><Button  >View</Button></Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InstallWidget = () => {
  return (
    <div className="p-4 w-full border rounded-lg">
      <p>Install Widget</p>

      <p className="text-xs mt-1 text-zinc-500">
        Add this script to your website
      </p>

      <div className="mt-5">
        <Code_embed_box showCopyButton />
      </div>
    </div>
  );
};