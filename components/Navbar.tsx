"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/sign-in"); 
  };

  function handleHome() {
    router.push("/");
  }

  function handleMyProducts() {
    router.push("/myProduct");
  }

  function handleProductSubmission() {
    router.push("/productSubmission");
  }

  function handleSignIn() {
    router.push("/sign-in");
  }

  return (
    <nav
      className={`flex flex-row gap-3 items-center justify-between max-w-7xl mx-auto p-4 sticky top-0 z-50 rounded-xl transition-all duration-300 ${
        isScrolled 
          ? "backdrop-blur-md bg-white/90 shadow-lg" 
          : "bg-white/50 shadow-md"
      }`}
      style={{ top: "10px" }}
    >
      <div className="flex flex-row items-center">
        <div
          className="text-2xl font-bold text-indigo-600 cursor-pointer hover:scale-105 transform transition-transform duration-300 ease-out"
          onClick={handleHome}
        >
          MiniEcom
        </div>
      </div>

      <div className="flex font-medium items-center gap-9">
        <div className="flex items-center space-x-6">
          <span
            onClick={handleMyProducts}
            className="font-medium text-gray-700 hover:text-indigo-600 cursor-pointer transition-colors duration-300"
          >
            My Products
          </span>
          <span
            onClick={handleProductSubmission}
            className="font-medium text-gray-700 hover:text-indigo-600 cursor-pointer transition-colors duration-300"
          >
            Submit Product
          </span>
          {token ? (
            <button
              onClick={handleLogout}
              className="font-medium px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer transition-colors duration-300"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="font-medium px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer transition-colors duration-300"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;