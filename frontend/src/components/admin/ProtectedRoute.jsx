import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // Check runs whenever the user object changes.
        if (user === null || user.role !== 'recruiter') {
            toast.error("Access Denied. You must be a recruiter to view this page.");
            navigate("/");
        }
    }, [user, navigate]); // Added dependencies

    // Only render children if the user is a recruiter
    if (user && user.role === 'recruiter') {
        return children;
    }
    
    // Render nothing (or a loading spinner) while redirecting
    return null; 
};

export default ProtectedRoute;