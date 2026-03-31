import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get('http://localhost:5001/api/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (err) {
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return (
        <div className="auth-container">
            <h2 style={{ color: 'white' }}>Loading...</h2>
        </div>
    );

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '600px' }}>
                <div className="auth-header">
                    <h1>Dashboard</h1>
                    <p>Welcome back, {user?.username}!</p>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
                    <h3>Profile Information</h3>
                    <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>Email: {user?.email}</p>
                    <p style={{ color: 'var(--text-secondary)' }}>Account Status: Active</p>
                </div>

                <button onClick={handleLogout} style={{ width: '100%', background: 'linear-gradient(135deg, #ef4444, #991b1b)' }}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
