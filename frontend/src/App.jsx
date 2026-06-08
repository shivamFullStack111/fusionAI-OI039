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
import io from "socket.io-client";

export const socket = io(DB_URL.replace("/api", ""),{
  autoConnect:false
});


const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  axios.defaults.withCredentials = true;

  const accessTokenCookieOptions = () => ({
    expires: new Date(new Date().getTime() + 15 * 60 * 1000),
  });

  const setAccessTokenHeader = (token) => {
    if (token) {
      axios.defaults.headers.common.Authorization = token;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  };

  const setClientAccessToken = (token) => {
    if (!token) return;

    Cookies.set("accessToken", token, accessTokenCookieOptions());
    setAccessTokenHeader(token);
    dispatch(setAccessToken(token));
  };

  const clearAuthState = () => {
    dispatch(setIsAuthenticated(false));
    dispatch(setUser(null));
    dispatch(setAccessToken(null));
    dispatch(setIsLoading(false));
    localStorage.removeItem("user");
    Cookies.remove("accessToken");
    setAccessTokenHeader(null);
  };

  const handleLogOut = async ({ callApi = true } = {}) => {
    try {
      if (callApi) {
        await axios.get(DB_URL + "/user/logout", {
          withCredentials: true,
          skipAuthRefresh: true,
        });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      clearAuthState();
      // navigate("/");
    }
  };

  const refreshAccessToken = async () => {
    const res = await axios.get(DB_URL + "/user/refresh-token", {
      withCredentials: true,
      skipAuthRefresh: true,
    });

    if (!res.data?.success || !res.data?.accessToken) {
      throw new Error(res.data?.message || "Unable to refresh token");
    }

    setClientAccessToken(res.data.accessToken);
    return res.data.accessToken;
  };

  const checkAuth = async (isRetry = false) => {
    try {
      const accessToken = Cookies.get("accessToken");
      const token = accessToken || (await refreshAccessToken());

      const res = await axios.get(DB_URL + "/user/isAuthenticated", {
        headers: {
          Authorization: token,
        },
      });

      if (res.data?.success) {
        const activeToken = Cookies.get("accessToken") || token;
        dispatch(setIsAuthenticated(true));
        dispatch(setUser(res?.data?.user));
        setClientAccessToken(activeToken);

        localStorage.setItem("user", JSON.stringify(res.data?.user));
      }
    } catch (error) {
      if (error.response?.status == 401 && !isRetry) {
        try {
          await refreshAccessToken();
          return await checkAuth(true);
        } catch {
          return await handleLogOut({ callApi: false });
        }
      }

      if (!Cookies.get("accessToken")) {
        clearAuthState();
      }

      console.log(error.message);
    }
  };

  useEffect(() => {
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
      failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
      });
      failedQueue = [];
    };

    const isAuthEndpoint = (url = "") =>
      url.includes("/user/refresh-token") ||
      url.includes("/user/login") ||
      url.includes("/user/register") ||
      url.includes("/user/logout");

    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (!config.skipAuthRefresh) {
          const token = Cookies.get("accessToken");
          config.headers = config.headers || {};

          if (token) {
            config.headers.Authorization = token;
          } else {
            delete config.headers.Authorization;
          }
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status !== 401 ||
          !originalRequest ||
          originalRequest._retry ||
          originalRequest.skipAuthRefresh ||
          isAuthEndpoint(originalRequest.url)
        ) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = token;
            return axios(originalRequest);
          });
        }

        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = newToken;
          return axios(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          await handleLogOut({ callApi: false });
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      },
    );

    (async function () {
      dispatch(setIsLoading(true));
      await checkAuth();
      dispatch(setIsLoading(false));
    })();

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

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
