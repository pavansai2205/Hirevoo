import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { setLoading } from '@/redux/applicationSlice'; // Assuming you have a loading action
import { Users, ChevronRight } from 'lucide-react';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    // Assuming a loading state is available in the application slice for skeletons
    const { applicants, loading } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            dispatch(setLoading(true)); // Start loading
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                // Assuming the API returns an object with an 'applicants' array
                dispatch(setAllApplicants(res.data.applicants));
            } catch (error) {
                console.log(error);
                dispatch(setAllApplicants([])); // Clear applicants on error
            } finally {
                dispatch(setLoading(false)); // Stop loading
            }
        };
        fetchAllApplicants();
    }, [params.id, dispatch]);

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <main className='max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8'>
                {/* Page Header with Breadcrumbs */}
                <div>
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link to="/admin/jobs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-purple-600">
                                    Admin
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                    <Link to="/admin/jobs" className="ml-1 text-sm font-medium text-gray-500 hover:text-purple-600 md:ml-2">Jobs</Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                    <span className="ml-1 text-sm font-semibold text-gray-800 md:ml-2">Applicants</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <div className="mt-4 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-bold leading-tight text-gray-900 flex items-center gap-3">
                                <Users />
                                Job Applicants
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {loading ? 'Fetching applicants...' : `Total Applicants: ${applicants?.length || 0}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Applicants Table Container */}
                <div className='mt-8 bg-white p-6 rounded-2xl shadow-lg'>
                    {
                        loading 
                            ? <ApplicantsTableSkeleton />
                            : <ApplicantsTable applicants={applicants} /> // Pass applicants as props
                    }
                </div>
            </main>
        </div>
    );
};

// A skeleton component for the table to enhance loading UX
const ApplicantsTableSkeleton = () => {
    return (
        <div className="w-full overflow-x-auto animate-pulse">
            <div className="min-w-full">
                <div className="bg-slate-50 hidden md:table-header-group">
                    <div className="flex px-6 py-3">
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4 ml-6"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4 ml-6"></div>
                    </div>
                </div>
                <div className="md:divide-y md:divide-gray-200">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="block md:flex mb-4 md:mb-0 rounded-lg md:rounded-none shadow-md md:shadow-none p-4 md:p-0 md:px-6 md:py-4">
                           <div className="flex items-center gap-4 w-full md:w-1/3">
                                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                                <div className="w-2/3 h-4 bg-slate-200 rounded"></div>
                           </div>
                           <div className="w-full md:w-1/3 mt-4 md:mt-0 h-4 bg-slate-200 rounded"></div>
                           <div className="w-full md:w-1/3 mt-4 md:mt-0 h-8 bg-slate-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Applicants;