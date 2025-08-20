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
import { useLogout, useAuth } from "@/features/auth";

const ProviderHeader = () => {
  const logout = useLogout();
  const { user } = useAuth();

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="h-14 lg:h-[40px] bg-[#f6f8fc] px-6 flex items-center justify-between mb-4 rounded-2xl">
      <div className="flex items-center">
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full cursor-pointer hover:bg-gray-100"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.name || user?.email} />
                <AvatarFallback className="bg-gray-200">
                  {getUserInitials(user?.name, user?.email)}
                </AvatarFallback>
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
                  {user?.name || "Provider"}
                </p>
                <p className="text-xs text-gray-600">{user?.email}</p>
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
  );
};

export default ProviderHeader;
