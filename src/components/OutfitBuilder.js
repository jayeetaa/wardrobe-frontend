import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const OutfitBuilder = () => {
    const [items, setItems] = useState([]);
    const [selectedTop, setSelectedTop] = useState(null);
    const [selectedBottom, setSelectedBottom] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        try {
            const res = await axios.get('http://localhost:5001/api/items', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(res.data);
        } catch (err) {
            console.error('Fetch items error:', err);
        } finally {
            setLoading(false);
        }
    };

    const tops = items.filter(i => i.category === 'Tops');
    const bottoms = items.filter(i => i.category === 'Bottoms');

    return (
        <div className="auth-container" style={{ display: 'block', padding: '40px 20px', minHeight: '100vh', overflowY: 'auto' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Outfit Builder</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Pair your favorites to visualize your next look</p>
                    </div>
                    <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)' }}>Back Home</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '40px' }}>
                    
                    {/* Selection Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        
                        <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                            <h3 style={{ marginBottom: '15px' }}>Choose a Top</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                                {tops.map(t => (
                                    <div key={t.id} onClick={() => setSelectedTop(t)} style={{ 
                                        borderRadius: '10px', 
                                        overflow: 'hidden', 
                                        cursor: 'pointer', 
                                        border: selectedTop?.id === t.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                                        opacity: selectedTop?.id === t.id ? 1 : 0.7
                                    }}>
                                        <img src={t.imageUrl || t.image_url} alt={t.name} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                            <h3 style={{ marginBottom: '15px' }}>Choose a Bottom</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                                {bottoms.map(b => (
                                    <div key={b.id} onClick={() => setSelectedBottom(b)} style={{ 
                                        borderRadius: '10px', 
                                        overflow: 'hidden', 
                                        cursor: 'pointer', 
                                        border: selectedBottom?.id === b.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                                        opacity: selectedBottom?.id === b.id ? 1 : 0.7
                                    }}>
                                        <img src={b.imageUrl || b.image_url} alt={b.name} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Preview Panel */}
                    <div style={{ 
                        background: 'var(--card-bg)', 
                        borderRadius: '24px', 
                        border: '1px solid var(--glass-border)', 
                        height: '700px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '20px',
                        padding: '40px',
                        position: 'relative'
                    }}>
                        {!selectedTop && !selectedBottom && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Select pieces from the left to start building</p>
                        )}
                        
                        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                            {selectedTop ? (
                                <img src={selectedTop.imageUrl || selectedTop.image_url} alt="Selected Top" style={{ height: '320px', objectFit: 'contain', animation: 'fadeIn 0.5s ease' }} />
                            ) : (
                                <div style={{ height: '320px', width: '240px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px dashed var(--glass-border)' }}></div>
                            )}
                            
                            {selectedBottom ? (
                                <img src={selectedBottom.imageUrl || selectedBottom.image_url} alt="Selected Bottom" style={{ height: '320px', objectFit: 'contain', animation: 'fadeIn 0.5s ease' }} />
                            ) : (
                                <div style={{ height: '320px', width: '240px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px dashed var(--glass-border)' }}></div>
                            )}
                        </div>

                        {selectedTop && selectedBottom && (
                            <div style={{ position: 'absolute', bottom: '30px', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>Fresh Combination</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>Looking sharp!</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OutfitBuilder;
