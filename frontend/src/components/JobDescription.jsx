import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Briefcase, MapPin, IndianRupee, Users, Clock, CheckCircle, Bone, CircleOff } from 'lucide-react';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });

            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };
    
    useEffect(() => {
        const fetchSingleJob = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(app => app.applicant === user?._id));
                }
            } catch (error) {
                console.log(error);
                dispatch(setSingleJob(null)); // Clear the job on error
            } finally {
                setLoading(false);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString("en-IN", options);
    };
    
    if (loading) {
        return <JobDescriptionSkeleton />;
    }

    if (!singleJob) {
        return (
            <div className="bg-slate-50 min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-128px)]">
                    <CircleOff className="h-24 w-24 text-gray-300 mb-4" />
                    <h2 className="text-3xl font-bold text-gray-700">Job Not Found</h2>
                    <p className="text-gray-500 mt-2">The job you are looking for does not exist or has been removed.</p>
                    <Link to="/jobs" className="mt-6 px-6 py-2 text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700">
                        Back to All Jobs
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <div className='max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Main Content (Left) */}
                    <main className='lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg'>
                        <div className="pb-6 border-b">
                            <h1 className='text-3xl font-extrabold text-gray-900'>{singleJob.title}</h1>
                            <p className="text-md text-gray-500 mt-2">at <span className="font-semibold text-gray-700">{singleJob.company.name}</span></p>
                            <div className='flex flex-wrap items-center gap-2 mt-4'>
                                <InfoPill icon={<Briefcase size={14}/>} text={singleJob.jobType} />
                                <InfoPill icon={<MapPin size={14}/>} text={singleJob.location} />
                                <InfoPill icon={<IndianRupee size={14}/>} text={`${singleJob.salary} LPA`} />
                                <InfoPill icon={<Users size={14}/>} text={`${singleJob.position} Positions`} />
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-xl font-bold text-gray-800">Job Description</h2>
                            <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-wrap">{singleJob.description}</p>
                        </div>
                         <div className="mt-6">
                            <h2 className="text-xl font-bold text-gray-800">About {singleJob.company.name}</h2>
                            <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-wrap">{singleJob.company.description || "No company description provided."}</p>
                        </div>
                    </main>

                    {/* Sidebar Card (Right) */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800">Job Overview</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                <OverviewItem icon={<Clock size={16}/>} label="Posted Date" value={formatDate(singleJob.createdAt)} />
                                <OverviewItem icon={<MapPin size={16}/>} label="Location" value={singleJob.location} />
                                <OverviewItem icon={<Briefcase size={16}/>} label="Job Type" value={singleJob.jobType} />
                                <OverviewItem icon={<IndianRupee size={16}/>} label="Salary" value={`${singleJob.salary} LPA`} />
                                <OverviewItem icon={<Users size={16}/>} label="Open Positions" value={singleJob.position} />
                            </ul>
                            <button
                                onClick={applyJobHandler}
                                disabled={isApplied}
                                className={`w-full mt-6 flex justify-center items-center py-3 px-4 text-base font-semibold rounded-lg transition-all duration-300 ${
                                    isApplied 
                                    ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                                    : 'text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transform hover:scale-[1.02] hover:shadow-lg'
                                }`}
                            >
                                {isApplied ? (
                                    <>
                                        <CheckCircle className="mr-2 h-5 w-5" /> Already Applied
                                    </>
                                ) : (
                                    'Apply Now'
                                )}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

// Helper components for cleaner code
const InfoPill = ({ icon, text }) => (
    <div className='flex items-center gap-2 text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full'>
        {icon}
        <span>{text}</span>
    </div>
);

const OverviewItem = ({ icon, label, value }) => (
     <li className="flex justify-between items-center">
        <div className="flex items-center text-gray-500">
            {React.cloneElement(icon, { className: 'mr-3' })}
            <span>{label}</span>
        </div>
        <span className="font-semibold text-gray-800">{value}</span>
    </li>
);

// Skeleton Loader Component
const JobDescriptionSkeleton = () => (
    <div className="bg-slate-50 min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
                    <div className="h-10 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/2 mb-6"></div>
                    <div className="flex flex-wrap gap-2 mb-8">
                        <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
                        <div className="h-8 w-28 bg-slate-200 rounded-full"></div>
                        <div className="h-8 w-32 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-5 bg-slate-200 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded w-11/12"></div>
                        <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                    </div>
                </div>
                <aside className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                         <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
                         <div className="space-y-4">
                            <div className="h-5 bg-slate-200 rounded"></div>
                            <div className="h-5 bg-slate-200 rounded"></div>
                            <div className="h-5 bg-slate-200 rounded"></div>
                         </div>
                         <div className="h-12 bg-slate-200 rounded-lg mt-8"></div>
                    </div>
                </aside>
            </div>
        </div>
    </div>
);

export default JobDescription;