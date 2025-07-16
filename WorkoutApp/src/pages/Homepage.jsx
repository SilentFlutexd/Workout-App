// src/pages/Homepage.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import './Homepage.css';

export default function HomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Use user's name if available, otherwise fallback to email
    const userName = user?.name || user?.email;

    return (
        <div className="homepage-container">
            <section className="hero-section">
                <h1>Welcome back, {userName}!</h1>
                <p>Ready to crush your goals? Let's get started.</p>
                <button 
                    className="cta-button"
                    onClick={() => navigate('/workouts')}
                >
                    Browse Workouts
                </button>
            </section>

            <section className="dashboard-section">
                <h2>Your Dashboard</h2>
                <div className="dashboard-grid">
                    <DashboardCard 
                        icon="🏋️"
                        title="Log a Workout"
                        text="Start tracking a new workout session."
                        link="/workouts/log" // Example link
                        linkText="Start Now"
                    />
                    <DashboardCard 
                        icon="📅"
                        title="View Routines"
                        text="Check your saved workout routines."
                        link="/routines" // Example link
                        linkText="Go to Routines"
                    />
                    <DashboardCard 
                        icon="📈"
                        title="Track Progress"
                        text="See your progress and personal records."
                        link="/account"
                        linkText="View Stats"
                    />
                </div>
            </section>
        </div>
    );
}