import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiAlertTriangle, FiUser, FiLogOut, FiPlusCircle, FiShield } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="w-full flex justify-between items-center px-12 py-5 sticky top-0 z-50 border-b border-brand-border bg-white/95 backdrop-blur-md shadow-sm">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-brand-primary to-lime-500">
        <FiAlertTriangle className="text-brand-primary" /> EcoReport
      </Link>
      
      <div className="flex gap-10 items-center">
        <Link to="/" className="text-slate-500 hover:text-brand-text font-medium transition-colors">Home</Link>
        {user ? (
          <>
            <Link to="/create-report" className="flex items-center gap-2 text-slate-500 hover:text-brand-text font-medium transition-colors">
              <FiPlusCircle /> Report
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-2 text-slate-500 hover:text-brand-text font-medium transition-colors">
                <FiShield /> Admin
              </Link>
            )}
            <Link to="/profile" className="flex items-center gap-2 text-slate-500 hover:text-brand-text font-medium transition-colors">
              <FiUser /> {user.name}
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-full font-medium hover:bg-slate-50 hover:text-brand-text transition-colors flex items-center gap-2">
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-500 hover:text-brand-text font-medium transition-colors">Login</Link>
            <Link to="/register" className="px-6 py-2 bg-brand-primary text-white rounded-full font-semibold hover:bg-brand-hover transition-colors shadow-md hover:shadow-lg">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
