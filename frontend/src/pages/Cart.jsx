import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function Cart() {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, updateWeight, toggleSelection, cartTotal, totalWeight } = useCart();
    const selectedItemsCount = cart.filter(item => item.selected).length;
    const deliveryFee = selectedItemsCount > 0 ? 10 : 0;
    const finalTotal = cartTotal + deliveryFee;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 font-sans">

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Left: Cart Items List */}
                    <div className="lg:w-2/3 border border-gray-200 rounded-lg p-2 md:p-6">
                        {cart.length === 0 ? (
                            <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                                <div className="bg-gray-50 p-6 rounded-full">
                                    <ShoppingBag size={48} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Your cart is empty</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet.</p>
                                <button
                                    onClick={() => navigate('/home')}
                                    className="bg-[#1a73e8] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            cart.map((item, index) => (
                                <div key={item.cartItemId} className={`flex flex-col md:flex-row items-center md:items-start justify-between gap-6 py-6 px-4 md:px-2 ${index !== cart.length - 1 ? 'border-b border-gray-200' : ''}`}>

                                    {/* Checkbox and Image/Title */}
                                    <div className="flex items-center gap-4 w-full md:w-[40%]">
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => toggleSelection(item.cartItemId)}
                                            className="w-5 h-5 accent-green-600 rounded cursor-pointer"
                                        />
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.image_url || "https://via.placeholder.com/150"}
                                                className={`w-24 h-20 rounded-md object-cover shadow-sm border border-gray-100 transition-opacity ${item.selected ? 'opacity-100' : 'opacity-50'}`}
                                                alt={item.name}
                                            />
                                            <div className="flex flex-col">
                                                <h3 className={`font-bold text-[16px] leading-tight mb-1 transition-colors ${item.selected ? 'text-gray-900' : 'text-gray-400'}`}>{item.name}</h3>
                                                <p className="text-[11px] text-gray-400 font-medium mb-3 text-left">Sold by: {item.farmer?.name || 'Local Farmer'}</p>

                                                <div className="flex flex-col items-start gap-0.5">
                                                    <p className={`text-[12px] font-bold transition-colors ${item.selected ? 'text-gray-700' : 'text-gray-400'}`}>Unit: {item.weight}</p>
                                                    <p className={`text-[11px] font-medium transition-colors ${item.selected ? 'text-[#1a73e8]' : 'text-gray-400'}`}>Total Weight: {parseFloat(item.weight) * item.quantity} Kg</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex flex-col w-full md:w-[15%]">
                                        <span className="font-bold text-[15px] text-gray-900 mb-2 md:mb-3">Price</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-sm text-gray-800">₹{item.discount_price || item.price}</span>
                                            {item.discount_price && (
                                                <span className="text-[11px] text-gray-400 line-through italic">₹{item.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex flex-col w-full md:w-[15%]">
                                        <span className="font-bold text-[15px] text-gray-900 mb-2 md:mb-3">Quantity</span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                className="text-gray-400 hover:text-gray-700 hover:border-gray-400 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="font-semibold text-sm text-gray-800 w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                className="text-gray-400 hover:text-gray-700 hover:border-gray-400 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total Price */}
                                    <div className="flex flex-col w-full md:w-[15%]">
                                        <span className="font-bold text-[15px] text-gray-900 mb-2 md:mb-3">Total</span>
                                        <span className="font-semibold text-sm text-gray-800">₹{(item.discount_price || item.price) * item.quantity}</span>
                                    </div>

                                    {/* Action */}
                                    <div className="flex flex-col w-full md:w-[15%] items-start">
                                        <span className="font-bold text-[15px] text-gray-900 mb-2 md:mb-3">Action</span>
                                        <button
                                            onClick={() => removeFromCart(item.cartItemId)}
                                            className="text-red-500 hover:text-red-700 flex items-center gap-1.5 text-sm font-medium transition-colors"
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>

                                </div>
                            ))
                        )}
                    </div>

                    {/* Right: Cart Total */}
                    <div className="lg:w-1/3">
                        <div className="border border-gray-200 rounded-lg p-6 lg:p-8 sticky top-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 tracking-tight">Cart Total</h2>

                            {/* Coupon Code section */}
                            <div className="mb-8">
                                <h4 className="text-[13px] font-medium text-gray-500 mb-3">Coupon Apply</h4>
                                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-gray-50/50 group focus-within:border-[#1a73e8] focus-within:ring-1 focus-within:ring-[#1a73e8] transition-all">
                                    <input
                                        className="px-4 py-2.5 outline-none flex-1 text-[13px] bg-transparent text-gray-700 placeholder:text-gray-400 w-full"
                                        placeholder="Enter Coupon Code"
                                    />
                                    <button className="px-5 py-2.5 text-[#1a73e8] text-[13px] font-semibold bg-[#e8f1fd] hover:bg-[#d4e6fc] transition-colors border-l border-gray-200 shrink-0">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Calculation Details */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-[15px] text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-[15px] text-green-600 font-bold">
                                    <span>Total Weight</span>
                                    <span>{totalWeight} Kg</span>
                                </div>
                                <div className="flex justify-between items-center text-[15px] text-gray-600 font-medium">
                                    <span>Coupon Discount</span>
                                    <span>-₹0.00</span>
                                </div>
                                <div className="flex justify-between items-center text-[15px] text-gray-600 font-medium pb-5 border-b border-gray-200">
                                    <span>Delivery</span>
                                    <span>₹{deliveryFee}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2">
                                    <span>Total</span>
                                    <span>₹{finalTotal}</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-[#1a73e8] hover:bg-blue-700 text-white py-3 rounded text-[15px] font-semibold shadow-sm transition-colors"
                                >
                                    Proceed To Checkout
                                </button>
                                <button className="w-full bg-white hover:bg-gray-50 border border-[#1a73e8] text-[#1a73e8] py-3 rounded text-[15px] font-semibold transition-colors">
                                    Continue Shopping
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
}
