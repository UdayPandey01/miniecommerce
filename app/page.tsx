"use client"

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/myProduct");
  };

  return (
    <div className="min-h-screen   text-black">
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center space-y-6 mt-12">
        <h1 className="text-5xl font-extrabold leading-tight text-black">
          Welcome to MiniEcom
        </h1>
        <p className="text-lg max-w-lg text-black opacity-80">
          Your go-to platform for managing products, submitting new items for sale, and exploring the world of e-commerce.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
