import {
  Home,
  Bed,
  MapPin,
  Plus,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";

const ProviderSidebar = () => {
  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-6 py-2 rounded-lg flex items-center gap-2 ${
      isActive
        ? "bg-primary text-white font-medium"
        : "text-black font-normal hover:bg-primary hover:text-white hover:font-medium"
    }`;

  return (
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
          <NavLink to={"/provider/dashboard"} className={getLinkClassName}>
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to={"/provider/experiences"} className={getLinkClassName}>
            <Bed className="w-4 h-4" />
            <span>Services</span>
          </NavLink>

          <NavLink to={"/provider/bookings"} className={getLinkClassName}>
            <Plus className="w-4 h-4" />
            <span>Bookings</span>
          </NavLink>

          <NavLink to={"/provider/payments"} className={getLinkClassName}>
            <MapPin className="w-4 h-4" />
            <span>Payments</span>
          </NavLink>
          <NavLink to={"/provider/profile"} className={getLinkClassName}>
            <User className="w-4 h-4" />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default ProviderSidebar;
