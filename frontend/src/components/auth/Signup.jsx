import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import {
  Loader2,
  User,
  Mail,
  KeyRound,
  Phone,
  ImageUp,
  Building,
  UserCheck,
} from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    file: null,
  });
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      setInput({ ...input, file: e.target.files[0] });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Left Side */}
          <div className="hidden md:flex flex-col justify-center items-center p-12 bg-purple-600 text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome Aboard!</h1>
            <p className="text-center text-purple-200 mb-8">
              Join thousands of professionals and find the opportunity that's right for you.
            </p>
            <div className="w-64 h-64">
              <img src="/path-to-your/illustration.svg" alt="Recruitment Illustration" />
            </div>
          </div>

          {/* Right Side: Signup Form */}
          <div className="p-8 md:p-12 relative">
            <div className="flex flex-col items-center text-center mb-8">
              <UserCheck className="h-12 w-12 text-purple-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800">Create Your Account</h2>
              <p className="text-gray-500 mt-2">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-purple-600 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-6 z-10 relative">
              {/* Full Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-transparent border-b-2 border-gray-300 focus:border-purple-600 focus:outline-none transition duration-300"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="Email Address"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-transparent border-b-2 border-gray-300 focus:border-purple-600 focus:outline-none transition duration-300"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  placeholder="Phone Number"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-transparent border-b-2 border-gray-300 focus:border-purple-600 focus:outline-none transition duration-300"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-transparent border-b-2 border-gray-300 focus:border-purple-600 focus:outline-none transition duration-300"
                />
              </div>

              {/* Role */}
              <fieldset className="pt-4">
                <legend className="text-base font-medium text-gray-900 mb-2">I am signing up as a...</legend>
                <div className="flex gap-4">
                  {["student", "recruiter"].map((role) => (
                    <label
                      key={role}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer w-1/2 ${
                        input.role === role ? "border-purple-600 bg-purple-50" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={input.role === role}
                        onChange={changeEventHandler}
                        className="hidden"
                      />
                      {role === "student" ? (
                        <User className="h-6 w-6 mr-3 text-purple-600" />
                      ) : (
                        <Building className="h-6 w-6 mr-3 text-purple-600" />
                      )}
                      <span className="font-semibold text-gray-700">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* File Input */}
              <div className="relative">
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <ImageUp className="h-6 w-6 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-600">
                    {input.file ? input.file.name : "Upload Profile Photo (Optional)"}
                  </span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={changeFileHandler}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 text-base font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing Up...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
