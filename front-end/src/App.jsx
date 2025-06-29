import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import './App.css'
import HomePage from './pages/Homepage'
import NotFoundPage from './pages/NotFoundPage';
import Layout from './Layout';
import AboutPage from './pages/AboutPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutTypePage from './pages/WorkoutTypePage';

const routes = [{
  path: '/',
  element: <Layout />,
  errorElement: <NotFoundPage />,
  children: [{
    path: '/',
    element: <HomePage />
  },{
    path: '/about',
    element: <AboutPage />
  },{
    path: '/workouts',
    element: <WorkoutsPage />
  }, {
    path: '/workouts/:type',
    element: <WorkoutTypePage />
  }]
}]

const router = createBrowserRouter(routes);

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App
