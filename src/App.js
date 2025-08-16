// src/App.js


import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from './screens/Listener/authPage';

import ClientIdValidation from "./screens/Listener/ClientIDValidation";
import ClaimSlotPage from "./screens/Listener/ClaimSlotPage";
import MonthlyUsage from "./screens/Client/MonthlyUsage";
import RealtimeReading from "./screens/Client/RealtimeReading";
import AdminPanel from "./screens/Admin/AdminPanel";
import AdminDashBoard from "./screens/Admin/AdminDashBoard";
import LoginPage from "./screens/Login/LoginPage";



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/clientid" element = {<ClientIdValidation/>}/>
      <Route path="/claimslot" element = {<ClaimSlotPage/>}/>
      <Route path="/monthlyusage" element ={<MonthlyUsage/>}/>
      <Route path="/readings" element={<RealtimeReading/>}/>
      <Route path="/adminpanel" element={<AdminPanel/>}/>
      <Route path="/adminboard" element={<AdminDashBoard/>}/>
    </Routes>
  );
}

