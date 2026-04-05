import { Loader2 } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const If_logedin = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
   return <div className="fixed z-999 w-full h-screen bg-[#000000] flex justify-center items-center top-0 right-0">
      <Loader2 size={40} className="animate-spin" />
    </div>;
  }

  if(isAuthenticated) return children
  
  return <Navigate to={'/'}/>


};

export default If_logedin;
