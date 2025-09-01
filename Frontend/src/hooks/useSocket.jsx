// hooks/useSocket.js
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { addNotification } from "../state/notification/NotificationSlice";
import { toast } from "react-toastify";

const useSocket = () => {
  const socket = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const isLoggedIn = useSelector((state) => state.user.isLogedIn);

  useEffect(() => {
    if (isLoggedIn && user) {
      const token = localStorage.getItem("accessToken");

      if (token) {
        // Initialize socket connection
        socket.current = io("http://localhost:5000", {
          auth: { token },
          transports: ["websocket", "polling"],
        });

        // Connection events
        socket.current.on("connect", () => {
          console.log("Connected to server via Socket.IO");
        });

        socket.current.on("connect_error", (error) => {
          console.error("Socket connection error:", error.message);
        });

        // Notification events
        socket.current.on("new_notification", (notification) => {
          dispatch(addNotification(notification));

          // Show toast notification
          toast.info(
            <div>
              <strong>{notification.title}</strong>
              <p className="text-sm">{notification.message}</p>
            </div>,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "dark",
            }
          );
        });

        socket.current.on("disconnect", (reason) => {
          console.log("Disconnected from server:", reason);
        });
      }
    }

    // Cleanup function
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [isLoggedIn, user, dispatch]);

  // Utility function to emit events
  const emit = (event, data) => {
    if (socket.current && socket.current.connected) {
      socket.current.emit(event, data);
    }
  };

  return {
    socket: socket.current,
    emit,
    isConnected: socket.current?.connected || false,
  };
};

export default useSocket;
