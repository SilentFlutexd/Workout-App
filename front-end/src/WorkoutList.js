// WorkoutList.js

const workouts = [
    {
      id: 1,
      name: 'Push Ups',
      area: ['chest', 'arms'],
      type: ['push', 'strength'],
      equipment: 'bodyweight',
      difficulty: 'beginner',
      stamina: false,
      tags: ['push', 'bodyweight', 'arms'],
      description: 'A basic upper body exercise targeting the chest, triceps, and shoulders.'
    },
    {
      id: 2,
      name: 'Squats',
      area: ['legs', 'glutes'],
      type: ['compound', 'strength'],
      equipment: 'bodyweight',
      difficulty: 'beginner',
      stamina: true,
      tags: ['legs', 'lower body', 'bodyweight'],
      description: 'A lower body exercise working the quads, hamstrings, and glutes.'
    },
    {
      id: 3,
      name: 'Pull Ups',
      area: ['back', 'arms'],
      type: ['pull', 'strength'],
      equipment: 'pull-up bar',
      difficulty: 'intermediate',
      stamina: false,
      tags: ['pull', 'bodyweight', 'back'],
      description: 'An upper body pulling exercise that works the lats and biceps.'
    },
    {
      id: 4,
      name: 'Plank',
      area: ['core'],
      type: ['isometric', 'stamina'],
      equipment: 'bodyweight',
      difficulty: 'beginner',
      stamina: true,
      tags: ['core', 'abs', 'isometric'],
      description: 'A core-strengthening exercise focusing on stability and endurance.'
    },
    {
      id: 5,
      name: 'Running',
      area: ['legs', 'full body'],
      type: ['cardio', 'stamina'],
      equipment: 'none',
      difficulty: 'varies',
      stamina: true,
      tags: ['cardio', 'legs', 'stamina'],
      description: 'A cardiovascular exercise improving endurance and calorie burn.'
    }
  ];
  
  export default workouts;
  