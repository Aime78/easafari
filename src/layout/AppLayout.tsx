import { Outlet, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "./Sidebar";
// import { Toaster } from "@/components/ui/sonner";

const AppLayout = () => {
  const navigate = useNavigate();
  
  async function logout() {
    navigate("/login");
  }

  return (
    <div className="grid min-h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] bg-[#f6f8fc]">
      <Sidebar />
      <div className="flex flex-col p-4">
        <header className="h-14 lg:h-[40px] bg-[#f6f8fc] px-6 flex items-center justify-end mb-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full cursor-pointer hover:bg-gray-100"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@username"
                    />
                    <AvatarFallback className="bg-gray-200">UN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white shadow-lg border border-gray-200"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Uwineza Bienheureuse
                    </p>
                    <p className="text-xs text-gray-600">
                      uwinezabienheureuse@gmail.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="hover:bg-gray-100 text-gray-700 cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 text-gray-700 cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  onClick={logout}
                  className="hover:bg-gray-100 text-gray-700 cursor-pointer"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex-1 bg-white rounded-xl shadow-none ">
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="px-8 py-6 text-black">
              <Outlet />
              {/* <Toaster /> */}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
