import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { IsAuth, isAuthenticated } from '../../utils/TokenHelpers';

const ProtectedRoute = () => {


    return (
        <>
            <IsAuth />
        </>
    )

};

export default ProtectedRoute;
