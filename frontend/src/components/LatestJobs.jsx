import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const LatestJobs = () => {
    // Assuming your job slice also provides a loading status
    const { allJobs, loading } = useSelector(store => store.job);

    return (
        <section className='w-full bg-slate-50 py-20'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center max-w-3xl mx-auto'>
                    <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>
                        Latest & Top <span className='text-purple-600'>Job Openings</span>
                    </h1>
                    <p className='mt-4 text-base text-gray-500'>
                        Discover the most recent opportunities from leading companies. Your next career move is just a click away.
                    </p>
                </div>

                <div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {loading ? (
                        // Skeleton loaders while jobs are being fetched
                        Array.from({ length: 6 }).map((_, index) => <JobCardSkeleton key={index} />)
                    ) : allJobs && allJobs.length > 0 ? (
                        // Displaying the latest 6 jobs
                        allJobs.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)
                    ) : (
                        // Polished empty state message
                        <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-sm">
                            <Briefcase className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">No Job Openings Found</h3>
                            <p className="text-gray-500 mt-2">Please check back later for new opportunities.</p>
                        </div>
                    )}
                </div>

                {!loading && allJobs && allJobs.length > 0 && (
                     <div className='mt-12 text-center'>
                        <Link 
                            to="/jobs"
                            className="inline-block py-3 px-8 text-base font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                        >
                            View All Jobs
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

// A skeleton component to show while data is loading
const JobCardSkeleton = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-slate-200 rounded-md"></div>
                <div className="w-full">
                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
                <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
            </div>
        </div>
    );
};

export default LatestJobs;