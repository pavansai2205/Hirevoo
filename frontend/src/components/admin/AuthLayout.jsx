import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Building, Briefcase, LayoutDashboard, LogOut, Loader2 } from 'lucide-react';

const AuthLayout = () => {
    // We can also get the loading state for a better UX
    const { user, loading } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // This check runs once for all nested admin pages
        if (!loading && (user === null || user.role !== 'recruiter')) {
            toast.error("Access Denied. Please log in as a recruiter.");
            navigate("/login"); // Redirect to login is often better for admin panels
        }
    }, [user, loading, navigate]);

    // Show a full-page loader while checking auth status to prevent flicker
    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
            </div>
        );
    }

    // If authorized, render the shared admin layout
    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* The Outlet component renders the specific admin page we're on */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// A reusable Sidebar for the admin panel
const AdminSidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);

    const navLinks = [
        { href: "/admin/companies", label: "Companies", icon: <Building /> },
        { href: "/admin/jobs", label: "Jobs", icon: <Briefcase /> },
    ];

    const baseLinkStyle = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
    const activeLinkStyle = "bg-purple-100 text-purple-700 font-semibold";
    const inactiveLinkStyle = "text-gray-600 hover:bg-slate-100 hover:text-gray-900";

    return (
         <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
            <div className="h-16 flex items-center justify-center border-b">
                <Link to="/" className='text-2xl font-bold'>Admin<span className='text-purple-600'>Panel</span></Link>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navLinks.map(link => (
                    <Link 
                        key={link.href} 
                        to={link.href}
                        className={`${baseLinkStyle} ${isActive(link.href) ? activeLinkStyle : inactiveLinkStyle}`}
                    >
                        {React.cloneElement(link.icon, { size: 20 })}
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t">
                 <button className={`${baseLinkStyle} ${inactiveLinkStyle} w-full`}>
                    <LogOut size={20}/>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AuthLayout;