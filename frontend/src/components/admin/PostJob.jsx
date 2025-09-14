import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../shared/Navbar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Briefcase, ChevronRight, FilePlus } from 'lucide-react';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';

const PostJob = () => {
    useGetAllCompanies(); // Ensure companies are fetched
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "Full-Time", // Default value
        experience: "",
        position: 1,
        companyId: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector((store) => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name, value) => {
        if (name === 'companyId') {
            const selectedCompany = companies.find(c => c._id === value);
            setInput({ ...input, companyId: selectedCompany._id });
        } else {
            setInput({ ...input, [name]: value });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.companyId) {
            toast.error("Please select a company.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response.data.message);
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
                                <Link to="/admin/jobs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-purple-600">Admin</Link>
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
                                    <span className="ml-1 text-sm font-semibold text-gray-800 md:ml-2">Post New Job</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                     <div className="mt-4 md:flex md:items-center md:justify-between">
                         <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-bold leading-tight text-gray-900 flex items-center gap-3">
                                <FilePlus />
                                Post a New Job Opening
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Fill in the details below to publish a new job listing.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg">
                    {companies && companies.length === 0 ? (
                        <NoCompanyAlert />
                    ) : (
                        <form onSubmit={submitHandler}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <InputField label="Job Title" name="title" value={input.title} onChange={changeEventHandler} placeholder="e.g., Senior Software Engineer" required/>
                                <CustomSelect label="Company" name="companyId" value={input.companyId} onChange={handleSelectChange} options={companies.map(c => ({ value: c._id, label: c.name }))} placeholder="Select a Company" required/>
                                <InputField label="Location" name="location" value={input.location} onChange={changeEventHandler} placeholder="e.g., Mumbai, India" required/>
                                <CustomSelect label="Job Type" name="jobType" value={input.jobType} onChange={handleSelectChange} options={[{value: "Full-Time", label: "Full-Time"}, {value: "Part-Time", label: "Part-Time"}, {value:"Contract", label:"Contract"}, {value:"Internship", label:"Internship"}]}/>
                                <InputField label="Experience (in years)" name="experience" value={input.experience} onChange={changeEventHandler} placeholder="e.g., 5" type="number" required/>
                                <InputField label="Salary (LPA)" name="salary" value={input.salary} onChange={changeEventHandler} placeholder="e.g., 25" type="number" required/>
                                <InputField label="Open Positions" name="position" value={input.position} onChange={changeEventHandler} type="number" required/>
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea id="description" name="description" rows={4} value={input.description} onChange={changeEventHandler} className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="Detailed job description..." required></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Requirements</label>
                                    <textarea id="requirements" name="requirements" rows={4} value={input.requirements} onChange={changeEventHandler} className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="List key requirements, separated by commas..." required></textarea>
                                </div>
                            </div>
                            <div className='flex items-center justify-end gap-4 mt-8 pt-6 border-t'>
                                <button type="button" onClick={() => navigate("/admin/jobs")} className="px-6 py-2 text-sm font-medium border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="px-6 py-2 flex items-center justify-center text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : "Post New Job"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};


// Helper components for a cleaner form structure
const InputField = ({ label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            id={name}
            name={name}
            {...props}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        />
    </div>
);

const CustomSelect = ({ label, name, value, onChange, options, placeholder }) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className="mt-2 block w-full p-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            >
                <option value="" disabled>{placeholder || `Select ${label}`}</option>
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );
};

const NoCompanyAlert = () => (
    <div className="text-center py-10 px-6 bg-yellow-50 border-l-4 border-yellow-400">
        <Briefcase className="mx-auto h-12 w-12 text-yellow-400"/>
        <h3 className="mt-2 text-lg font-semibold text-yellow-800">No Companies Registered</h3>
        <p className="mt-1 text-sm text-yellow-700">
            You must register a company before you can post a job.
        </p>
        <div className="mt-4">
            <Link to="/admin/companies/create" className="inline-block px-6 py-2 text-sm font-medium rounded-lg text-white bg-yellow-500 hover:bg-yellow-600">
                Register a Company
            </Link>
        </div>
    </div>
);


export default PostJob;