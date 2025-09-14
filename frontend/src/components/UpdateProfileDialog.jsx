import React, { useEffect, useState } from 'react';
import { Loader2, User, Mail, Phone, Text, Wrench, FileUp, UserCog, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(', ') || "",
        file: null, // We'll handle showing the old resume separately
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        if (e.target.files) {
            setInput({ ...input, file: e.target.files[0] });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            setLoading(false);
            setOpen(false); // Close the dialog on success or failure
        }
    };

    // Effect to prevent body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        // Cleanup function
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [open]);

    // Don't render anything if the dialog is not open
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop Overlay */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={() => setOpen(false)}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 transform transition-all">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b rounded-t">
                    <div className="flex items-center gap-3">
                        <UserCog className="h-7 w-7 text-purple-600" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Update Your Profile</h3>
                            <p className="text-sm text-gray-500">Make changes to your profile here.</p>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => setOpen(false)} 
                        className="p-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm ml-auto inline-flex items-center"
                    >
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>

                {/* Body and Form */}
                <form onSubmit={submitHandler}>
                    <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                        {/* Input Fields using the consistent "Input with Icon" pattern */}
                        <InputField icon={<User />} name="fullname" value={input.fullname} onChange={changeEventHandler} placeholder="Full Name" />
                        <InputField icon={<Mail />} name="email" value={input.email} onChange={changeEventHandler} placeholder="Email" type="email" />
                        <InputField icon={<Phone />} name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} placeholder="Phone Number" />
                        <InputField icon={<Text />} name="bio" value={input.bio} onChange={changeEventHandler} placeholder="Bio (e.g., Aspiring Web Developer)" />
                        <InputField icon={<Wrench />} name="skills" value={input.skills} onChange={changeEventHandler} placeholder="Skills (e.g., React, Node.js, Python)" />
                        
                        {/* File Input */}
                        <div>
                            <label htmlFor="resume-upload" className="flex flex-col items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <FileUp className="h-6 w-6 text-gray-400 mb-2"/>
                                <span className="font-medium text-gray-600">{input.file ? input.file.name : "Upload New Resume (PDF)"}</span>
                                {user?.profile?.resume && !input.file && (
                                    <a href={user.profile.resume} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline mt-1" onClick={(e) => e.stopPropagation()}>
                                        View Current Resume
                                    </a>
                                )}
                            </label>
                            <input id="resume-upload" name="file" type="file" onChange={fileChangeHandler} accept="application/pdf" className="hidden" />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end p-6 space-x-4 border-t border-gray-200 rounded-b">
                        <button type="button" onClick={() => setOpen(false)} className="px-6 py-2 text-sm font-medium border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2 flex items-center justify-center text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Update Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Helper component to keep the form DRY
const InputField = ({ icon, name, ...props }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {React.cloneElement(icon, { className: 'h-5 w-5 text-gray-400' })}
        </div>
        <input
            name={name}
            id={name}
            {...props}
            className="w-full pl-10 pr-3 py-2 bg-transparent border-b-2 border-gray-300 focus:border-purple-600 focus:outline-none transition duration-300"
        />
    </div>
);

export default UpdateProfileDialog;