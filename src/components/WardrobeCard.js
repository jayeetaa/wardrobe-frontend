import React from 'react';
import '../Auth.css';

const WardrobeCard = ({ item, onDelete }) => {
    return (
        <div className="wardrobe-card" style={{
            background: 'var(--card-bg)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '20px',
            overflow: 'hidden',
            transition: 'var(--transition)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.5s ease'
        }}>
            <div style={{ width: '100%', height: '240px', overflow: 'hidden', position: 'relative' }}>
                <img 
                    src={item.imageUrl || item.image_url || 'https://via.placeholder.com/300?text=No+Image'} 
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    background: 'rgba(0,0,0,0.5)', 
                    color: 'white', 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem' 
                }}>
                    {item.category}
                </div>
            </div>
            
            <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.name}</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.color}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>•</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.season}</span>
                </div>
                
                <button 
                    onClick={() => onDelete(item.id)}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        fontSize: '0.9rem',
                        background: 'rgba(239, 68, 68, 0.1)', 
                        color: '#ef4444', 
                        border: '1px solid rgba(239, 68, 68, 0.2)' 
                    }}
                >
                    Remove Item
                </button>
            </div>
        </div>
    );
};

export default WardrobeCard;
