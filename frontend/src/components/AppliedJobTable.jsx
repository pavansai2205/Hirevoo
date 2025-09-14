import React from 'react';
import { useSelector } from 'react-redux';
import { Briefcase } from 'lucide-react';

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString("en-IN", options);
    };

    // Helper component for the status pill
    const StatusBadge = ({ status }) => {
        const baseStyle = "px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-2";
        const statusStyles = {
            pending: "bg-yellow-100 text-yellow-800",
            accepted: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        const dotStyles = {
            pending: "bg-yellow-500",
            accepted: "bg-green-500",
            rejected: "bg-red-500",
        };
        const currentStatus = status.toLowerCase();

        return (
            <span className={`${baseStyle} ${statusStyles[currentStatus]}`}>
                <span className={`h-2 w-2 rounded-full ${dotStyles[currentStatus]}`}></span>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white">
                <caption className="text-sm text-gray-500 p-4">
                    A list of your recent job applications.
                </caption>
                <thead className="bg-slate-50 border-b border-slate-200 hidden md:table-header-group">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date Applied</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Job Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Company</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 md:divide-y-0">
                    {allAppliedJobs && allAppliedJobs.length > 0 ? (
                        allAppliedJobs.map((appliedJob) => (
                            <tr key={appliedJob._id} className="block md:table-row mb-4 md:mb-0 rounded-lg md:rounded-none shadow md:shadow-none bg-white">
                                <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-800 md:border-b border-gray-200 text-right md:text-left" data-label="Date Applied">
                                    {formatDate(appliedJob?.createdAt)}
                                </td>
                                <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 md:border-b border-gray-200 text-right md:text-left" data-label="Job Role">
                                    {appliedJob.job?.title}
                                </td>
                                <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 md:border-b border-gray-200 text-right md:text-left" data-label="Company">
                                    {appliedJob.job?.company?.name}
                                </td>
                                <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 md:border-b border-gray-200 text-right md:text-left" data-label="Status">
                                    <StatusBadge status={appliedJob.status} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        // Empty State Row
                        <tr>
                            <td colSpan="4" className="text-center py-16">
                                <div className="flex flex-col items-center">
                                    <Briefcase className="h-16 w-16 text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700">No Applications Yet</h3>
                                    <p className="text-gray-500 mt-2">You haven't applied for any jobs. Start exploring now!</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Custom CSS for the mobile card labels */}
            <style jsx>{`
                @media (max-width: 767px) {
                    td[data-label]::before {
                        content: attr(data-label);
                        float: left;
                        font-weight: bold;
                        color: #374151; /* text-gray-700 */
                    }
                }
            `}</style>
        </div>
    );
};

export default AppliedJobTable;