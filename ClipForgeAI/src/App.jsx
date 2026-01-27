import React from 'react';
import Layout from './Layout';
import LandingPage from './pages/LandingPage';

function App() {
    return (
        <Layout currentPageName="Home">
            <LandingPage />
        </Layout>
    );
}

export default App;
