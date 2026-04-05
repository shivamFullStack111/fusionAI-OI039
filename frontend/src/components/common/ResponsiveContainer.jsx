import React from "react";

const ResponsiveContainer = ({ children,className }) => {
  return <div className={`container mx-auto max-w-7xl ${className}`}>{children}</div>;
};

export default ResponsiveContainer;
