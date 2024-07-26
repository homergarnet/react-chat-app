// src/App.js
import React, { useEffect, useRef, useState } from "react";
import useStore from "./store";
import ClipLoader from "react-spinners/ClipLoader";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./layout/AuthLayout";
import Chat from "./components/chat/AgentChat";
import ConnectCsr from "./pages/ConnectCsr";
import ClientChat from "./components/chat/ClientChat";
import AgentChat from "./components/chat/AgentChat";
import NestedSwal from "./components/NestedSwal";
import Swal from "sweetalert2";
import * as signalR from "@microsoft/signalr";
import { generateUniqueId } from "utils/GenerateUUID";
import { isAuthenticated, isTokenExpired } from "utils/TokenHelpers";
import useAuthContext  from "store/auth/useAuthContext";

function App() {
  const {
    loading,
    setLoading,
    data,
    error,
    fetchData,
    isClientConnected,
    setIsClientConnected,
  } = useStore();

  const {
    authLoading
  } = useAuthContext();
  // localStorage.setItem(
  //   "authToken",
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxIiwiVXNlcm5hbWUiOiJhZG1pbiIsIkZpcnN0TmFtZSI6ImFkbWluIiwiTWlkZGxlTmFtZSI6ImFkbWluIiwiTGFzdE5hbWUiOiJhZG1pbiIsIlVzZXJUeXBlIjoiYWRtaW4iLCJleHAiOjE3MjA1NzU2MzMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMSJ9.XQPWPvb6_sLQWUCpJEFuaB9io9SIlMfxwLjMI9HNByM"
  // );

  const [customerName, setCustomerName] = useState("");
  const [concern, setConcern] = useState("");
  const [connection, setConnection] = useState(null);
  const [roomId, setRoomId] = useState("waitingListRoom"); // Default room ID
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    // fetchData();
  }, [isLogin]);

  return (
    <div className="App">
      {loading && (
        <div className="spinner-container">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />

          <p className="please-wait-text">
            Please wait and will connect <br />
            you to our Customer Service Representative...
          </p>
        </div>
      )}

      {authLoading && (
        <div className="spinner-container">
          <ClipLoader size={50} color={"#123abc"} loading={authLoading} />
        </div>
      )}

      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="connect-csr" element={<ConnectCsr />} />
          <Route path="client-chat" element={<ClientChat />} />
        </Route>
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />}>
            <Route path="about" element={<AboutPage />} />
          </Route>
          <Route path="chat" element={<AgentChat />} />
        </Route>
        <Route path="chats" element={<AgentChat />} />
      </Routes>
    </div>
  );
}

export default App;
