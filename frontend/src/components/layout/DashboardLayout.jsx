import React, { useState } from "react";
import CompleteProfile from "../common/dashboard-page/CompleteProfile";
import Sidebar from "../common/dashboard-page/Sidebar";
import ResponsiveContainer from "../common/ResponsiveContainer";

const DashboardLayout = ({ headerVisible = true, children }) => {
  const [isProfileCompleted, setisProfileCompleted] = useState(true);
  return (
    <div>
      {!isProfileCompleted && (
        <CompleteProfile setisProfileCompleted={setisProfileCompleted} />
      )}

      {isProfileCompleted && (
        <>
          <div className="flex  h-screen">
            <Sidebar />
            <ResponsiveContainer className={`overflow-y-auto`}>
              {children}
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
