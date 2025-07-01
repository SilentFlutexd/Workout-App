import { useState } from 'react';
import workouts from '../WorkoutList';
import './WorkoutsPage.css';

export default function WorkoutsPage() {
  const [areaFilter, setAreaFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredWorkouts = workouts.filter(workout => {
    const areaMatch = areaFilter ? workout.area.includes(areaFilter) : true;
    const typeMatch = typeFilter ? workout.type.includes(typeFilter) : true;
    return areaMatch && typeMatch;
  });

  return (
    <div>
      <h2 style={{ color: '#ff914d' }}>Workouts</h2>
  
      <div className='filter-controls'>
        <div>
          <label>Filter by Area:</label><br />
          <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)}>
            <option value="">All</option>
            <option value="arms">Arms</option>
            <option value="chest">Chest</option>
            <option value="legs">Legs</option>
            <option value="back">Back</option>
            <option value="core">Core</option>
          </select>
        </div>
  
        <div>
          <label>Filter by Type:</label><br />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All</option>
            <option value="push">Push</option>
            <option value="pull">Pull</option>
            <option value="compound">Compound</option>
            <option value="isometric">Isometric</option>
            <option value="cardio">Cardio</option>
          </select>
        </div>
      </div>
  
      <div className="workout-list">
        {filteredWorkouts.map(workout => (
          <div key={workout.id} className="workout-card">
            <h3>{workout.name}</h3>
            <p><strong>Area:</strong> {workout.area.join(', ')}</p>
            <p><strong>Type:</strong> {workout.type.join(', ')}</p>
            <p><strong>Equipment:</strong> {workout.equipment}</p>
            <p><strong>Difficulty:</strong> {workout.difficulty}</p>
            <p>{workout.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
  
}
