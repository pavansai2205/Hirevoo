import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <div 
            className="relative h-[70vh] flex flex-col items-center justify-center text-center text-white bg-cover bg-center" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop')" }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative z-10 p-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    Your Next Career Move Starts Here
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-200">
                    Discover thousands of job openings from top companies in India. We connect talent with opportunity.
                </p>

                {/* Search Bar */}
                <form className="mt-8 max-w-3xl w-full mx-auto bg-white rounded-full p-2 shadow-2xl flex items-center gap-2">
                    <div className="flex items-center flex-1 pl-4">
                        <Search className="h-6 w-6 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Job title, keyword, or company" 
                            className="w-full p-2 text-gray-800 bg-transparent focus:outline-none focus:ring-0"
                        />
                    </div>
                    <div className="hidden md:flex items-center flex-1 pl-4 border-l">
                         <MapPin className="h-6 w-6 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="City or remote" 
                            className="w-full p-2 text-gray-800 bg-transparent focus:outline-none focus:ring-0"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="px-6 py-3 text-base font-semibold rounded-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        Search
                    </button>
                </form>

                {/* Popular Searches */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <span className="text-slate-300 text-sm mr-2">Popular:</span>
                    <Link to="/jobs?q=Software" className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 rounded-full transition-colors">Software Engineer</Link>
                    <Link to="/jobs?q=Marketing" className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 rounded-full transition-colors">Marketing</Link>
                    <Link to="/jobs?q=Sales" className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 rounded-full transition-colors">Sales</Link>
                    <Link to="/jobs?q=Remote" className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 rounded-full transition-colors">Remote</Link>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;