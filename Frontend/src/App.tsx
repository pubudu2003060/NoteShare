import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import Layout from "./components/layout/layout";
import NoPage from "./screens/NoPage";
import MyGroups from "./screens/MyGroups";
import PublicGroups from "./screens/PublicGroups";
import PrivateGroups from "./screens/PrivateGroups";
import Stared from "./screens/Stared";
import Profile from "./screens/Profile";
import About from "./screens/About";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="mygroups" element={<MyGroups />} />
          <Route path="publicgroups" element={<PublicGroups />} />
          <Route path="privategroups" element={<PrivateGroups />} />
          <Route path="stared" element={<Stared />} />
          <Route path="profile" element={<Profile />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
