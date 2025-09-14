import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2, Mail, KeyRound, LogIn, User, Building } from "lucide-react";

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "student", // Default role
    });
    const { loading, user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
                    
                    {/* Left Side: Illustration & Welcome Text */}
                    <div className="hidden md:flex flex-col justify-center items-center p-12 bg-purple-600 text-white">
                         <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                         <p className="text-center text-purple-200 mb-8">
                            Sign in to continue your journey and access your personalized dashboard. Let's get you to your next opportunity.
                         </p>
                         {/* You can place an SVG illustration here */}
                         <div className="w-64 h-64">
                            <img src="/path-to-your/login-illustration.svg" alt="Login Illustration" />
                         </div>
                    </div>

                    {/* Right Side: Login Form */}
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col items-center text-center mb-8">
                            <LogIn className="h-12 w-12 text-purple-600 mb-4"/>
                            <h2 className="text-3xl font-bold text-gray-800">Sign In to Your Account</h2>
                            <p className="text-gray-500 mt-2">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-semibold text-purple-600 hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-6">
                            {/* Input with Icon Wrapper */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input type="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="Email Address" required className="w-full pl-10 pr-3 py-2 bg-transparent border-b-2 border-gray-300 focus:border-purple-600 focus:outline-none transition duration-300"/>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <KeyRound className="h-5 w-5 text-gray-400" />
                                </div>
                                <input type="password" name="password" value={input.password} onChange={changeEventHandler} placeholder="Password" required className="w-full pl-10 pr-3 py-2 bg-transparent border-b-2 border-gray-300 focus:border-purple-600 focus:outline-none transition duration-300"/>
                            </div>

                            {/* Custom Radio Buttons */}
                            <fieldset className="pt-4">
                                <legend className="text-base font-medium text-gray-900 mb-2">I am signing in as a...</legend>
                                <div className="flex gap-4">
                                    <label htmlFor="role-student" className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50 w-1/2">
                                        <input type="radio" id="role-student" name="role" value="student" checked={input.role === "student"} onChange={changeEventHandler} className="hidden" />
                                        <User className="h-6 w-6 mr-3 text-purple-600"/>
                                        <span className="font-semibold text-gray-700">Student</span>
                                    </label>
                                    <label htmlFor="role-recruiter" className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50 w-1/2">
                                        <input type="radio" id="role-recruiter" name="role" value="recruiter" checked={input.role === "recruiter"} onChange={changeEventHandler} className="hidden" />
                                        <Building className="h-6 w-6 mr-3 text-purple-600"/>
                                        <span className="font-semibold text-gray-700">Recruiter</span>
                                    </label>
                                </div>
                            </fieldset>
                            
                            <div className="text-right">
                                <a href="/forgot-password" className="text-sm font-medium text-purple-600 hover:underline">Forgot Password?</a>
                            </div>

                            <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-4 text-base font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;