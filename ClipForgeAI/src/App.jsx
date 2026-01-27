import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter basename="/ClipForgeAI">
                <Routes>
                    <Route path="/" element={
                        <Layout currentPageName="Home">
                            <LandingPage />
                        </Layout>
                    } />
                    <Route path="/dashboard" element={
                        <Layout currentPageName="Dashboard">
                            <Dashboard />
                        </Layout>
                    } />
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
