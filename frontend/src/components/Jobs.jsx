import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job'; // Assuming Job is a styled card component like LatestJobCards
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SearchX } from 'lucide-react';

const Jobs = () => {
    const { allJobs, searchedQuery, loading } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        // Debouncing this in a real app would be a good performance enhancement
        let filtered = allJobs;
        if (searchedQuery) {
            const query = searchedQuery.toLowerCase();
            filtered = allJobs.filter((job) => 
                job.title.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query) ||
                job.location.toLowerCase().includes(query)
            );
        }
        setFilterJobs(filtered);
    }, [allJobs, searchedQuery]);

    // Animation variants for the container and items
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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
            <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
                {/* Page Header */}
                <div className="text-center mb-12">
                     <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Find Your <span className="text-purple-600">Dream Job</span>
                     </h1>
                     <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                        Browse through thousands of open positions across various industries in India.
                     </p>
                </div>
                
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-4">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 w-full justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Filter size={16}/>
                        {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                    {/* Filter Sidebar */}
                    <aside className={`${isFilterOpen ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
                        <FilterCard />
                    </aside>

                    {/* Job Listings */}
                    <main className='lg:col-span-3'>
                        {/* Results Header */}
                        <div className="pb-4 mb-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {loading ? 'Searching for jobs...' : `Showing ${filterJobs.length} jobs`}
                            </h2>
                        </div>
                        
                        <motion.div
                            key={searchedQuery} // Re-trigger animation on search
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        >
                            <AnimatePresence>
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
                                ) : filterJobs.length === 0 ? (
                                    <div className="md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center bg-white p-8 rounded-lg text-center h-64">
                                        <SearchX className="h-16 w-16 text-gray-300 mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-700">No Jobs Found</h3>
                                        <p className="text-gray-500 mt-2">Try adjusting your filters or search for a different keyword.</p>
                                    </div>
                                ) : (
                                    filterJobs.map((job) => (
                                        <motion.div variants={itemVariants} key={job._id}>
                                            <Job job={job} /> {/* Assuming Job is a well-styled component */}
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
};

// You can reuse the skeleton component from LatestJobs
const JobCardSkeleton = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-pulse h-full">
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

export default Jobs;