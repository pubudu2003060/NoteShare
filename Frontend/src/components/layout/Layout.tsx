import { Outlet } from "react-router-dom";
import SideBar from "../sidebar/SideBar";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
