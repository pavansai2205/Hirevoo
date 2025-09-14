import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AdminJobsTable from './AdminJobsTable';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { setSearchJobByText } from '@/redux/jobSlice';
import { Search, Plus } from 'lucide-react';

const AdminJobs = () => {
    useGetAllAdminJobs();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // This will filter jobs in real-time as the admin types.
        // For better performance on large datasets, you might consider debouncing this.
        dispatch(setSearchJobByText(input));
    }, [input, dispatch]);

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <main className='max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8'>
                {/* Page Header & Actions */}
                <div className="md:flex md:items-center md:justify-between pb-6 border-b border-gray-200">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold leading-tight text-gray-900">
                            Manage Jobs
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Search, view, and manage all job postings.
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4 gap-4">
                        {/* Custom Search Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Filter by title, role..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                        </div>
                        {/* Custom "New Job" Button */}
                        <button 
                            onClick={() => navigate("/admin/jobs/create")}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] shadow-sm"
                        >
                            <Plus size={16} />
                            New Job
                        </button>
                    </div>
                </div>

                {/* Admin Jobs Table Container */}
                <div className='mt-8 bg-white p-6 rounded-2xl shadow-lg'>
                    <AdminJobsTable />
                </div>
            </main>
        </div>
    );
}

export default AdminJobs;