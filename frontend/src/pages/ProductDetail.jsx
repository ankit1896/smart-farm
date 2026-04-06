import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
    const { id } = useParams();
    const { cart, addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weight, setWeight] = useState('1 Kg');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Description');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/products/${id}/`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
    }, [id]);

    const isInCart = cart.some(item => item.id === product?.id);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500 font-medium animate-pulse">Loading product details...</p>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-500 font-bold">Product not found.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-6 md:py-10 font-sans">
                {/* Header that only appears on mobile but let's hide here and show inside layout */}
                <h1 className="text-3xl font-bold mb-6 text-gray-800 hidden md:block">{product.name}</h1>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Left: Image Gallery */}
                    <div className="flex flex-col-reverse md:flex-row gap-4 lg:w-1/3">
                        <div className="flex md:flex-col gap-3 justify-center md:justify-start">
                            <img src={product.image_url} className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover ring-2 ring-green-600 shadow-sm cursor-pointer" alt="Thumbnail 1" />
                        </div>
                        <div className="w-full">
                            <img src={product.image_url} className="w-full h-[300px] md:h-[400px] rounded-2xl object-cover shadow-sm border border-gray-100" alt={product.name} />
                        </div>
                    </div>

                    {/* Middle: Product Info */}
                    <div className="lg:w-1/3 space-y-5">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 md:hidden">{product.name}</h2>

                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-gray-800">₹ {product.discount_price || product.price}</span>
                            {product.discount_price && (
                                <>
                                    <span className="text-sm text-gray-400 line-through">₹ {product.price}</span>
                                    <span className="text-sm text-green-600 font-semibold">({Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF)</span>
                                </>
                            )}
                        </div>

                        <div className="flex items-center text-yellow-500 text-sm gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} size={16} fill={star <= product.rating ? "currentColor" : "none"} className={star <= product.rating ? "" : "text-gray-300"} strokeWidth={1} />
                            ))}
                            <span className="text-gray-500 text-xs ml-2 font-medium">120+ Customer Review</span>
                        </div>

                        <p className="text-[13px] md:text-sm text-gray-600 leading-relaxed pt-2">
                            {product.is_organic && <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold mr-2 uppercase">Organic</span>}
                            Grown with care by our farmers. Perfect for your healthy kitchen!
                        </p>

                        <div className="pt-2">
                            <h4 className="font-semibold text-sm mb-3 text-gray-800">Weight</h4>
                            <div className="flex gap-2">
                                {['1 Kg', '2 Kg', '3 Kg', '4 Kg'].map(w =>
                                    <button
                                        key={w}
                                        onClick={() => setWeight(w)}
                                        className={`border px-3 py-1.5 rounded-md text-sm transition-all ${w === weight ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'text-gray-600 border-gray-300 hover:border-green-600 hover:text-green-600'}`}
                                    >
                                        {w}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-1">
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 flex items-center justify-center font-bold text-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                <span className="px-4 border-x border-gray-300 py-1.5 text-sm font-semibold w-12 text-center">{quantity}</span>
                                <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 flex items-center justify-center font-bold text-lg" onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-3">
                            {isInCart ? (
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="flex-1 bg-green-600 hover:bg-green-700 transition-colors shadow-sm text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium text-sm"
                                >
                                    <ShoppingCart size={18} /> Go to Cart
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        addToCart(product, quantity, weight);
                                        navigate('/cart');
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium text-sm"
                                >
                                    <ShoppingCart size={18} /> Add to cart
                                </button>
                            )}
                            <button 
                                onClick={() => {
                                    if (!isInCart) addToCart(product, quantity, weight);
                                    navigate('/checkout');
                                }}
                                className="flex-1 border-2 border-blue-100 text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-colors py-2.5 rounded-lg font-medium text-sm"
                            >
                                Pre Order
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 pt-2 border-t border-gray-100 mt-6 text-[10px] uppercase font-black tracking-widest">
                            Sold by : <span className="font-black text-blue-600">{product.farmer?.farm_name || product.farmer?.name || 'Local Farmer'}</span> ({product.farmer?.location || 'Sass Valley'})
                        </p>
                    </div>

                    {/* Right: Ad Banner */}
                    <div className="lg:w-1/3">
                        <div className="bg-[#e2f1e4] rounded-2xl p-6 md:p-8 relative h-full min-h-[300px] flex flex-col items-start overflow-hidden">
                            <div className="z-10 mt-4">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Seasonal</p>
                                <h3 className="text-green-800 font-bold text-2xl md:text-3xl leading-none tracking-tight">FRESH</h3>
                                <h3 className="text-gray-800 font-black text-xl md:text-2xl mb-6 tracking-tight">PRODUCTS</h3>
                                <button className="bg-green-600 hover:bg-green-700 transition shadow-md text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2">
                                    SHOP NOW <span>→</span>
                                </button>
                            </div>

                            {/* Decorative badge */}
                            <div className="absolute top-8 right-6 border border-blue-300/60 rounded-full w-20 h-20 flex items-center justify-center rotate-12 bg-[#e2f1e4]/80 backdrop-blur-sm z-20">
                                <span className="text-blue-500 font-bold text-sm text-center leading-tight">40%<br />OFF</span>
                            </div>

                            {/* Image masking the bottom */}
                            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"
                                className="absolute -bottom-16 -right-10 w-[280px] h-[280px] object-cover rounded-full border-8 border-[#e2f1e4] shadow-xl z-0"
                                alt="Fresh Basket"
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs Area */}
                <div className="mt-16 border-b border-gray-200 flex gap-6 md:gap-10 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('Description')}
                        className={`font-semibold pb-3 px-2 whitespace-nowrap transition-colors ${activeTab === 'Description' ? 'border-b-2 border-[#1a73e8] text-gray-800' : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'}`}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab('Additional Information')}
                        className={`font-semibold pb-3 px-2 whitespace-nowrap transition-colors ${activeTab === 'Additional Information' ? 'border-b-2 border-[#1a73e8] text-gray-800' : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'}`}
                    >
                        Additional Information
                    </button>
                    <button
                        onClick={() => setActiveTab('Reviews')}
                        className={`font-semibold pb-3 px-2 whitespace-nowrap transition-colors ${activeTab === 'Reviews' ? 'border-b-2 border-[#1a73e8] text-gray-800' : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'}`}
                    >
                        Reviews
                    </button>
                </div>

                <div className="min-h-[250px]">
                    {activeTab === 'Description' && (
                        <div className="py-8 text-[13px] md:text-sm text-gray-600 leading-relaxed max-w-4xl space-y-5 animate-[fadeIn_0.3s_ease-in-out]">
                            <p>
                                Tired of pale, watery store-bought tomatoes? Our seasonal tomatoes bring back the true, robust flavor of a garden vegetable. Bursting with deep color, they offer a perfect balance of natural sweetness and satisfying acidity. Slice them thick for sandwiches, dice them raw for a vibrant fresh salsa, or roast them slowly to intensify their rich, savory notes. This isn't just a vegetable; it's a foundation for flavor in your cooking.
                            </p>
                            <p>
                                Grown with care by our partners at Sass Valley Farm, these tomatoes are cultivated using sustainable, natural farming practices. We commit to zero harmful pesticides and non-GMO seeds. Our promise to you is complete transparency: the tomatoes you receive were likely still on the vine just 24 hours ago, ensuring maximum nutrient retention and exceptional shelf life.
                            </p>
                            <p>These versatile tomatoes elevate any dish. They are essential for:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><span className="font-semibold text-gray-800">Fresh Salads:</span> A simple slice and a sprinkle of salt is all they need.</li>
                                <li><span className="font-semibold text-gray-800">Authentic Curries:</span> They break down beautifully into rich, thick gravies.</li>
                                <li><span className="font-semibold text-gray-800">Homemade Sauces:</span> Their natural sweetness cuts down on cooking time and sugar needs.</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'Additional Information' && (
                        <div className="py-8 max-w-5xl animate-[fadeIn_0.3s_ease-in-out]">
                            <table className="w-full text-[13px] md:text-sm text-left border border-gray-200">
                                <tbody>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3.5 px-4 text-gray-700 font-medium w-1/3 border-r border-gray-200">Sourcing Region</th>
                                        <td className="py-3.5 px-4 text-gray-800">Hand-picked from our sustainable partner farms in Green Vally Farm</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3.5 px-4 text-gray-700 font-medium w-1/3 border-r border-gray-200">Harvest Time</th>
                                        <td className="py-3.5 px-4 text-gray-800">Harvested daily and dispatched to your location within 24 hours of picking.</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3.5 px-4 text-gray-700 font-medium w-1/3 border-r border-gray-200">Quality Check</th>
                                        <td className="py-3.5 px-4 text-gray-800">Each tomato is individually inspected for firmness, color, and lack of blemishes before packing.</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3.5 px-4 text-gray-700 font-medium w-1/3 border-r border-gray-200">Pesticide/Chemicals</th>
                                        <td className="py-3.5 px-4 text-gray-800">Grown using natural fertilization and IPM (Integrated Pest Management) techniques.</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3.5 px-4 text-gray-700 font-medium w-1/3 border-r border-gray-200">Best Before Date</th>
                                        <td className="py-3.5 px-4 text-gray-800">Best consumed within 4–7 days from the date of delivery for peak flavor and texture.</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3.5 px-4 text-gray-700 font-medium w-1/3 border-r border-gray-200">Packaging</th>
                                        <td className="py-3.5 px-4 text-gray-800">Packed in eco-friendly, corrugated boxes with minimal plastic use to ensure safe transit and temperature stability.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'Reviews' && (
                        <div className="py-8 animate-[fadeIn_0.3s_ease-in-out] flex flex-col md:flex-row gap-10 md:gap-16">
                            {/* Left: Ratings Summary */}
                            <div className="md:w-1/3 flex flex-col gap-6">
                                <div className="flex items-end gap-3">
                                    <Star size={28} className="text-yellow-400 mb-1" fill="currentColor" />
                                    <span className="text-4xl font-bold text-gray-900 leading-none">4/5</span>
                                    <span className="text-sm text-gray-500 mb-0.5 ml-1 font-medium">120+ Rating</span>
                                </div>

                                <div className="space-y-2.5">
                                    {[
                                        { star: 5, fill: "bg-[#1a73e8]", width: "80%", count: 80 },
                                        { star: 4, fill: "bg-[#1a73e8]", width: "60%", count: 60 },
                                        { star: 3, fill: "bg-yellow-400", width: "40%", count: 20 },
                                        { star: 2, fill: "bg-red-500", width: "20%", count: 8 },
                                        { star: 1, fill: "bg-gray-200", width: "0%", count: 0 }
                                    ].map((row) => (
                                        <div key={row.star} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                            <div className="flex items-center gap-1 w-6">
                                                <Star size={14} className="text-gray-800" fill="currentColor" /> <span className="text-[13px]">{row.star}</span>
                                            </div>
                                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div className={`h-full ${row.fill} rounded-full`} style={{ width: row.width }}></div>
                                            </div>
                                            <span className="w-6 text-right text-[13px] text-gray-500">{row.count}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6">
                                    <h4 className="font-bold text-[15px] text-gray-900">Review This Products</h4>
                                    <p className="text-xs text-gray-500 mb-4 mt-0.5">Let other customer Know what you think</p>
                                    <button className="w-full sm:w-auto px-10 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded text-sm font-medium shadow-sm transition">
                                        Write a review
                                    </button>
                                </div>
                            </div>

                            {/* Right: Review List */}
                            <div className="md:w-2/3 space-y-4">
                                {[
                                    {
                                        name: "Vishal", date: "11 Sep 2025",
                                        comment: "I ordered these tomatoes yesterday, and they arrived this morning looking like they were just pulled off the vine! The smell alone is incredible. You simply cannot get this level of freshness from the market."
                                    },
                                    {
                                        name: "Ramdev", date: "20 Sep 2025",
                                        comment: "Finally, tomatoes that actually taste like tomatoes! I used them to make a simple homemade marinara sauce, and the flavor was rich and sweet, without needing extra sugar."
                                    },
                                    {
                                        name: "Raju", date: "15 Sep 2025",
                                        comment: "The tomatoes were firm, perfectly ripe, and none were bruised, even after shipping. I appreciate knowing the farm name; it makes me feel good about where my food is coming from."
                                    }
                                ].map((review, idx) => (
                                    <div key={idx} className="bg-[#f8f9fa] rounded p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="font-bold text-[15px] text-gray-900">{review.name}</span>
                                            <span className="text-[11px] text-gray-400 font-medium">{review.date}</span>
                                            <div className="flex items-center gap-0.5 ml-1">
                                                <Star size={12} className="text-yellow-400" fill="currentColor" />
                                                <Star size={12} className="text-yellow-400" fill="currentColor" />
                                                <Star size={12} className="text-yellow-400" fill="currentColor" />
                                                <Star size={12} className="text-yellow-400" fill="currentColor" />
                                                <Star size={12} className="text-gray-300" fill="currentColor" />
                                            </div>
                                        </div>
                                        <p className="text-[13px] md:text-sm text-gray-700 leading-relaxed font-normal">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* You May Also Like Section Placeholder */}
                <div className="mt-16 mb-8 border-t border-gray-100 pt-10">
                    <h3 className="text-2xl font-bold text-gray-800 mb-8">You May Also Like</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {/* Render simple dummy recommendation cards mirroring the screenshot */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="border border-gray-100 rounded-2xl p-3 hover:shadow-lg transition-shadow bg-white relative">
                                <div className="absolute top-5 left-5 bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">30% OFF</div>
                                <div className="relative mb-3 rounded-lg overflow-hidden group">
                                    <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" alt="Tomato" />
                                    <div className="absolute bottom-2 left-2 bg-green-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white">Organic</div>
                                </div>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-gray-800">Tomato</h4>
                                    <div className="flex gap-0.5 text-yellow-400"><Star size={10} fill="currentColor" strokeWidth={0} /><Star size={10} fill="currentColor" strokeWidth={0} /><Star size={10} fill="currentColor" strokeWidth={0} /><Star size={10} fill="currentColor" strokeWidth={0} /><Star size={10} className="text-gray-300" fill="currentColor" strokeWidth={0} /></div>
                                </div>
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="text-[10px] font-bold">₹ 45</span><span className="text-[10px] text-gray-500">/Kg</span>
                                </div>
                                <div className="space-y-2">
                                    <button className="w-full border border-blue-200 text-blue-600 rounded text-[11px] font-medium py-1.5 hover:bg-blue-50">Pre Order Now</button>
                                    <button className="w-full bg-[#1a73e8] text-white rounded text-[11px] font-medium py-1.5 hover:bg-blue-600 flex items-center justify-center gap-1"><ShoppingCart size={12} /> Add to cart</button>
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
