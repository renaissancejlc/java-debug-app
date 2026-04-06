// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Confirmation from './pages/Confirmation';
import Problems from './pages/Problems';
import Practice from './pages/Practice';



import { useLocation, Navigate } from 'react-router-dom';

function ProtectedConfirmation() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get('session_id');
  const orderHash = params.get('order');

  if (!sessionId && !orderHash) {
    return <Navigate to="/" replace />;
  }

  return <Confirmation />;
}

export default function App() {
  useEffect(() => {
    const cursor = document.querySelector('.cursor-circle');

    const moveCursor = (e) => {
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div className="cursor-circle" />
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
             <Route path="/problems" element={<Problems />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/practice" element={<Practice />} />

          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}