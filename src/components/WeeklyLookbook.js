import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const WeeklyLookbook = () => {
    const [items, setItems] = useState([]);
    const [plans, setPlans] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTop, setSelectedTop] = useState(null);
    const [selectedBottom, setSelectedBottom] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        try {
            const [itemsRes, plansRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/items`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/outfits/plan`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setItems(itemsRes.data);
            setPlans(plansRes.data);
            
            // Map current selected date's plan
            updateSelectionForDate(selectedDate, plansRes.data, itemsRes.data);
        } catch (err) {
            console.error('Fetch data error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateSelectionForDate = (date, allPlans, allItems) => {
        const plan = allPlans.find(p => p.plannedDate === date);
        if (plan) {
            setSelectedTop(plan.top);
            setSelectedBottom(plan.bottom);
        } else {
            setSelectedTop(null);
            setSelectedBottom(null);
        }
    };

    const handleSavePlan = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/outfits/plan`, {
                date: selectedDate,
                topId: selectedTop?.id || null,
                bottomId: selectedBottom?.id || null
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            alert('Outfit scheduled successfully!');
            fetchData();
        } catch (err) {
            alert('Failed to save plan.');
        }
    };

    const getDaysOfWeek = () => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    };

    const tops = items.filter(i => i.category === 'Tops');
    const bottoms = items.filter(i => i.category === 'Bottoms');

    return (
        <div className="auth-container" style={{ display: 'block', padding: '40px 20px', minHeight: '100vh', overflowY: 'auto' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Weekly Lookbook</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Schedule your style for the week ahead</p>
                    </div>
                    <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)' }}>Back Home</button>
                </div>

                {/* Day Selection Bar */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {getDaysOfWeek().map(date => (
                        <div 
                            key={date} 
                            onClick={() => {
                                setSelectedDate(date);
                                updateSelectionForDate(date, plans, items);
                            }}
                            style={{ 
                                padding: '15px 25px', 
                                background: selectedDate === date ? 'var(--primary)' : 'var(--card-bg)', 
                                borderRadius: '15px', 
                                cursor: 'pointer',
                                border: '1px solid var(--glass-border)',
                                minWidth: '120px',
                                textAlign: 'center',
                                transition: 'all 0.3s ease'
                            }}>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{new Date(date).getDate()}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '30px' }}>
                    
                    {/* Tops Selection */}
                    <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ marginBottom: '20px' }}>Tops</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px' }}>
                            {tops.map(t => (
                                <div key={t.id} onClick={() => setSelectedTop(t)} style={{ 
                                    borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                                    border: selectedTop?.id === t.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                                    opacity: selectedTop?.id === t.id ? 1 : 0.6
                                }}>
                                    <img src={t.imageUrl || t.image_url} alt={t.name} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottoms Selection */}
                    <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ marginBottom: '20px' }}>Bottoms</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px' }}>
                            {bottoms.map(b => (
                                <div key={b.id} onClick={() => setSelectedBottom(b)} style={{ 
                                    borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                                    border: selectedBottom?.id === b.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                                    opacity: selectedBottom?.id === b.id ? 1 : 0.6
                                }}>
                                    <img src={b.imageUrl || b.image_url} alt={b.name} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Day Preview */}
                    <div style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '32px', border: '1px solid var(--glass-border)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <h2 style={{ marginBottom: '5px' }}>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Your planned outfit</p>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '30px 0' }}>
                            {selectedTop ? <img src={selectedTop.imageUrl || selectedTop.image_url} style={{ height: '180px', objectFit: 'contain' }} /> : <div style={{ height: '180px', width: '120px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--glass-border)', borderRadius: '15px' }}></div>}
                            {selectedBottom ? <img src={selectedBottom.imageUrl || selectedBottom.image_url} style={{ height: '180px', objectFit: 'contain' }} /> : <div style={{ height: '180px', width: '120px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--glass-border)', borderRadius: '15px' }}></div>}
                        </div>

                        <button onClick={handleSavePlan} style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }}>Confirm Schedule</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WeeklyLookbook;
