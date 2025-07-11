import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NoPage from "./screens/NoPage";
import PublicGroups from "./screens/PublicGroups";
import PrivateGroups from "./screens/PrivateGroups";
import Stared from "./screens/Stared";
import Profile from "./screens/Profile";
import About from "./screens/About";
import Layout from "./components/layout/Layout";
import SignIn from "./screens/signin/SignIn";
import SignUp from "./screens/signup/SignUp";
import { ToastContainer } from "react-toastify";
import DarkModeToggle from "./components/modetoggler/DarkModeToggler";
import Home from "./screens/home/Home";
import MyGroups from "./screens/mygroups/MyGroups";
import Group from "./screens/group/Group";
import { useSelector } from "react-redux";

const App = () => {
  const isLogedIn = useSelector((state) => state.user.isLogedIn);

  return (
    <>
      <DarkModeToggle />
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          {isLogedIn ? (
            <>
              <Route path="/home" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="mygroups" element={<MyGroups />} />
                <Route path="publicgroups" element={<PublicGroups />} />
                <Route path="privategroups" element={<PrivateGroups />} />
                <Route path="stared" element={<Stared />} />
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
