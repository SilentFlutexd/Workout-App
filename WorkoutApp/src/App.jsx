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
import SignupPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';

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
    path: '/signup',
    element: <SignupPage />
  }, {
    path: '/login',
    element: <LoginPage />
  }]
}]
  
const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App