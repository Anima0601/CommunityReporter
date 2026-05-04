import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh]">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-10 w-full max-w-[440px]">
        <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-br from-brand-primary to-lime-500">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-600 mb-1.5">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-600 mb-1.5">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <button type="submit" className="w-full py-3.5 bg-brand-primary text-white rounded-full font-bold text-lg hover:bg-brand-hover transition-colors shadow-md hover:shadow-lg mt-2">
            Login
          </button>
        </form>
        <p className="text-center mt-6 text-slate-500 font-medium">
          Don't have an account? <Link to="/register" className="text-brand-primary hover:text-brand-hover font-bold transition-colors">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
