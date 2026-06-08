import { Button } from "@/components/ui/button";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Cross,
  CrossIcon,
  File,
  FileText,
  Globe,
  Info,
  Text,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { validateUrl } from "../../../../utils/functions.js";
import axios from "axios";
import Cookies from "js-cookie";
import { DB_URL } from "../../../../utils/variables.js";

function AddKnowledgeModal({ open, setopen, allKnowledges, setallKnowledges }) {
  const [tabType, settabType] = useState("website"); // website | text | file
  const [loading, setloading] = useState(false);

  // for type website
  const [websiteUrl, setwebsiteUrl] = useState("");

  // for type text
  const [title, settitle] = useState("");
  const [content, setcontent] = useState("");

  // for type file
  const [file, setfile] = useState();

  const handleAddKnowledge = async () => {
    try {
      setloading(true);
      const formData = new FormData();

      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        throw new Error("Token not found");
      }

      if (tabType == "website") {
        const isValidUrl = validateUrl(websiteUrl);
        formData.append("knowledgeType", "website");
        formData.append("websiteUrl", websiteUrl);
      }
      if (tabType == "text") {
        if (!title || !content)
          throw new Error("Title and Content is required");
        formData.append("knowledgeType", "text");
        formData.append("title", title);
        formData.append("content", content);
      }
      if (tabType == "file") {
        if (!file) throw new Error("Provide a file");
        formData.append("knowledgeType", "file");
        formData.append("file", file);
      }

      const res = await axios.post(
        `${DB_URL}/knowledge/add-knowledge`,
        formData,
        { headers: { Authorization: accessToken }, withCredentials: true },
      );

      if (res.data?.success) {
        toast.success(res.data.message);
        setallKnowledges((prev) => [res?.data?.knowledge, ...prev]);
        settitle("");
        setcontent("");
        setfile(null);
        setwebsiteUrl("");
        setopen(false);
      }
      if (!res.data?.success) toast.error(res.data.message);
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <form>
        <DialogContent className="sm:max-w-sm text-white p-6 min-w-130 bg-black ">
          <DialogHeader>
            <DialogTitle className={"text-zinc-300"}>
              Add New Sources
            </DialogTitle>
            <DialogDescription>
              Choose a content type to train your your assistant.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 ">
            {/* tabs  */}
            <div className="flex  pb-2  items-center">
              <div
                onClick={() => settabType("website")}
                className={`p-3 text-zinc-400 hover:bg-zinc-800 cursor-pointer border-black hover:border-zinc-700 border-b-2 ${tabType == "website" && " border-blue-700! "} `}
              >
                Website
              </div>
              <div
                onClick={() => settabType("text")}
                className={`p-3 text-zinc-400 hover:bg-zinc-800 cursor-pointer border-black hover:border-zinc-700 border-b-2 ${tabType == "text" && " border-blue-700! "} `}
              >
                QA/Text
              </div>
              <div
                onClick={() => settabType("file")}
                className={`p-3 text-zinc-400 hover:bg-zinc-800 cursor-pointer border-black hover:border-zinc-700 border-b-2 ${tabType == "file" && " border-blue-700! "} `}
              >
                File Upload
              </div>
            </div>

            {tabType == "website" && (
              <WebsiteTypeContent
                loading={loading}
                handleAddKnowledge={handleAddKnowledge}
                websiteUrl={websiteUrl}
                setwebsiteUrl={setwebsiteUrl}
              />
            )}
            {tabType == "text" && (
              <TextTypeContent
                loading={loading}
                handleAddKnowledge={handleAddKnowledge}
                title={title}
                content={content}
                setcontent={setcontent}
                settitle={settitle}
              />
            )}
            {tabType == "file" && (
              <FileTypeContent
                loading={loading}
                handleAddKnowledge={handleAddKnowledge}
                file={file}
                setfile={setfile}
              />
            )}
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default AddKnowledgeModal;

const WebsiteTypeContent = ({
  handleAddKnowledge,
  loading,
  websiteUrl,
  setwebsiteUrl,
}) => {
  return (
    <div className="my-4">
      {/* <div className="p-3 bg-[#ff1f1f22] my-3 border border-red-800 rounded-lg w-full">
        <div className="flex items-center  gap-3">
          <Info size={20} className="text-red-800" />
          <p className="text-xs mt-1 text-zinc-600">Please enter a valid URL</p>
        </div>
      </div> */}
      <div className="p-3 bg-[#9e1fff22] border border-purple-800 rounded-lg w-full">
        <div className="flex gap-3">
          <Globe size={20} className="text-purple-800" />
          <div>
            <p className="text-sm text-zinc-300">Crawl website</p>
            <p className="text-xs mt-1 text-zinc-600">
              Enter a website URL to crawl significantly or add a specific page
              link to provide focused context.{" "}
            </p>
          </div>
        </div>
      </div>
      <Field className={"mt-6"}>
        <FieldLabel
          className={"text-zinc-300 text-xs!"}
          htmlFor="fieldgroup-name"
        >
          Website URL*{" "}
        </FieldLabel>
        <Input
          value={websiteUrl}
          onChange={(e) => setwebsiteUrl(e.target.value)}
          id="fieldgroup-name"
          placeholder="https://example.com"
        />
      </Field>
      <Button
        onClick={handleAddKnowledge}
        disabled={loading}
        variant="outline"
        className={"w-full text-black cursor-pointer mt-6 p-5 "}
      >
        {!loading && "Submit"}
        {loading && <Loader></Loader>}
      </Button>
    </div>
  );
};

const TextTypeContent = ({
  handleAddKnowledge,
  loading,
  title,
  settitle,
  content,
  setcontent,
}) => {
  return (
    <div className="my-4">
      <div className="p-3 bg-[#9e1fff22] border border-purple-800 rounded-lg  w-full">
        <div className="flex gap-3">
          <Text size={20} className="text-purple-800" />
          <div>
            <p className="text-sm text-zinc-300">Raw Text</p>
            <p className="text-xs mt-1 text-zinc-600">
              Paste existing FAQs, policies, or internal notes directly.
            </p>
          </div>
        </div>
      </div>
      <Field className={"mt-6"}>
        <FieldLabel className={"text-zinc-300 text-xs!"} htmlFor="title">
          Title
        </FieldLabel>
        <Input
          value={title}
          onChange={(e) => settitle(e.target.value)}
          id="title"
          placeholder="e.g.  Refund Policy"
        />
      </Field>
      <Field className={"mt-4"}>
        <FieldLabel className={"text-zinc-300 text-xs!"} htmlFor="content">
          Content
        </FieldLabel>
        <Textarea
          className={"max-h-40 scrollbar-slim"}
          value={content}
          onChange={(e) => setcontent(e.target.value)}
          id="content"
          placeholder="Paste text here..."
        />
      </Field>
      <Button
        onClick={handleAddKnowledge}
        disabled={loading}
        variant="outline"
        className={"w-full text-black cursor-pointer mt-6 p-5 "}
      >
        {!loading && "Submit"}
        {loading && <Loader></Loader>}
      </Button>
    </div>
  );
};

const FileTypeContent = ({ handleAddKnowledge, loading, file, setfile }) => {
  const [isDragging, setisDragging] = useState(false);
  return (
    <div className="my-4 relative ">
      {file && <X onClick={()=>{
        setfile(null)
      }} className="absolute hover:text-blue-500 cursor-pointer -top-3 -right-2"></X>}
      <label
        htmlFor="file"
        className={`h-40 text-zinc-600  cursor-pointer w-full border-2 border-dashed rounded-xl border-zinc-700 flex justify-center items-center ${isDragging && " border-blue-700!  "} `}
      >
        <input
          onChange={(e) => {
            console.log(e.target.files[0]);
            setfile(e.target.files[0]);
          }}
          type="file"
          hidden
          multiple={false}
          accept=".pdf, .docx, .csv, .txt, .md"
          id="file"
        />
        {!file && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setisDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setisDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setfile(e.dataTransfer.files[0]);
              setisDragging(false);
            }}
            className="flex justify-center items-center flex-col "
          >
            <Upload
              size={50}
              className={`p-3 rounded-full bg-zinc-950 ${isDragging && " text-blue-700  "} `}
            />
            <p className="mt-2 text-sm">Click to upload or drag and drop</p>
            <p className="mt-1 text-xs text-zinc-800">CSV (max 10 mb) </p>
          </div>
        )}
        {file && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setisDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setisDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setfile(e.dataTransfer.files[0]);
              setisDragging(false);
            }}
            className="flex justify-center items-center flex-col "
          >
            <FileText
              size={50}
              className={`p-3 rounded-full bg-zinc-950 ${file && " text-white "}  ${isDragging && " text-blue-700  "}  `}
            />

            <p className="mt-2 text-sm">{file?.name}</p>
          </div>
        )}
      </label>
      <Button
        onClick={handleAddKnowledge}
        disabled={loading}
        variant="outline"
        className={"w-full text-black cursor-pointer mt-6 p-5 "}
      >
        {!loading && "Submit"}
        {loading && <Loader></Loader>}
      </Button>
    </div>
  );
};
