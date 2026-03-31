import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const Home = () => {
    const [weather, setWeather] = useState(null);
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchWeather();
        fetchStats();
    }, []);

    const fetchWeather = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/weather/suggest`);
            setWeather(res.data);
        } catch (err) {
            console.error('Weather fetch error:', err);
        }
    };

    const fetchStats = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/items`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const items = res.data;
            const counts = items.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + 1;
                return acc;
            }, {});
            setStats({ total: items.length, categories: counts });
        } catch (err) {
            console.error('Stats fetch error:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="auth-container" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
            <div className="auth-card" style={{ maxWidth: '800px', width: '90%' }}>
                <div className="auth-header">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '10px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Hello, {user?.username || 'Trendsetter'}!
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Welcome back to your digital style sanctuary.</p>
                </div>

                {/* Weather Intelligence Card */}
                {weather && (
                    <div style={{ 
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', 
                        borderRadius: '24px', 
                        padding: '25px', 
                        border: '1px solid var(--glass-border)', 
                        marginBottom: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        animation: 'fadeIn 0.8s ease'
                    }}>
                        <div style={{ fontSize: '3rem' }}>⛅</div>
                        <div style={{ textAlign: 'left' }}>
                            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{weather.temperature}°C in {weather.location}</h3>
                            <p style={{ margin: '5px 0 0', color: 'var(--primary)', fontWeight: '500' }}>{weather.recommendation}</p>
                        </div>
                    </div>
                )}
                
                <div className="home-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '40px 0' }}>
                    <div className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Secure Profile</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your data is protected with industry-standard JWT encryption.</p>
                    </div>
                    <div className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ color: 'var(--secondary)', marginBottom: '10px' }}>Dynamic UI</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Enjoy a seamless experience with our glassmorphic design system.</p>
                    </div>
                    <div className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ color: '#10b981', marginBottom: '10px' }}>Cloud Sync</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your preferences are synced across all your devices instantly.</p>
                    </div>
                </div>

                {/* Style Analytics Dashboard */}
                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.total}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Items</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{Object.keys(stats.categories).length}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Categories</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats.categories['Tops'] || 0}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tops</div>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/wardrobe')} style={{ flex: '1 1 200px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
                        Go to Wardrobe
                    </button>
                    <button onClick={() => navigate('/lookbook')} style={{ flex: '1 1 200px', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                        Weekly Lookbook
                    </button>
                    <button onClick={() => navigate('/outfits')} style={{ flex: '1 1 200px', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        Outfit Builder
                    </button>
                    <button onClick={() => navigate('/dashboard')} style={{ flex: '1 1 200px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)' }}>
                        View Profile
                    </button>
                    <button onClick={handleLogout} style={{ flex: '1 1 200px', background: 'linear-gradient(135deg, #ef4444, #991b1b)' }}>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
