import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';
import { Building, ChevronRight, Loader2 } from 'lucide-react';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const registerNewCompany = async (e) => {
        e.preventDefault();
        if (!companyName.trim()) {
            toast.error("Company name cannot be empty.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

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
                                    <Link to="/admin/companies" className="ml-1 text-sm font-medium text-gray-500 hover:text-purple-600 md:ml-2">Companies</Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                    <span className="ml-1 text-sm font-semibold text-gray-800 md:ml-2">Create</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>

                {/* Form Card */}
                <div className="mt-8 max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                    <form onSubmit={registerNewCompany}>
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Register a New Company</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    What is the name of the company you want to post jobs for? You can edit details later.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                                    Company Name
                                </label>
                                <div className="relative mt-2">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="companyName"
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="e.g., Microsoft India"
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center justify-end gap-4 mt-8 pt-6 border-t'>
                            <button
                                type="button"
                                onClick={() => navigate("/admin/companies")}
                                className="px-6 py-2 text-sm font-medium border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 flex items-center justify-center text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</> : "Continue"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default CompanyCreate;