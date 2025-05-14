"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: signupData } = await axios.post(
      "/api/user/sign-up",
      formData
    );
    await handleSignin();
  };

  const handleSignin = async () => {
    const { data } = await axios.post("/api/user/sign-in", {
      email: formData.email,
      password: formData.password,
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setIsLogin(true);
    setFormData({ fullName: "", email: "", password: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        await handleSignin();
      } else {
        await handleSignup();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Welcome!</h2>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent p-6">
      <div className="relative w-full max-w-md p-8 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-gradient-radial from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 bg-black/90 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-indigo-400/10 via-transparent to-transparent opacity-60 pointer-events-none" />
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            {isLogin ? "Login to FreelancerFi" : "Create an Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {!isLogin && (
              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg bg-gray-900/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-gray-900/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-lg font-semibold transition duration-200"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>

            <div className="text-center mt-6 text-gray-400">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-indigo-400 hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-indigo-400 hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
