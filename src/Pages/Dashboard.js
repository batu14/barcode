import React, { useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }
  }, []);
  return (
    <div className="w-full relative flex items-start justify-start min-h-screen overflow-x-hidden">
      <Sidebar></Sidebar>
      <Outlet></Outlet>
    </div>
  );
};

export default Dashboard;
