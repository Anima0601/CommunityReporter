import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 mt-8 animate-[fadeIn_0.4s_ease_forwards]">
        <Outlet />
      </main>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: 'var(--color-brand-surface)',
          color: 'var(--color-brand-text)',
          border: '1px solid var(--color-brand-border)',
        }
      }} />
    </>
  );
};

export default Layout;
