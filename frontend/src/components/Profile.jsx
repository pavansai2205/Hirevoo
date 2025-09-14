import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Mail, Phone, Pen, FileText } from 'lucide-react';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import AppliedJobTable from './AppliedJobTable';

// Custom Avatar component with fallback, consistent with Navbar
const CustomAvatar = ({ src, fullName }) => {
    const getInitials = (name = "") => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return (
        <div className="h-32 w-32 rounded-full flex items-center justify-center bg-purple-100 text-purple-700 font-bold text-4xl border-4 border-white shadow-md mx-auto">
            {src ? (
                <img src={src} alt={fullName} className="h-full w-full object-cover rounded-full" />
            ) : (
                <span>{getInitials(fullName)}</span>
            )}
        </div>
    );
};

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Profile Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                            <div className="-mt-16 mb-4">
                                <CustomAvatar src={user?.profile?.profilePhoto} fullName={user?.fullname} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">{user?.fullname}</h1>
                            <p className="text-sm text-gray-500 mt-1">{user?.profile?.bio || "No bio available."}</p>
                            
                            <button 
                                onClick={() => setOpen(true)} 
                                className="w-full mt-6 flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                            >
                                <Pen className="h-4 w-4" />
                                Edit Profile
                            </button>

                            <div className="mt-6 pt-6 border-t text-left space-y-4">
                                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact Information</h2>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="h-5 w-5 text-purple-500 flex-shrink-0" />
                                    <span className="truncate text-sm">{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="h-5 w-5 text-purple-500 flex-shrink-0" />
                                    <span className="text-sm">{user?.phoneNumber}</span>
                                </div>
                            </div>
                            
                            {user?.profile?.resume && (
                                <div className="mt-6 pt-6 border-t">
                                     <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Resume</h2>
                                    <a 
                                        href={user.profile.resume} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] hover:shadow-lg"
                                    >
                                        <FileText className="h-4 w-4" />
                                        View Resume
                                    </a>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Right Column: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Skills Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {user?.profile?.skills && user.profile.skills.length > 0 ? (
                                    user.profile.skills.map((skill, index) => (
                                        <span key={index} className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1.5 rounded-full">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No skills added yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Applied Jobs Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                             <h2 className="text-xl font-bold text-gray-800 mb-4">Application History</h2>
                             {/* Applied Job Table */}
                             <AppliedJobTable />
                        </div>
                    </div>
                </div>
            </main>
            {/* The UpdateProfileDialog is already dependency-free from our previous step */}
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
}

export default Profile;