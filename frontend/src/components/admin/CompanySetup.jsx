import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById';
import { ArrowLeft, Loader2, Building, Globe, MapPin, Text, ImageUp, ChevronRight } from 'lucide-react';

const CompanySetup = () => {
    const params = useParams();
    // Custom hook to fetch company data and handle initial loading
    const { singleCompany, loading: initialLoading } = useGetCompanyById(params.id);

    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const [logoPreview, setLogoPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file });
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }

        setLoading(true);
        try {
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: null
            });
            setLogoPreview(singleCompany.logo || "");
        }
    }, [singleCompany]);
    
    if (initialLoading) {
        return <CompanySetupSkeleton />;
    }

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
                                    <Link to="/admin/companies" className="ml-1 text-sm font-medium text-gray-500 hover:text-purple-600 md:ml-2">Companies</Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                    <span className="ml-1 text-sm font-semibold text-gray-800 md:ml-2">Edit Company</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <div className="mt-4 md:flex md:items-center md:justify-between">
                         <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-bold leading-tight text-gray-900 flex items-center gap-3">
                                Company Setup
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Update the details for <span className="font-semibold text-purple-600">{singleCompany?.name}</span>.
                            </p>
                        </div>
                         <button onClick={() => navigate("/admin/companies")} className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <ArrowLeft size={16} />
                            Back to Companies
                        </button>
                    </div>
                </div>

                {/* Form Card */}
                <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg">
                    <form onSubmit={submitHandler}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Logo Upload & Preview */}
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                                <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo Preview" className="mx-auto h-24 w-24 object-contain" />
                                        ) : (
                                            <ImageUp className="mx-auto h-12 w-12 text-gray-400" />
                                        )}
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file" type="file" className="sr-only" onChange={changeFileHandler} accept="image/*" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Input Fields */}
                            <div className="md:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <InputField label="Company Name" name="name" value={input.name} onChange={changeEventHandler} icon={<Building />} />
                                <InputField label="Website" name="website" value={input.website} onChange={changeEventHandler} icon={<Globe />} placeholder="https://example.com" />
                                <InputField label="Location" name="location" value={input.location} onChange={changeEventHandler} icon={<MapPin />} placeholder="e.g., Mumbai, India"/>
                                <div className="sm:col-span-2">
                                     <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                      <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        placeholder="Brief description about the company."
                                      ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className='flex items-center justify-end gap-4 mt-8 pt-6 border-t'>
                             <button type="button" onClick={() => navigate("/admin/companies")} className="px-6 py-2 text-sm font-medium border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-6 py-2 flex items-center justify-center text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Update Company"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

// Helper component for input fields
const InputField = ({ label, name, icon, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="relative mt-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {React.cloneElement(icon, { className: 'h-5 w-5 text-gray-400' })}
            </div>
            <input
                id={name}
                name={name}
                type="text"
                {...props}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
        </div>
    </div>
);

// Skeleton loader for the page
const CompanySetupSkeleton = () => (
    <div className="bg-slate-50 min-h-screen">
        <Navbar />
        <main className='max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-pulse'>
             <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
             <div className="h-10 bg-slate-200 rounded w-1/2 mb-8"></div>
             <div className="bg-white p-8 rounded-2xl shadow-lg">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 h-48 bg-slate-200 rounded-lg"></div>
                    <div className="md:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="h-14 bg-slate-200 rounded-lg"></div>
                        <div className="h-14 bg-slate-200 rounded-lg"></div>
                        <div className="h-14 bg-slate-200 rounded-lg"></div>
                        <div className="sm:col-span-2 h-24 bg-slate-200 rounded-lg"></div>
                    </div>
                 </div>
                 <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                    <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
                    <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
                 </div>
             </div>
        </main>
    </div>
);

export default CompanySetup;