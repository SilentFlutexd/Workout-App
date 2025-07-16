import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LogWorkoutPage.css'; // Import the new CSS file

export default function LogWorkoutPage() {
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/workouts');
                const data = await response.json();
                setWorkouts(data);
                if (data.length > 0) {
                    setSelectedWorkout(data[0].id);
                }
            } catch (err) {
                setError('Failed to fetch workouts.');
            }
        };
        fetchWorkouts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    workout_id: parseInt(selectedWorkout),
                    sets: sets ? parseInt(sets) : null,
                    reps: reps ? parseInt(reps) : null,
                    weight: weight ? parseFloat(weight) : null
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Workout logged successfully!');
                navigate('/account');
            } else {
                setError(data.error || 'Failed to log workout.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="log-workout-container">
            <h2>Log Your Workout</h2>
            
            <form onSubmit={handleSubmit} className="log-form">
                {error && <div className="form-error">{error}</div>}
                
                <div className="form-group full-width">
                    <label htmlFor="workout-select">Workout:</label>
                    <select id="workout-select" value={selectedWorkout} onChange={(e) => setSelectedWorkout(e.target.value)} required>
                        {workouts.map((workout) => (
                            <option key={workout.id} value={workout.id}>
                                {workout.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="sets-input">Sets:</label>
                    <input id="sets-input" type="number" value={sets} onChange={(e) => setSets(e.target.value)} placeholder="e.g., 3" />
                </div>

                <div className="form-group">
                    <label htmlFor="reps-input">Reps:</label>
                    <input id="reps-input" type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="e.g., 10" />
                </div>
                
                <div className="form-group full-width">
                    <label htmlFor="weight-input">Weight (lbs):</label>
                    <input id="weight-input" type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 135.5" />
                </div>

                <button type="submit" className="full-width">Log Workout</button>
            </form>
        </div>
    );
}