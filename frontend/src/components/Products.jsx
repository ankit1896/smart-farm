import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Clock } from "lucide-react";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { cart, addToCart } = useCart();
    const navigate = useNavigate();

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

    // No longer filtering products to avoid confusion
    const displayedProducts = products;

    return (
        <div className="mt-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Fresh Harvest</span>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Fruits and Vegetables</h3>
                </div>
                <button className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">View All Products →</button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Loading Fresh Produce...</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayedProducts.map((item) => {
                        const isInCart = cart.some(cartItem => cartItem.id === item.id);
                        return (
                            <div
                                key={item.id}
                                className="bg-white group rounded-[2.5rem] p-5 border border-gray-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 cursor-pointer flex flex-col h-full"
                                onClick={() => navigate('/product/' + item.id)}
                            >
                                <div className="relative aspect-[4/3] mb-5 rounded-[2rem] overflow-hidden bg-gray-50">
                                    <img
                                        src={item.image_url || "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=400"}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={item.name}
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{item.category?.name || 'Fresh'}</span>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-black text-gray-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors">{item.name}</h4>
                                        <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-0.5 rounded-lg border border-green-100/50">Organic</span>
                                    </div>
                                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-4">₹{item.price} • {item.weight}</p>

                                    <div className="mt-auto grid grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => {
                                                if (!isInCart) addToCart(item, 1, item.weight);
                                                navigate('/checkout');
                                            }}
                                            className="flex items-center justify-center gap-2 border-2 border-gray-100 rounded-2xl py-3 hover:border-blue-100 hover:text-blue-600 transition-all font-black text-[9px] uppercase tracking-widest text-gray-400"
                                        >
                                            <Clock size={14} />
                                            Pre Order
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (!isInCart) addToCart(item, 1, item.weight);
                                                else navigate('/cart');
                                            }}
                                            className={`flex items-center justify-center gap-2 rounded-2xl py-3 transition-all font-black text-[9px] uppercase tracking-widest shadow-xl shadow-gray-200 ${isInCart ? 'bg-green-600 text-white shadow-green-100' : 'bg-gray-900 text-white'}`}
                                        >
                                            <ShoppingCart size={14} />
                                            {isInCart ? 'Added' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {displayedProducts.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                            <p className="text-gray-400 font-black text-[11px] uppercase tracking-[0.3em]">No products available right now.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}