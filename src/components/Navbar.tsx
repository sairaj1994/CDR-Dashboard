
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FileAudio, LogOut, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Navbar = () => {
  const { authState, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!authState.isAuthenticated) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-blue-dark text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <FileAudio className="h-6 w-6" />
            <Link to="/dashboard" className="font-bold text-xl">
              Call Analytics
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="hover:text-blue-light">
              Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarFallback>
                  {authState.user ? getInitials(authState.user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <span>{authState.user?.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white hover:text-red-300"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              <Link
                to="/dashboard"
                className="block py-2 hover:text-blue-light"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 bg-primary">
                    <AvatarFallback>
                      {authState.user ? getInitials(authState.user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{authState.user?.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
