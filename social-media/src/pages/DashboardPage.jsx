import React, { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { IsAuth, isAuthenticated } from '../utils/TokenHelpers';


const DashboardPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        console.log('Current path:', location.pathname);
        if (isAuthenticated()) {
            console.log('User is authenticated');
        } else {
            console.log('User is not authenticated');
            navigate('/login');
        }
        // You can perform additional actions based on the new location

    }, [location]);
    return (
        <div>
            Dashboard Page
            <Link to={"/dashboard/about"} >About</Link>
            <Link to={"/dashboard"} >Dashboard</Link>
            <Outlet />
        </div>
    )
}

export default DashboardPage
