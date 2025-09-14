import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { MoreHorizontal, Check, X, FileText, User, Users } from 'lucide-react';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';

// Custom Actions Dropdown to replace Popover
const ActionsDropdown = ({ application, onStatusUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const statusHandler = async (status) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${application._id}/update`, { status });
            if (res.data.success) {
                onStatusUpdate(application._id, status); // Notify parent to update state
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-slate-100">
                <MoreHorizontal size={20} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border z-10">
                    <div className="py-2">
                        <button onClick={() => statusHandler("Accepted")} className='w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-green-700 hover:bg-green-50'>
                            <Check className='w-4 h-4' />
                            <span>Accept</span>
                        </button>
                        <button onClick={() => statusHandler("Rejected")} className='w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50'>
                            <X className='w-4 h-4' />
                            <span>Reject</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Table Component
const ApplicantsTable = ({ applicants: initialApplicants }) => {
    const { singleJob } = useSelector(store => store.job);
    const dispatch = useDispatch();

    const handleStatusUpdate = (applicationId, newStatus) => {
        // Optimistically update the UI in the parent job object
        const updatedApplications = singleJob.applications.map(app => 
            app._id === applicationId ? { ...app, status: newStatus } : app
        );
        const updatedJob = { ...singleJob, applications: updatedApplications };
        dispatch(setSingleJob(updatedJob));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString("en-IN", options);
    };

    const applicants = initialApplicants || [];
    
    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white">
                <caption className="text-sm text-gray-500 p-4">
                    List of all candidates who applied for this job.
                </caption>
                <thead className="bg-slate-50 border-b border-slate-200 hidden md:table-header-group">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Applicant</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Applied On</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Resume</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="md:divide-y md:divide-gray-200">
                    {applicants.length > 0 ? (
                        applicants.map((item) => (
                            <tr key={item._id} className="block md:table-row mb-4 md:mb-0 rounded-lg md:rounded-none shadow-md md:shadow-none bg-white">
                                <td className="block md:table-cell px-6 py-4" data-label="Applicant">
                                    <ApplicantProfile applicant={item.applicant} />
                                </td>
                                <td className="block md:table-cell px-6 py-4 text-sm text-gray-600 text-right md:text-left" data-label="Contact">
                                    {item.applicant?.email}<br/>{item.applicant?.phoneNumber}
                                </td>
                                <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right md:text-left" data-label="Applied On">
                                    {formatDate(item.createdAt)}
                                </td>
                                <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right md:text-center" data-label="Resume">
                                    {item.applicant?.profile?.resume ? (
                                        <a href={item.applicant.profile.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-purple-600 hover:underline">
                                            <FileText size={16}/> View
                                        </a>
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </td>
                                <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-right" data-label="Actions">
                                    <ActionsDropdown application={item} onStatusUpdate={handleStatusUpdate} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-16">
                                <div className="flex flex-col items-center">
                                    <Users className="h-16 w-16 text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700">No Applicants Yet</h3>
                                    <p className="text-gray-500 mt-2">Check back later to see who has applied for this job.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Custom CSS for the mobile card labels */}
            <style jsx>{`
                @media (max-width: 767px) {
                    tbody tr {
                        border: 1px solid #e5e7eb;
                    }
                    td[data-label] {
                        padding-top: 1rem;
                        padding-bottom: 1rem;
                    }
                    td[data-label]::before {
                        content: attr(data-label);
                        float: left;
                        font-weight: 600;
                        color: #4b5563;
                    }
                }
            `}</style>
        </div>
    );
};

// Helper component for Applicant Profile with Avatar
const ApplicantProfile = ({ applicant }) => {
    const getInitials = (name = "") => name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 font-bold text-purple-600 flex-shrink-0">
                {applicant?.profile?.profilePhoto ? (
                    <img src={applicant.profile.profilePhoto} alt={applicant.fullname} className="w-full h-full object-cover rounded-full" />
                ) : (
                    <span>{getInitials(applicant?.fullname)}</span>
                )}
            </div>
            <div>
                <div className="font-semibold text-gray-900">{applicant?.fullname}</div>
                <div className="text-sm text-gray-500">{/* Can add a short bio here if available */}</div>
            </div>
        </div>
    );
};

export default ApplicantsTable;