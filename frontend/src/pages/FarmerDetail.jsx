import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { ShoppingCart, MapPin, Star, BadgeCheck, Phone, Mail, Calendar } from 'lucide-react';

export default function FarmerDetail() {
    const { id } = useParams();
    const [farmer, setFarmer] = useState(null);
    const [loading, setLoading] = useState(true);
    const { cart, addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/farmers/${id}/`)
            .then(res => res.json())
            .then(data => {
                setFarmer(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching farmer:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        </div>
    );

    if (!farmer) return (
        <div className="min-h-screen bg-white text-center py-20">
            <Navbar />
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                 <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Farmer Not Found</p>
                 <button onClick={() => navigate('/home')} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold">Go Back Home</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAF9] font-sans">
            <Navbar />

            {/* Premium Header */}
            <div className="bg-white border-b border-gray-100 pb-16">
                <div className="max-w-7xl mx-auto px-6 pt-12">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Profile Image */}
                        <div className="relative group">
                            <div className="w-48 h-48 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white relative z-10">
                                <img 
                                    src={farmer.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={farmer.name}
                                />
                            </div>
                            <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-6 -z-10 opacity-10 group-hover:rotate-12 transition-transform duration-500"></div>
                        </div>

                        {/* Farmer Info */}
                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">{farmer.farm_name || farmer.name}</h1>
                                    {farmer.is_verified && (
                                        <div className="bg-blue-50 p-1.5 rounded-xl border border-blue-100">
                                            <BadgeCheck size={28} className="text-blue-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2 text-blue-600"><MapPin size={16} /> {farmer.location}</span>
                                    <span className="flex items-center gap-2"><Star size={16} className="text-amber-400 fill-amber-400" /> {farmer.rating} Rating</span>
                                    <span className="flex items-center gap-2"><Calendar size={16} /> {farmer.seller_since_yrs}+ Years Exp.</span>
                                </div>
                            </div>

                            <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">
                                Dedicated to bringing the freshest, organic produce straight from our fields to your table. We pride ourselves on sustainable farming practices and quality that you can taste in every bite.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 flex items-center gap-3 active:scale-95">
                                    <Phone size={16} /> Contact Farmer
                                </button>
                                <button className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all flex items-center gap-3 active:scale-95">
                                    <Mail size={16} /> Direct Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Direct From Source</span>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tight">{farmer.farm_name || farmer.name}'s Products</h3>
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{farmer.products?.length || 0} Total Items</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {farmer.products?.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-white group rounded-[3rem] p-6 border border-gray-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-700 cursor-pointer flex flex-col h-full relative"
                            onClick={() => navigate('/product/' + item.id)}
                        >
                            {/* Product Image */}
                            <div className="relative aspect-square mb-6 rounded-[2.5rem] overflow-hidden bg-gray-50">
                                <img
                                    src={item.image_url || "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=400"}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    alt={item.name}
                                />
                                {item.is_organic && (
                                    <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-sm border border-white/50">
                                        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Organic</span>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col">
                                <h4 className="font-black text-gray-900 text-xl tracking-tight group-hover:text-blue-600 transition-colors mb-2">{item.name}</h4>
                                <div className="flex items-center gap-3 mb-6">
                                    <p className="text-2xl font-black text-gray-900 leading-none tracking-tighter">₹{item.price}</p>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter self-end mb-0.5">/ {item.weight}</span>
                                </div>

                                {/* Cart Actions */}
                                <div className="mt-auto grid grid-cols-1 gap-3" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                        onClick={() => addToCart(item, 1, item.weight)}
                                        className="flex items-center justify-center gap-3 bg-gray-900 text-white rounded-[1.5rem] py-4 hover:bg-blue-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-gray-200 active:scale-95 duration-300"
                                    >
                                        <ShoppingCart size={18} />
                                        Add To Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {(!farmer.products || farmer.products.length === 0) && (
                    <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100 px-10">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Star size={32} className="text-gray-200" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-400 tracking-tight mb-2">No Products Available Yet</h4>
                        <p className="text-sm text-gray-300 font-medium">This farmer hasn't listed any products for this week harvest. Check back soon!</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
