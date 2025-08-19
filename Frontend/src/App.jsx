import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NoPage from "./screens/NoPage";
import About from "./screens/about/About";
import Layout from "./components/layout/Layout";
import SignIn from "./screens/signin/SignIn";
import SignUp from "./screens/signup/SignUp";
import { ToastContainer } from "react-toastify";
import DarkModeToggle from "./components/modetoggler/DarkModeToggler";
import Home from "./screens/home/Home";
import MyGroups from "./screens/mygroups/MyGroups";
import Group from "./screens/group/Group";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { JWTAxios } from "./api/Axios";
import { addUserData, logedIn } from "./state/user/UserSlice";
import EditorGroups from "./screens/editorGroups/EditorGroups";
import UserGroups from "./screens/userGroups/UserGroups";
import Profile from "./screens/profile/Profile";

const App = () => {
  const isLogedIn = useSelector((state) => state.user.isLogedIn);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const test = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const userId = localStorage.getItem("userId");
      if (!userId || !accessToken || !refreshToken || isLogedIn) {
        setLoading(false);
        return;
      }
      try {
        const responce = await JWTAxios.get("/user/test", { userId });
        if (responce.data.success) {
          dispatch(addUserData(responce.data.user));
          dispatch(logedIn());
        } else {
          console.log(responce.data.message);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    test();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DarkModeToggle />
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Navigate to="/home" />} />
          {isLogedIn ? (
            <>
              <Route path="/home" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="mygroups" element={<MyGroups />} />
                <Route path="editorgroups" element={<EditorGroups />} />
                <Route path="usergroups" element={<UserGroups />} />
                <Route path="profile" element={<Profile />} />
                <Route path="about" element={<About />} />
                <Route path="group" element={<Group />} />
              </Route>
            </>
          ) : (
            <Route path="*" element={<Navigate to="/signin" />} />
          )}

          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default App;
