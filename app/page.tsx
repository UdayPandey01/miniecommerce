"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading to show animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    router.push("/myProduct");
  };

  const features = [
    {
      title: "Browse Products",
      description: "Explore our wide range of products with detailed information.",
      icon: "🛍️",
    },
    {
      title: "Submit Items",
      description: "Easily add your own products to our marketplace.",
      icon: "📝",
    },
    {
      title: "Manage Listings",
      description: "Keep track of all your product listings in one place.",
      icon: "📊",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 text-black">
      <Navbar />
      
      <main className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left space-y-6">
              <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
                Welcome to <span className="text-indigo-600">MiniEcom</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
                Your go-to platform for managing products, submitting new items for sale, and exploring the world of e-commerce.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative h-64 md:h-96 w-full">
                <div className="absolute inset-0 bg-indigo-100 rounded-xl transform rotate-3 shadow-xl"></div>
                <div className="absolute inset-0 bg-white rounded-xl shadow-lg flex items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-4 w-full h-full">
                    <div className="bg-gray-100 rounded-lg animate-pulse"></div>
                    <div className="bg-indigo-50 rounded-lg animate-pulse delay-100"></div>
                    <div className="bg-indigo-50 rounded-lg animate-pulse delay-200"></div>
                    <div className="bg-gray-100 rounded-lg animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
              <p className="mt-4 text-lg text-gray-600">Everything you need to manage your e-commerce experience</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to start your e-commerce journey?</h2>
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-xl hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg cursor-pointer"
            >
              Browse Products Now
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} MiniEcom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}