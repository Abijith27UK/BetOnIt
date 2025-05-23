import { RxHamburgerMenu } from "react-icons/rx";
import { Button } from "./ui";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isSignedIn, logout } = useAuth();

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAuthAction = () => {
    if (isSignedIn) {
      logout(); // Clear token
      navigate("/signin");
    } else {
      navigate("/signin");
    }
  };

  return (
    <nav className="sticky top-0 bg-white z-50 border-gray-200 bg-gradient-to-r from-black via-gray-900 to-black border-b shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span
            className="self-center text-4xl font-semibold whitespace-nowrap dark:text-white"
            style={{ fontFamily: "Black Ops One, cursive" }}
          >
            BetOnIt
          </span>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <Button
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm md:hidden rounded-lg focus:outline-none focus:ring-2 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 bg-transparent"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <RxHamburgerMenu size={30} />
        </Button>

        {/* Mobile View Menu */}
        <div
          className={`w-full lg:hidden flex flex-col  md:w-auto items-center ${
            isMenuOpen ? "" : "hidden"
          }`}
          id="navbar-default"
        >
          <Button
            className="bg-transparent mx-4 hover:bg-black w-[50%] font-gamble"
            onClick={() => navigate("/sports")}
          >
            Sports
          </Button>
          <Button
            className="bg-transparent mx-4 hover:bg-black w-[50%] font-gamble"
            onClick={() => navigate("/game")}
          >
            Plinko
          </Button>
          {isSignedIn && <Button
            className="bg-transparent mx-4 hover:bg-black w-[50%] font-gamble"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>}
          <Button
            className="bg-transparent mx-4 hover:bg-black w-[50%] font-gamble"
            onClick={handleAuthAction}
          >
            {isSignedIn ? "Logout" : "SignIn"}
          </Button>
        </div>

        {/* Desktop View Menu */}
        <div className="hidden w-full md:flex md:w-auto items-center" id="navbar-default">
          <Button
            className="bg-transparent mx-4 hover:bg-black font-gamble"
            onClick={() => navigate("/sports")}
          >
            Sports
          </Button>
          <Button
            className="bg-transparent mx-4 hover:bg-black font-gamble"
            onClick={() => navigate("/game")}
          >
            Plinko
          </Button>

          {/* Dropdown Hamburger - Desktop */}
          <div className="relative font-gamble" ref={dropdownRef}>
            <Button
              className="bg-transparent p-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <RxHamburgerMenu size={25} />
            </Button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(38,37,34,0.8)] shadow-lg z-50 backdrop-blur-md rounded-lg animate-fade-in-down">
                <Button
                  className="block w-full px-4 py-2 text-center dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/sports");
                  }}
                >
                  Sports
                </Button>
                <Button
                  className="block w-full px-4 py-2 text-center dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/game");
                  }}
                >
                  Plinko
                </Button>
                {isSignedIn && <Button
                  className="block w-full px-4 py-2 text-center dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/dashboard");
                  }}
                >
                  Dashboard
                </Button>}
                <Button
                  className="block w-full px-4 py-2 text-center dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleAuthAction();
                  }}
                >
                  {isSignedIn ? "Logout" : "SignIn"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
