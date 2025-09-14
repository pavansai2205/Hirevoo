import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, IndianRupee } from 'lucide-react';

// Helper component for company logo with a fallback to initials
const CompanyLogo = ({ companyName, logoUrl }) => {
    const getInitials = (name = "") => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return (
        <div className="w-14 h-14 rounded-md flex items-center justify-center bg-slate-100 font-bold text-purple-600 flex-shrink-0">
            {logoUrl ? (
                <img src={logoUrl} alt={`${companyName} logo`} className="w-full h-full object-contain rounded-md" />
            ) : (
                <span>{getInitials(companyName)}</span>
            )}
        </div>
    );
};

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    // Truncate the description to a reasonable length
    const truncatedDescription = job?.description.length > 120 
        ? `${job.description.slice(0, 120)}...`
        : job.description;

    return (
        <div 
            onClick={() => navigate(`/description/${job._id}`)} 
            className='p-6 rounded-lg shadow-md bg-white border border-gray-100 cursor-pointer h-full flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
        >
            {/* Card Header */}
            <div className="flex items-start gap-4">
                <CompanyLogo companyName={job?.company?.name} logoUrl={job?.company?.logoUrl} />
                <div>
                    <h3 className='font-semibold text-gray-600'>{job?.company?.name}</h3>
                    <p className='text-xs text-gray-400'>{job?.location || 'India'}</p>
                </div>
            </div>

            {/* Card Body */}
            <div className='my-4 flex-grow'>
                <h2 className='font-bold text-xl text-gray-800'>{job?.title}</h2>
                <p className='text-sm text-gray-500 mt-2'>
                    {truncatedDescription}
                </p>
            </div>

            {/* Card Footer: Tags */}
            <div className='flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100'>
                <div className='flex items-center gap-2 text-xs font-medium bg-purple-100 text-purple-800 px-3 py-1 rounded-full'>
                    <Briefcase size={14} />
                    <span>{job?.jobType}</span>
                </div>
                <div className='flex items-center gap-2 text-xs font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full'>
                    <IndianRupee size={14} />
                    <span>{job?.salary} LPA</span>
                </div>
                <div className='flex items-center gap-2 text-xs font-medium bg-sky-100 text-sky-800 px-3 py-1 rounded-full'>
                    <MapPin size={14} />
                    <span>{job?.location}</span>
                </div>
            </div>
        </div>
    );
}

export default LatestJobCards;