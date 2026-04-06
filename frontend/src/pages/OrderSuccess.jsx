import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle, ArrowRight, Package, Home, List } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OrderSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    // Get real order ID from navigation state, fallback to random for preview
    const orderId = location.state?.orderId ? `SF-${location.state.orderId}` : "SF-" + Math.floor(100000 + Math.random() * 900000);

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center py-20 px-6">
                <div className="max-w-md w-full text-center space-y-8">

                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="bg-blue-50 rounded-full p-6 relative">
                            <CheckCircle size={80} className="text-blue-500" strokeWidth={1.5} />
                            <div className="absolute top-0 right-0 w-4 h-4 bg-blue-400 rounded-full border-4 border-white animate-pulse"></div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-3">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order Placed Successfully!</h1>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Thank you for shopping with us. Your order <span className="text-blue-600 font-bold">{orderId}</span> has been confirmed and is being prepared for delivery.
                        </p>
                    </div>

                    {/* Delivery Info Box */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left flex items-start gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                            <Package className="text-[#1a73e8]" size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">Estimated Delivery</h4>
                            <p className="text-[13px] text-gray-600 font-medium">Tomorrow, 10:00 AM - 2:00 PM</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            onClick={() => navigate(`/order-status/${location.state?.orderId}`)}
                            className="w-full bg-[#1a73e8] hover:bg-blue-700 transition-all text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                            <List size={18} /> View Order Status
                        </button>
                        <button
                            onClick={() => navigate('/home')}
                            className="w-full bg-white border-2 border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all text-gray-600 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            <Home size={18} /> Continue Shopping
                        </button>
                    </div>

                    {/* Support Link */}
                    <p className="text-xs text-gray-400 pt-4">
                        Having trouble? <a href="#" className="text-[#1a73e8] font-bold hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
