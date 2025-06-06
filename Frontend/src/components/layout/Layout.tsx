import { Outlet } from "react-router-dom";
import SideBar from "../sidebar/SideBar";

const layout = () => {
  return (
    <>
      <SideBar />
      <Outlet />
    </>
  );
};

export default layout;
