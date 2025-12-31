import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "@/context/AppContext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Ghost, Phone, Lock, Info } from "lucide-react";
import bg3 from "@/assets/assets_frontend/aurora.webp"; // Background image import

const Gateway = () => {
    const { backendUrl, token, setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const [state, setState] = useState("Sign Up");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            if (state === "Sign Up") {
                // Registration request
                const { data } = await axios.post(`${backendUrl}/api/user/register-anonymous`, {
                    phone,
                    password,
                });
                if (data.success) {
                    localStorage.setItem("token", data.token);
                    setToken(data.token);
                    toast.success(data.message || "Account created successfully!");
                    navigate("/");
                } else {
                    toast.error(data.message);
                }
            } else {
                // Login request
                const { data } = await axios.post(`${backendUrl}/api/user/login-anonymous`, {
                    phone,
                    password,
                });
                if (data.success) {
                    localStorage.setItem("token", data.token);
                    setToken(data.token);
                    toast.success(data.message || "Login successful!");
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
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
            {/* Cross Icon Button at the top-right corner */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-12 right-12 bg-gray-900/80 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black focus:outline-none transition-colors border border-zinc-700"
                aria-label="Close"
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

            <form
                onSubmit={onSubmitHandler}
                className="bg-[#242425] p-10 rounded-3xl shadow-lg w-full max-w-md text-zinc-200 border border-zinc-700/50"
            >
                <div className="flex items-center justify-center mb-4">
                    <Ghost className="w-8 h-8 text-green-500 mr-2" />
                    <h2 className="text-2xl font-bold">
                        {state === "Sign Up" ? "Create Anonymous Account" : "Anonymous Login"}
                    </h2>
                </div>

                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 mb-6 flex items-start gap-2">
                    <Info className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-zinc-300">
                        {state === "Sign Up"
                            ? "Create an anonymous account using only your phone number. Your privacy is our priority."
                            : "Login using your registered phone number."}
                    </p>
                </div>

                {message && <p className="text-red-500 mb-4">{message}</p>}

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                        <input
                            type="tel"
                            onChange={(e) => setPhone(e.target.value)}
                            value={phone}
                            required
                            placeholder="Enter your phone number"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 bg-[#333335] text-zinc-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">We'll never share your phone number</p>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            placeholder="Enter your password"
                            minLength={8}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 bg-[#333335] text-zinc-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">Minimum 8 characters</p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 mb-4 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        state === "Sign Up" ? "Create Account" : "Login"
                    )}
                </button>

                <p className="text-center text-sm">
                    {state === "Sign Up" ? (
                        <>
                            Already have an account?{" "}
                            <span
                                onClick={() => setState("Login")}
                                className="text-green-500 underline cursor-pointer hover:text-green-400 transition-colors"
                            >
                                Login Here
                            </span>
                        </>
                    ) : (
                        <>
                            Create a new account?{" "}
                            <span
                                onClick={() => setState("Sign Up")}
                                className="text-green-500 underline cursor-pointer hover:text-green-400 transition-colors"
                            >
                                Click Here
                            </span>
                        </>
                    )}
                </p>

                <div className="mt-6 pt-6 border-t border-zinc-700">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-zinc-600 text-zinc-300 hover:bg-zinc-700 transition-colors"
                    >
                        <span>Back to Regular Login</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Gateway;
