import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';

export default function NavBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">WorkoutApp</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/workouts">Workouts</Link></li>
        
        {isAuthenticated() ? (
          // Show when logged in
          <>
            <li>
              <span style={{ color: '#ff914d', marginRight: '1rem' }}>
                Welcome, {user?.email}
              </span>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid #ff914d',
                  color: '#ff914d',
                  padding: '0.4em 0.8em',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          // Show when not logged in
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}