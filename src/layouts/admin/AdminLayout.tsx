import { Outlet } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  return (
    <div className="grid min-h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] bg-[#f6f8fc]">
      <AdminSidebar />
      <div className="flex flex-col p-4">
        <AdminHeader />
        <div className="flex-1 bg-white rounded-xl shadow-none ">
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="px-8 py-6 text-black">
              <Outlet />
              <Toaster />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
