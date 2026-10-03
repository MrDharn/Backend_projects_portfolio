// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sideBar/sideBar";

export default function MainLayout() {
  return (
    <div className="app-layout" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <main
        className="main-content"
        style={{ flex: 1, padding: "24px", overflowY: "auto" }}
      >
        <Outlet />
      </main>
    </div>
  );
}