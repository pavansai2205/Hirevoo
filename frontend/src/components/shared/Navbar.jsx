import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { LogOut, User2, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    };
    
    // Define navigation links for better readability
    const navLinks = (
        <>
            {user?.role === 'recruiter' ? (
                <>
                    <NavLink to="/admin/companies" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}`}>Companies</NavLink>
                    <NavLink to="/admin/jobs" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}`}>Jobs</NavLink>
                </>
            ) : (
                <>
                    <NavLink to="/" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}`}>Home</NavLink>
                    <NavLink to="/jobs" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}`}>Jobs</NavLink>
                    <NavLink to="/browse" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}`}>Browse</NavLink>
                </>
            )}
        </>
    );

    return (
        <nav className='bg-white border-b border-gray-200 sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8'>
                {/* Logo */}
                <div className='flex-shrink-0'>
                    <Link to="/" className='text-2xl font-bold'>
                        Hire<span className='text-purple-600'>Voo</span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className='hidden md:flex items-center space-x-8'>
                    <div className='flex items-baseline space-x-4'>
                        {navLinks}
                    </div>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login" className="px-4 py-2 text-sm font-medium border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 hover:text-purple-700 transition-colors">Login</Link>
                                <Link to="/signup" className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">Signup</Link>
                            </div>
                        ) : (
                            <UserProfileDropdown user={user} logoutHandler={logoutHandler} />
                        )
                    }
                </div>

                {/* Mobile Menu Button & User Profile */}
                <div className='md:hidden flex items-center'>
                    {user && <div className='mr-4'><UserProfileDropdown user={user} logoutHandler={logoutHandler} /></div>}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500'>
                        <span className='sr-only'>Open main menu</span>
                        {isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isMenuOpen && (
                <div className='md:hidden border-t border-gray-200'>
                    <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                        {navLinks}
                    </div>
                    {!user && (
                         <div className='px-4 pb-3 flex items-center gap-2 border-t border-gray-100 pt-4'>
                             <Link to="/login" className='w-full text-center px-4 py-2 text-sm font-medium border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 hover:text-purple-700 transition-colors'>Login</Link>
                             <Link to="/signup" className='w-full text-center px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'>Signup</Link>
                         </div>
                    )}
                </div>
            )}
        </nav>
    );
}

// Custom Avatar component with fallback
const CustomAvatar = ({ src, fullName }) => {
    const [imageError, setImageError] = useState(false);

    const getInitials = (name = "") => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return (
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-purple-100 text-purple-700 font-semibold overflow-hidden">
            {src && !imageError ? (
                <img 
                    src={src} 
                    alt={fullName}
                    onError={() => setImageError(true)} 
                    className="h-full w-full object-cover"
                />
            ) : (
                <span>{getInitials(fullName)}</span>
            )}
        </div>
    );
};


// Custom Dropdown component to replace Popover
const UserProfileDropdown = ({ user, logoutHandler }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-full">
                <CustomAvatar src={user?.profile?.profilePhoto} fullName={user?.fullname} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-10 p-4">
                    <div className='flex items-center gap-4'>
                        <div className="h-12 w-12">
                            <CustomAvatar src={user?.profile?.profilePhoto} fullName={user?.fullname} />
                        </div>
                        <div>
                            <h4 className='font-semibold text-gray-800'>{user?.fullname}</h4>
                            <p className='text-sm text-gray-500 truncate'>{user?.email}</p>
                        </div>
                    </div>
                    
                    <hr className="my-4 border-gray-200" />
                    
                    <div className='flex flex-col gap-2'>
                        {user?.role === 'student' && (
                            <Link to="/profile" onClick={() => setIsOpen(false)} className='flex items-center gap-3 p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'>
                                <User2 className='h-5 w-5' />
                                <span>View Profile</span>
                            </Link>
                        )}
                        <button onClick={logoutHandler} className='flex items-center gap-3 p-2 rounded-md text-red-500 hover:bg-red-50 transition-colors w-full text-left'>
                            <LogOut className='h-5 w-5' />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Navbar;