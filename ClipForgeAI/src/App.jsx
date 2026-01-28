import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';

// Component to handle password reset detection
function AuthHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check for password reset hash
        if (window.location.hash && window.location.hash.includes('type=recovery')) {
            // The supabase client will handle the session
            // We just need to show the new password modal
            // This is handled in the LandingPage component
        }

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                // User clicked password reset link
                // Navigate to home with state to show new password modal
                navigate('/', { state: { showNewPassword: true } });
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    return null;
}

// Protected route wrapper
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return user ? children : null;
}

function AppRoutes() {
    return (
        <>
            <AuthHandler />
            <Routes>
                <Route path="/" element={
                    <Layout currentPageName="Home">
                        <LandingPage />
                    </Layout>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout currentPageName="Dashboard">
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
}

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter basename="/ClipForgeAI">
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
