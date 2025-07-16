# seed.py

from app import app, db, Workout

# This workout data is based on your initial WorkoutList.js file
workouts_data = [
    {
      'name': 'Push Ups', 'area': 'chest, arms', 'type': 'push, strength',
      'equipment': 'bodyweight', 'difficulty': 'beginner',
      'description': 'A basic upper body exercise targeting the chest, triceps, and shoulders.'
    },
    {
      'name': 'Squats', 'area': 'legs, glutes', 'type': 'compound, strength',
      'equipment': 'bodyweight', 'difficulty': 'beginner',
      'description': 'A lower body exercise working the quads, hamstrings, and glutes.'
    },
    {
      'name': 'Pull Ups', 'area': 'back, arms', 'type': 'pull, strength',
      'equipment': 'pull-up bar', 'difficulty': 'intermediate',
      'description': 'An upper body pulling exercise that works the lats and biceps.'
    },
    {
      'name': 'Plank', 'area': 'core', 'type': 'isometric, stamina',
      'equipment': 'bodyweight', 'difficulty': 'beginner',
      'description': 'A core-strengthening exercise focusing on stability and endurance.'
    },
    {
      'name': 'Running', 'area': 'legs, full body', 'type': 'cardio, stamina',
      'equipment': 'none', 'difficulty': 'varies',
      'description': 'A cardiovascular exercise improving endurance and calorie burn.'
    }
]

def seed_workouts():
    with app.app_context():
        # Check if workouts already exist to avoid duplicates
        if Workout.query.count() > 0:
            print("Workouts table is not empty. Skipping seed.")
            return

        print("Seeding workouts...")
        for workout_data in workouts_data:
            workout = Workout(**workout_data)
            db.session.add(workout)
        
        db.session.commit()
        print("Workouts seeded successfully!")

if __name__ == '__main__':
    seed_workouts()