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
      className={`flex flex-row gap-3 items-center justify-between max-w-7xl mx-auto p-3  sticky top-0 z-50 rounded-xl transition-all duration-300 shadow-lg ${
        isScrolled ? "backdrop-blur-md bg-white/10" : "bg-transparent"
      }`}
      style={{ top: "10px" }}
    >
      <div className="flex flex-row items-center">
        <div
          className="text-xl font-semibold text-black cursor-pointer hover:scale-105 transform transition-transform duration-300 ease-out"
          onClick={handleHome}
        >
          MiniEcom
        </div>
      </div>

      <div className="flex font-medium items-center gap-9">
        <div className="flex items-center space-x-4">
          <span
            onClick={handleMyProducts}
            className="font-medium text-black cursor-pointer hover:scale-105 transform transition-transform duration-300 ease-out"
          >
            My Products
          </span>
          <span
            onClick={handleProductSubmission}
            className="font-medium text-black cursor-pointer hover:scale-105 transform transition-transform duration-300 ease-out"
          >
            Submit Product
          </span>
          {token ? (
            <button
              onClick={handleLogout}
              className="font-medium text-black cursor-pointer hover:scale-105 transform transition-transform duration-300 ease-out"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="font-medium text-black cursor-pointer hover:scale-105 transform transition-transform duration-300 ease-out"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar