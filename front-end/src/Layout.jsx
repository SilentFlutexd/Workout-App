import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
export default function Layout() {
  return (
    <>
      <NavBar />
      <div className="page-container">
        <Outlet />
      </div>
    </>
  );
}