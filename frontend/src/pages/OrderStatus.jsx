import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, ChevronLeft, Package } from 'lucide-react';

export default function OrderStatus() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const token = localStorage.getItem("access_token");
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrder(data);
                }
            } catch (err) {
                console.error("Failed to fetch order", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    // Mapping logic for Admin Panel status
    // Backend STATUS_CHOICES: Pending, Confirmed, Shipped, Delivered
    const getStatusIndex = (status) => {
        switch (status) {
            case 'Pending': return 0;
            case 'Confirmed': return 1;
            case 'Shipped': return 2;
            case 'Delivered': return 3;
            case 'Cancelled': return -1;
            default: return 0;
        }
    };

    const currentStepIndex = order ? getStatusIndex(order.status) : 0;

    const steps = [
        { label: 'Pending', sub: currentStepIndex >= 0 ? 'Admin Review' : 'Waiting' },
        { label: 'Confirmed', sub: currentStepIndex >= 1 ? 'Accepted' : 'Pending' },
        { label: 'Shipped', sub: currentStepIndex >= 2 ? 'In Transit' : 'Pending' },
        { label: 'Delivered', sub: currentStepIndex >= 3 ? 'Completed' : 'Pending' }
    ];

    const firstItem = order?.items?.[0] || {};
    const product = firstItem.product_details || {};
    const farmName = product?.farmer?.farm_name || product?.farmer?.name || 'Green Vally Farm';
    const trackingCode = order ? `SF-${order.id.toString().padStart(4, '0')}` : 'JH0987DV';

    if (loading) return <div className="min-h-screen bg-white"><Navbar /><div className="h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div></div>;

    if (!order) return <div className="min-h-screen bg-white text-center py-20"><Navbar /><p className="text-gray-500">Order not found.</p></div>;

    return (
        <div className="min-h-screen bg-[#F8FAF9] font-sans pb-20">
            <Navbar />

            {/* Premium Header: Tracking Info */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                             <div className="flex items-center gap-3 mb-2">
                                 {order.is_preorder ? (
                                     <span className="bg-[#2ecc71] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Pre-Order Reservation</span>
                                 ) : (
                                     <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Active Shipment</span>
                                 )}
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">SF-{order.id.toString().padStart(4, '0')}</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Track Your Fresh Delivery</h1>
                        </div>
                        
                        {/* Action Bar */}
                        <div className="flex gap-4">
                            <button className="bg-white text-gray-900 border-2 border-gray-100 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95 flex items-center gap-2">
                                <Package size={16} /> Print Invoice
                            </button>
                            <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200">
                                Need Help?
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* LEFT COLUMN: Journey & Status */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Glassmorphic Journey Card */}
                        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-[3.5rem] p-10 border border-white shadow-2xl shadow-blue-900/5">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
                            
                            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] mb-12 relative z-10">Shipment Progress</h3>
                            
                            {/* Visual Timeline */}
                            <div className="relative z-10 mb-16">
                                <div className="absolute top-7 left-[10%] right-[10%] h-[4px] bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-600 transition-all duration-[2000ms] shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                        style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between relative">
                                    {steps.map((step, idx) => {
                                        const isReached = idx <= currentStepIndex;
                                        const isCurrent = idx === currentStepIndex;
                                        return (
                                            <div key={idx} className="flex flex-col items-center w-24">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 relative ${isReached ? 'bg-blue-600 shadow-xl shadow-blue-200' : 'bg-gray-50 border-2 border-gray-100'}`}>
                                                    {isCurrent && (
                                                        <div className="absolute inset-0 bg-blue-400 rounded-2xl animate-ping opacity-20"></div>
                                                    )}
                                                    <Check size={24} className={isReached ? 'text-white' : 'text-gray-200'} strokeWidth={4} />
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <p className={`text-[13px] font-black tracking-tight ${isReached ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</p>
                                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${isReached ? 'text-blue-500' : 'text-gray-400'}`}>{step.sub}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Mock Map View */}
                            <div className="relative h-64 bg-[#EBF4FF] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-inner group">
                                {/* Map Grid/Pattern */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                                
                                {/* Path Line */}
                                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                    <path 
                                        d="M 100 150 Q 300 50 500 150 T 800 100" 
                                        fill="none" 
                                        stroke="#cbd5e1" 
                                        strokeWidth="4" 
                                        strokeDasharray="10,10"
                                    />
                                    <path 
                                        d="M 100 150 Q 300 50 500 150 T 800 100" 
                                        fill="none" 
                                        stroke="#2563eb" 
                                        strokeWidth="4" 
                                        strokeDashoffset="1000"
                                        strokeDasharray="1000"
                                        className="animate-[dash_10s_linear_infinite]"
                                    />
                                </svg>

                                {/* Map Markers */}
                                <div className="absolute left-[10%] top-[150px] -translate-y-1/2 flex flex-col items-center">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-green-500">
                                        <span className="text-lg">🚜</span>
                                    </div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2 bg-white/80 px-2 py-1 rounded-md">Farm</p>
                                </div>
                                <div className="absolute right-[10%] top-[100px] -translate-y-1/2 flex flex-col items-center">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-blue-500">
                                        <span className="text-lg">🏠</span>
                                    </div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2 bg-white/80 px-2 py-1 rounded-md">Home</p>
                                </div>

                                {/* Moving Vehicle */}
                                <div 
                                    className="absolute w-12 h-12 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center transition-all duration-[3000ms] z-20"
                                    style={{ 
                                        left: `${10 + (currentStepIndex * 25)}%`,
                                        top: `${150 - (currentStepIndex * 15)}px`,
                                        transform: 'translate(-50%, -50%)' 
                                    }}
                                >
                                    <Package size={20} className="text-white" />
                                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-30"></div>
                                </div>
                            </div>
                        </div>

                        {/* Shipment Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">📅</div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                        {order.is_preorder ? "Estimated Harvest" : "Estimated Arrival"}
                                    </p>
                                    <p className="text-xl font-black text-gray-900 tracking-tight">
                                        {order.is_preorder 
                                            ? (product.harvest_date ? new Date(product.harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA')
                                            : "Today, 5:00 PM"}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">📦</div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Courier Service</p>
                                    <p className="text-xl font-black text-gray-900 tracking-tight">FarmExpress Core</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Items & Summary */}
                    <div className="space-y-8">
                        <div className="bg-gray-900 text-white rounded-[3rem] p-10 shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -mr-24 -mb-24 blur-2xl"></div>
                            
                            <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-8 relative z-10">Order Summary</h3>
                            
                            <div className="space-y-6 mb-10 relative z-10 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 overflow-hidden border border-white/10">
                                            <img 
                                                src={item.product_details?.image_url || 'https://images.unsplash.com/photo-1597362868123-a55d39a93f2f?auto=format&fit=crop&q=80&w=200'} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                alt={item.product_details?.name} 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black tracking-tight leading-tight mb-0.5">{item.product_details?.name}</p>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Qty: {item.quantity} • {item.weight}</p>
                                        </div>
                                        <p className="text-sm font-black">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-8 space-y-4 relative z-10">
                                <div className="flex justify-between text-sm font-bold opacity-60">
                                    <span>Subtotal</span>
                                    <span>₹{order.total_amount}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold opacity-60">
                                    <span>Shipping</span>
                                    <span className="text-green-400">FREE</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Total Paid</span>
                                    <span className="text-4xl font-black text-blue-400 tracking-tighter">₹{order.total_amount}</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-white text-gray-400 border-2 border-gray-100 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] hover:text-blue-600 hover:border-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                        >
                            <ChevronLeft size={18} className="group-hover:-translate-x-2 transition-transform duration-500" />
                            Back to History
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes dash {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.1);
                }
            `}} />
        </div>
    );
}
