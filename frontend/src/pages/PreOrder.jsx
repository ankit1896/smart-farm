import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowRight, ShoppingCart, Star, Clock, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function PreOrder() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products/")
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            {/* Premium Green Header */}
            <div className="bg-[#2ecc71] h-[180px] md:h-[220px] flex flex-col items-center justify-center text-white px-6 text-center">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 uppercase">PRE ORDER</h1>
                <p className="text-sm md:text-lg font-medium opacity-90 max-w-lg leading-relaxed">
                    Reserve the freshest harvest before anyone else. Straight from the soil to your table.
                </p>
                <div className="mt-6 flex gap-2">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/30 flex items-center gap-1.5">
                        <Clock size={12} /> Next Harvest: Tomorrow
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div className="relative w-full md:w-[400px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find products to reserve..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#2ecc71] focus:outline-none shadow-sm transition-all text-sm font-medium"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-white text-gray-600 px-6 py-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition shadow-sm font-semibold text-sm">
                        <Filter size={18} /> All Categories
                    </button>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <p className="text-gray-400 animate-pulse font-bold">Loading harvest...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {products.map((item, i) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/product/${item.id}`)}
                                className="group bg-white rounded-[24px] overflow-hidden border border-gray-50 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-500 cursor-pointer flex flex-col"
                            >
                                <div className="relative h-44 md:h-56 overflow-hidden">
                                    <img
                                        src={item.image_url || "https://via.placeholder.com/400"}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={item.name}
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-green-600 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm border border-green-50 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> HIGH DEMAND
                                    </div>
                                    {item.is_organic && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                                            ORGANIC
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 md:p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-800 text-[15px] md:text-lg group-hover:text-green-600 transition-colors">{item.name}</h3>
                                        <div className="flex items-center gap-0.5 text-yellow-400">
                                            <Star size={14} fill="currentColor" /> <span className="text-xs font-bold text-gray-700 ml-1">{item.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-xs md:text-sm mb-4 font-medium">{item.weight} • Harvested in {item.farmer?.location || 'Sass Valley'}</p>

                                    <div className="mt-auto pt-4 flex flex-col gap-3">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl md:text-2xl font-black text-gray-900">₹{item.discount_price || item.price}</span>
                                            {item.discount_price && (
                                                <span className="text-xs md:text-sm text-gray-400 line-through font-medium">₹{item.price}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                addToCart(item, 1);
                                                navigate('/checkout'); 
                                            }}
                                            className="w-full bg-[#1a73e8] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group/btn"
                                        >
                                            RESERVE NOW <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recently Viewed */}
                <div className="mt-24 border-t border-gray-100 pt-16">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">RECENTLY VIEWED</h2>
                        <button className="text-[#1a73e8] font-bold text-sm hover:underline">View History</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-gray-50 shadow-sm hover:shadow-md transition">
                                <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80" className="w-16 h-16 rounded-xl object-cover" alt="Tomato" />
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">Fresh Red Tomato</h4>
                                    <p className="text-[#1a73e8] font-bold text-sm">₹45 / Kg</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
