import React, { useEffect } from "react";
import { Button } from "./components/ui/button";
import Home from "./pages/home/Home";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Dashboard_homePage from "./pages/dashboard/Dashboard_homePage";
import KnowledgePage from "./pages/dashboard/KnowledgePage";
import SectionsPage from "./pages/dashboard/SectionsPage";
import Chatbot from "./pages/dashboard/Chatbot";
import Settings from "./pages/dashboard/Settings";
import Conversations from "./pages/dashboard/Conversations";
import Cookies from "js-cookie";
import axios from "axios";
import { DB_URL } from "../utils/variables.js";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccessToken,
  setIsAuthenticated,
  setIsLoading,
  setUser,
} from "../store/slices/auth.slice.js";
import If_logedin from "./components/protected-routes/If_logedin";
import ChatbotUI from "./components/embed/ChatbotUI";
import BotIdNotFound from "./components/embed/BotIdNotFound";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    (async function () {
      dispatch(setIsLoading(true));
      await checkAuth();
      dispatch(setIsLoading(false));
    })();
  }, []);

  const checkAuth = async (isRetry = false) => {
    try {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) return refreshToken();

      const res = await axios.get(DB_URL + "/user/isAuthenticated", {
        headers: {
          Authorization: accessToken,
        },
      });

      if (res.data?.success) {
        dispatch(setIsAuthenticated(true));
        dispatch(setAccessToken(accessToken));
        dispatch(setUser(res?.data?.user));

        localStorage.setItem("user", JSON.stringify(res.data?.user));
      }
    } catch (error) {
      if (error.response && error.response.status == 401 && !isRetry) {
        return await refreshToken();
      }
      console.log(error.message);
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.get(DB_URL + "/user/refresh-token", {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAccessToken(res?.data?.accessToken));
        const expire_minutes_30 = new Date(
          new Date().getTime() + 30 * 60 * 1000,
        );

        Cookies.set("accessToken", res?.data?.accessToken, {
          expires: expire_minutes_30,
        });

        return await checkAuth(true);
      }
    } catch (error) {
      if (error.response && error.response.status == 401) {
        return await handleLogOut();
      }
      console.log(error.message);
    }
  };

  const handleLogOut = async () => {
    try {
      const res = await axios.get(DB_URL + "/user/logout", {
        withCredentials: true,
      });

      localStorage.clear("user");
      Cookies.remove("accessToken");

      // navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<ChatbotUI />} />
        <Route path="/chatbot-id-not-found" element={<BotIdNotFound />} />

        <Route
          path="/dashboard"
          element={
            <If_logedin>
              <Dashboard_homePage />
            </If_logedin>
          }
        />
        <Route
          path="/dashboard/knowledge"
          element={
            <If_logedin>
              <KnowledgePage />
            </If_logedin>
          }
        />
        <Route
          path="/dashboard/sections"
          element={
            <If_logedin>
              <SectionsPage />
            </If_logedin>
          }
        />
        <Route
          path="/dashboard/chatbot"
          element={
            <If_logedin>
              <Chatbot />
            </If_logedin>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <If_logedin>
              <Settings />
            </If_logedin>
          }
        />
        <Route
          path="/dashboard/conversations"
          element={
            <If_logedin>
              <Conversations />
            </If_logedin>
          }
        />
      </Routes>
      {/* <TestPayment/> */}
    </>
  );
};

export default App;
