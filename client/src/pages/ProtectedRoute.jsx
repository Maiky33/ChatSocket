import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'
import { GridLoader } from 'react-spinners'

const ProtectedRoute = () => {

    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="ContainerLoader">
                <GridLoader color="#62d5c4ee" size={200}/>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;