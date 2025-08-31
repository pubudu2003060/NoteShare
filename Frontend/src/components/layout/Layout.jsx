import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import SideBar from "../sidebar/SideBar";
import { JWTAxios } from "../../api/Axios";
import { setNotifications } from "../../state/notification/NotificationSlice";
import useSocket from "../../hooks/useSocket";

const Layout = () => {
  const dispatch = useDispatch();
  const { socket, isConnected } = useSocket();

  // Load notifications when component mounts
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await JWTAxios.get("/notification");
        if (response.data.success) {
          dispatch(setNotifications(response.data.notifications));
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    loadNotifications();
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 transition-all duration-300">
        <div className="ml-0 md:ml-64">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
