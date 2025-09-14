import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Edit2, MoreHorizontal, Building } from 'lucide-react';

// Reusable Company Logo component
const CompanyLogo = ({ companyName, logoUrl }) => {
    const getInitials = (name = "") => name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
        <div className="w-10 h-10 rounded-md flex items-center justify-center bg-slate-100 font-bold text-purple-600 text-lg flex-shrink-0">
            {logoUrl ? (
                <img src={logoUrl} alt={`${companyName} logo`} className="w-full h-full object-contain rounded-md" />
            ) : (
                <span>{getInitials(companyName)}</span>
            )}
        </div>
    );
};

// Custom Actions Dropdown to replace Popover
const ActionsDropdown = ({ company, navigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

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
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border z-10">
                    <div className="py-2">
                        <button
                            onClick={() => {
                                navigate(`/admin/companies/${company._id}`);
                                setIsOpen(false);
                            }}
                            className='w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-slate-50'
                        >
                            <Edit2 className='w-4 h-4' />
                            <span>Edit</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies || []);
    const navigate = useNavigate();

    useEffect(() => {
        const filtered = (companies || []).filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filtered);
    }, [companies, searchCompanyByText]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString("en-IN", options);
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white">
                <caption className="text-sm text-gray-500 p-4">
                    A list of all registered companies.
                </caption>
                <thead className="bg-slate-50 border-b border-slate-200 hidden md:table-header-group">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Company</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date Registered</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="md:divide-y md:divide-gray-200">
                    {filterCompany.length > 0 ? (
                        filterCompany.map((company) => (
                            <tr key={company._id} className="block md:table-row mb-4 md:mb-0 rounded-lg md:rounded-none shadow-md md:shadow-none bg-white">
                                <td className="block md:table-cell px-6 py-4" data-label="Company">
                                    <div className="flex items-center gap-4">
                                        <CompanyLogo companyName={company.name} logoUrl={company.logo} />
                                        <span className="font-semibold text-gray-900">{company.name}</span>
                                    </div>
                                </td>
                                <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right md:text-left" data-label="Date Registered">
                                    {formatDate(company.createdAt)}
                                </td>
                                <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right" data-label="Actions">
                                    <ActionsDropdown company={company} navigate={navigate} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        // Empty State Row
                        <tr>
                            <td colSpan="3" className="text-center py-16">
                                <div className="flex flex-col items-center">
                                    <Building className="h-16 w-16 text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700">No Companies Found</h3>
                                    <p className="text-gray-500 mt-2">No companies match your current filter. Try a different search.</p>
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
                        border: 1px solid #e5e7eb; /* border-gray-200 */
                    }
                    td[data-label] {
                        padding-top: 1rem;
                        padding-bottom: 1rem;
                    }
                    td[data-label]::before {
                        content: attr(data-label);
                        float: left;
                        font-weight: 600; /* font-semibold */
                        color: #4b5563; /* text-gray-600 */
                    }
                }
            `}</style>
        </div>
    );
};

export default CompaniesTable;