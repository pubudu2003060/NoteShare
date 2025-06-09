import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import NoPage from "./screens/NoPage";
import MyGroups from "./screens/MyGroups";
import PublicGroups from "./screens/PublicGroups";
import PrivateGroups from "./screens/PrivateGroups";
import Stared from "./screens/Stared";
import Profile from "./screens/Profile";
import About from "./screens/About";
import Layout from "./components/layout/Layout";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import { ToastContainer } from "react-toastify";
import DarkModeToggle from "./components/modetoggler/DarkModeToggler";

const App = () => {
  return (
    <>
      <DarkModeToggle />
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="mygroups" element={<MyGroups />} />
            <Route path="publicgroups" element={<PublicGroups />} />
            <Route path="privategroups" element={<PrivateGroups />} />
            <Route path="stared" element={<Stared />} />
            <Route path="profile" element={<Profile />} />
            <Route path="about" element={<About />} />
          </Route>
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
