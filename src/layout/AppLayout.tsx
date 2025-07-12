import {
  Home,
  Bell,
  Settings,
  HelpCircle,
  Bed,
  MapPin,
  Camera,
  Car,
  Calendar,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
import logo from "@/assets/logo.png";
// import { Toaster } from "@/components/ui/sonner";

const AppLayout = () => {
  const navigate = useNavigate();
  async function logout() {
    navigate("/login");
  }
  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-6 py-2 rounded-lg flex items-center gap-2 ${
      isActive
        ? "bg-primary text-white font-medium"
        : "text-black font-normal hover:bg-primary hover:text-white hover:font-medium"
    }`;
  return (
    <div className="grid min-h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] bg-[#f6f8fc]">
      <div className="bg-[#f6f8fc] flex flex-col">
        <div className="flex h-12 items-center gap-3 px-4 lg:h-[60px] lg:px-6 font-bold">
          <img
            src={logo}
            alt="Company Logo"
            className="w-20 h-20 object-contain"
          />
         
        </div>
        <div className="flex flex-col h-[calc(100vh-70px)] text-sm">
          <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
            <NavLink to={"/tax-declaration"} className={getLinkClassName}>
              <Home className="w-4 h-4" />
              <span>Overview</span>
            </NavLink>
            <NavLink to={"/business-registration"} className={getLinkClassName}>
              <Bed className="w-4 h-4" />
              Accommodation
            </NavLink>
            <NavLink to={"/education"} className={getLinkClassName}>
              <MapPin className="w-4 h-4" />
              Attractions
            </NavLink>
            <NavLink to={"/health"} className={getLinkClassName}>
              <Camera className="w-4 h-4" />
              Experiences
            </NavLink>
            <NavLink to={"/defense"} className={getLinkClassName}>
              <Car className="w-4 h-4" />
              Tour Providers
            </NavLink>
            <NavLink to={"/infrastructure"} className={getLinkClassName}>
              <Calendar className="w-4 h-4" />
              Events
            </NavLink>
          </nav>
        </div>
      </div>
      <div className="flex flex-col p-4">
        <header className="h-14 lg:h-[40px] bg-[#f6f8fc] px-6 flex items-center justify-end mb-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-lg hover:bg-primary/20 cursor-pointer"
            >
              <Bell className="h-5 w-5 text-black" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-400 rounded-full" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg hover:bg-primary/20 cursor-pointer"
            >
              <HelpCircle className="h-5 w-5 text-black" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg hover:bg-primary/20 cursor-pointer"
            >
              <Settings className="h-5 w-5 text-black" />
            </Button>
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

        {/* Main Content */}
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
