import React, { useState, useEffect } from 'react';
import './AccountPage.css'; // We will create this new CSS file

export default function AccountPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/logs', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch logs.');
                }
                
                const data = await response.json();
                setLogs(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className="account-container">
            <h1>Workout History</h1>

            {loading && <p>Loading history...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {!loading && !error && (
                <div className="logs-list">
                    {logs.length > 0 ? (
                        logs.map(log => (
                            <div key={log.id} className="log-item">
                                <div className="log-header">
                                    <span className="workout-name">{log.workout_name}</span>
                                    <span className="log-date">{log.date}</span>
                                </div>
                                <div className="log-details">
                                    <span>Sets: <strong>{log.sets || 'N/A'}</strong></span>
                                    <span>Reps: <strong>{log.reps || 'N/A'}</strong></span>
                                    <span>Weight: <strong>{log.weight ? `${log.weight} lbs` : 'N/A'}</strong></span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>You haven't logged any workouts yet. Go log one!</p>
                    )}
                </div>
            )}
        </div>
    );
}