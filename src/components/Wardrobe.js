import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WardrobeCard from './WardrobeCard';
import '../Auth.css';

const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];
const seasons = ['Spring', 'Summer', 'Autumn', 'Winter', 'All-Season'];

const Wardrobe = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        category: 'Tops',
        color: '',
        season: 'All-Season',
        imageUrl: '/clothing/white_linen_shirt_1774864948718.png' // Default example
    });
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
 
    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.color?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/items`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(res.data);
        } catch (err) {
            console.error('Fetch items error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/items`, newItem, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            fetchItems();
            setNewItem({ name: '', category: 'Tops', color: '', season: 'All-Season', imageUrl: '/clothing/white_linen_shirt_1774864948718.png' });
        } catch (err) {
            alert('Failed to add item. Please try again.');
        }
    };

    const handleDeleteItem = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/items/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchItems();
        } catch (err) {
            alert('Failed to delete item.');
        }
    };

    return (
        <div className="auth-container" style={{ display: 'block', padding: '40px 20px', minHeight: '100vh', overflowY: 'auto' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>My Digital Closet</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Manage and organize your curated collection</p>
                    </div>
                    
                    <div style={{ flex: '1', minWidth: '300px', maxWidth: '500px' }}>
                        <input 
                            type="text" 
                            placeholder="Search by name, category, or color..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid var(--glass-border)',
                                padding: '12px 20px',
                                width: '100%'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)' }}>Back Home</button>
                        <button onClick={() => setShowModal(true)}>+ Add Item</button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', margin: '100px auto', fontSize: '1.2rem' }}>Curating closet...</div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                        gap: '30px' 
                    }}>
                        {filteredItems.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', background: 'var(--card-bg)', borderRadius: '24px', border: '1px dashed var(--glass-border)' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                                    {searchTerm ? `No items found matching "${searchTerm}"` : 'Your closet is empty. Start by adding your first piece!'}
                                </p>
                            </div>
                        ) : (
                            filteredItems.map(item => (
                                <WardrobeCard key={item.id} item={item} onDelete={handleDeleteItem} />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Modal for Adding Item */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="auth-card" style={{ maxWidth: '500px', width: '90%' }}>
                        <div className="auth-header">
                            <h2>Add New Clothing</h2>
                        </div>
                        <form className="auth-form" onSubmit={handleAddItem}>
                            <div className="auth-input-group">
                                <label>Item Name</label>
                                <input type="text" placeholder="e.g. Classic White Linen Shirt" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="auth-input-group">
                                    <label>Category</label>
                                    <select style={{ width: '100%', padding: '14px', background: 'rgba(15,23,42,0.4)', color: 'white', borderRadius: '12px', border: '1px solid var(--glass-border)' }} 
                                            value={newItem.category} onChange={(e) => {
                                                const catToImg = {
                                                    'Tops': '/clothing/white_linen_shirt_1774864948718.png',
                                                    'Bottoms': '/clothing/blue_denim_jeans_1774865074468.png',
                                                    'Outerwear': '/clothing/black_leather_jacket_1774865148439.png',
                                                    'Shoes': '/clothing/white_sneakers_1774865236449.png',
                                                    'Accessories': '/clothing/silver_watch_1774880720348.png',
                                                    'Dresses': '/clothing/grey_frock_1774880312727.png'
                                                };
                                                setNewItem({...newItem, category: e.target.value, imageUrl: catToImg[e.target.value] || ''});
                                            }}>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="auth-input-group">
                                    <label>Season</label>
                                    <select style={{ width: '100%', padding: '14px', background: 'rgba(15,23,42,0.4)', color: 'white', borderRadius: '12px', border: '1px solid var(--glass-border)' }}
                                            value={newItem.season} onChange={(e) => setNewItem({...newItem, season: e.target.value})}>
                                        {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="auth-input-group">
                                <label>Color</label>
                                <input type="text" placeholder="e.g. Ivory / Off-white" value={newItem.color} onChange={(e) => setNewItem({...newItem, color: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1 }}>Save Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wardrobe;
