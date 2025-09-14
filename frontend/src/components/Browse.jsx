import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const Browse = () => {
    useGetAllJobs();
    const { allJobs, loading } = useSelector(store => store.job);
    const dispatch = useDispatch();

    useEffect(() => {
        // Clear the search query when the component unmounts
        return () => {
            dispatch(setSearchedQuery(""));
        };
    }, [dispatch]);

    // Animation variants for the container and items
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <main className='max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8'>
                {/* Page Header */}
                <div className="text-center mb-12">
                     <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        All Job Openings
                     </h1>
                     <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                        {
                            loading 
                                ? 'Searching for the latest opportunities...'
                                : `Showing ${allJobs.length} open positions.`
                        }
                     </p>
                </div>

                {/* Job Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                >
                    {loading ? (
                        Array.from({ length: 12 }).map((_, i) => <JobCardSkeleton key={i} />)
                    ) : allJobs && allJobs.length > 0 ? (
                        allJobs.map((job) => (
                            <motion.div variants={itemVariants} key={job._id}>
                                <Job job={job} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center bg-white p-8 rounded-lg text-center h-64">
                            <Briefcase className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">No Jobs Available</h3>
                            <p className="text-gray-500 mt-2">There are currently no open positions. Please check back later!</p>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

// Reusable skeleton component for a consistent loading experience
const JobCardSkeleton = () => {
    return (
        <div className="p-6 rounded-lg shadow-md bg-white border border-gray-100 h-full animate-pulse">
            <div className='flex items-start justify-between mb-4'>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
                    <div>
                        <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-20"></div>
                    </div>
                </div>
                <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
            </div>
             <div className="space-y-2 mb-4">
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
             <div className='mt-auto pt-4 border-t border-gray-100 flex items-center gap-4'>
                <div className="h-10 bg-slate-200 rounded-lg w-1/2"></div>
                <div className="h-10 bg-slate-200 rounded-lg w-1/2"></div>
            </div>
        </div>
    );
};

export default Browse;