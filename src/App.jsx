import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StoreList from './components/StoreList';
import RateStore from './components/RateStore';
import StoreRatings from './components/StoreRatings';
import AddStore from './components/AddStore';
import Registration from './components/Registration';
import Login from './components/Login';
import { API_URL } from './API';
import './components/sparkcle.css';
function WelcomeBar({ user, totalHits, onLogout }) {
  return (
    <div className="welcome-bar">
      <div className="welcome-sparkles" aria-hidden="true">
        <span className="welcome-sparkle welcome-sparkle-1">✦</span>
        <span className="welcome-sparkle welcome-sparkle-2">✧</span>
        <span className="welcome-sparkle welcome-sparkle-3">✦</span>
        <span className="welcome-sparkle welcome-sparkle-4">✧</span>
        <span className="welcome-sparkle welcome-sparkle-5">✦</span>
        <span className="welcome-sparkle welcome-sparkle-6">✧</span>
      </div>
      <div className="container-fluid welcome-container">
        <div className="welcome-content">
          <div className="welcome-left">
            <span className="welcome-label">Welcome,</span>
            <strong className="welcome-user-name">{user?.name || 'User'}</strong>
            <span className="welcome-hand">👋</span>
            <span className="welcome-hits">
              <span className="welcome-hits-icon">✨</span>
              <span className="welcome-hits-label">Hits:</span>
              <strong className="welcome-hits-number">{totalHits}</strong>
            </span>
          </div>
          <button type="button" className="welcome-logout" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState('register');
  const [totalHits, setTotalHits] = useState(0);
  const [loadingUser, setLoadingUser] = useState(true);
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error reading user:', error);
      localStorage.removeItem('user');
    } finally {
      setLoadingUser(false);
    }
  }, []);
  const fetchTotalHits = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/hits`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        },
        cache: 'no-store'
      });
      if (!response.ok) {
        throw new Error(`Hits API error: ${response.status}`);
      }
      const data = await response.json();
      console.log('Hits API response:', data);
      if (typeof data.totalHits === 'number') {
        setTotalHits(data.totalHits);
      } else if (typeof data.hits === 'number') {
        setTotalHits(data.hits);
      }
    } catch (error) {
      console.error('Error fetching total hits:', error);
    }
  }, []);
  useEffect(() => {
    if (!user) {
      setTotalHits(0);
      return;
    }
    fetchTotalHits();
    const interval = setInterval(fetchTotalHits, 5000);
    return () => clearInterval(interval);
  }, [user, fetchTotalHits]);
  const handleRegistered = newUser => {
    console.log('Registration successful:', newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };
  const handleLoggedIn = loggedInUser => {
    console.log('Login successful:', loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setTotalHits(0);
    setAuthPage('login');
  };
  if (loadingUser) {
    return (
      <div className="app-loading">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <Router>
        {authPage === 'register' ? (
          <Registration onRegistered={handleRegistered} onShowLogin={() => setAuthPage('login')} />
        ) : (
          <Login onLoggedIn={handleLoggedIn} onShowRegistration={() => setAuthPage('register')} />
        )}
      </Router>
    );
  }
  return (
    <Router>
      <WelcomeBar user={user} totalHits={totalHits} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<StoreList />} />
        <Route path="/rate/:slug" element={<RateStore />} />
        <Route path="/ratings/:slug" element={<StoreRatings />} />
        <Route path="/add-store" element={<AddStore />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;