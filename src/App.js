import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Wardrobe from './components/Wardrobe';
import OutfitBuilder from './components/OutfitBuilder';
import WeeklyLookbook from './components/WeeklyLookbook';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={!!localStorage.getItem('token') ? <Home /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard" 
          element={!!localStorage.getItem('token') ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/wardrobe" 
          element={!!localStorage.getItem('token') ? <Wardrobe /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/outfits" 
          element={!!localStorage.getItem('token') ? <OutfitBuilder /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/lookbook" 
          element={!!localStorage.getItem('token') ? <WeeklyLookbook /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
