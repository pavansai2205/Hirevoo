import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Briefcase, MapPin, IndianRupee } from 'lucide-react';

// Helper component for company logo with a fallback to initials
const CompanyLogo = ({ companyName, logoUrl }) => {
    const getInitials = (name = "") => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return (
        <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-slate-100 font-bold text-purple-600 text-2xl flex-shrink-0">
            {logoUrl ? (
                <img src={logoUrl} alt={`${companyName} logo`} className="w-full h-full object-contain rounded-md" />
            ) : (
                <span>{getInitials(companyName)}</span>
            )}
        </div>
    );
};

const Job = ({ job }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference === 0) return "Today";
        if (daysDifference === 1) return "Yesterday";
        return `${daysDifference} days ago`;
    };

    const truncatedDescription = job?.description.length > 120
        ? `${job.description.slice(0, 120)}...`
        : job.description;

    return (
        <div className='p-6 rounded-lg shadow-md bg-white border border-gray-100 h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
            {/* Card Header */}
            <div className='flex items-start justify-between mb-4'>
                <div className="flex items-center gap-4">
                    <CompanyLogo companyName={job?.company?.name} logoUrl={job?.company?.logo} />
                    <div>
                        <h3 className='font-bold text-lg text-gray-800'>{job?.company?.name}</h3>
                        <p className='text-sm text-gray-500'>{job?.location || 'India'}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsBookmarked(!isBookmarked)} 
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                    aria-label="Bookmark job"
                >
                    <Bookmark className={`h-6 w-6 transition-all ${isBookmarked ? 'fill-purple-600 text-purple-600' : ''}`} />
                </button>
            </div>

            {/* Card Body */}
            <div className='flex-grow mb-4'>
                <h2 className='font-bold text-xl text-gray-900'>{job?.title}</h2>
                <p className='text-sm text-gray-600 mt-2'>
                    {truncatedDescription}
                </p>
            </div>

            {/* Card Footer: Tags */}
            <div className='flex flex-wrap items-center gap-2 mb-4'>
                <div className='flex items-center gap-2 text-xs font-medium bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full'>
                    <Briefcase size={14} />
                    <span>{job?.jobType}</span>
                </div>
                <div className='flex items-center gap-2 text-xs font-medium bg-green-100 text-green-800 px-3 py-1.5 rounded-full'>
                    <IndianRupee size={14} />
                    <span>{job?.salary} LPA</span>
                </div>
                 <p className='text-xs text-gray-400 ml-auto pt-1'>
                    {daysAgoFunction(job?.createdAt)}
                </p>
            </div>

            {/* Card Actions */}
            <div className='mt-auto pt-4 border-t border-gray-100 flex items-center gap-4'>
                <button 
                    onClick={() => navigate(`/description/${job?._id}`)}
                    className="w-full text-center py-2 px-4 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]"
                >
                    Details
                </button>
                <button className="w-full text-center py-2 px-4 text-sm font-semibold border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Save
                </button>
            </div>
        </div>
    );
}

export default Job;