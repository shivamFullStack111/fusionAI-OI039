import { Loader2 } from "lucide-react";
import React from "react";

const Loader = (size = 25) => {
  return (
    <div>
      <Loader2  className="animate-spin text-3xl! " />
    </div>
  );
};

export default Loader;
