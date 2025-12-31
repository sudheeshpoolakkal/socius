import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "@/context/AppContext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import bg3 from "@/assets/assets_frontend/aurora.webp";
import { Ghost } from "lucide-react";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign In");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg3})` }}
    >
      {/* Anonymous Button at the top-left corner */}
      <button
        onClick={() => navigate("/gateway")}
        className="absolute top-12 left-12 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 focus:outline-none transition-colors"
        title="Anonymous Login"
      >
        <Ghost className="h-5 w-5" />
      </button>

      {/* Cross Icon Button at the top-right corner */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-12 right-12 bg-gray-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-500 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="bg-[#242425] p-10 rounded-3xl shadow-lg w-full max-w-md text-zinc-200 border border-zinc-700/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Socius</h2>
          <p className="text-zinc-400">{state === "Sign Up" ? "Join your neighborhood" : "Welcome back, neighbor"}</p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {state === "Sign Up" && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Full Name</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                className="w-full px-4 py-3 rounded-lg border border-zinc-600 bg-[#333335] text-zinc-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-zinc-500"
                placeholder="Jane Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full px-4 py-3 rounded-lg border border-zinc-600 bg-[#333335] text-zinc-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-zinc-500"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="w-full px-4 py-3 rounded-lg border border-zinc-600 bg-[#333335] text-zinc-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-zinc-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:shadow-xl hover:bg-blue-600 transition-all transform hover:-translate-y-0.5 mt-4"
          >
            {state === "Sign Up" ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-zinc-400 text-sm">
          {state === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <button onClick={() => setState("Sign In")} className="text-primary font-semibold hover:underline">
                Sign In
              </button>
            </>
          ) : (
            <>
              New to Socius?{" "}
              <button onClick={() => setState("Sign Up")} className="text-primary font-semibold hover:underline">
                Create Account
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
