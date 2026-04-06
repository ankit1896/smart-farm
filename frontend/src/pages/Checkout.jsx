import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import DeliveryAddress from "../components/DeliveryAddress";

export default function Checkout() {
    const { cart, cartTotal, totalWeight, clearCart } = useCart();
    const selectedItems = cart.filter(item => item.selected);
    const [deliveryOption, setDeliveryOption] = useState('Standard Delivery Option');
    const [paymentOption, setPaymentOption] = useState('Card');
    const [shippingOption, setShippingOption] = useState('Self Pickup');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const shippingFee = shippingOption === 'Delivery' ? 40 : 0;
    const finalTotal = cartTotal + shippingFee;

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        const token = localStorage.getItem("access_token");
        
        try {
            const orderData = {
                total_amount: finalTotal,
                shipping_address: selectedAddress?.id,
                address: deliveryAddress, 
                is_preorder: deliveryOption.includes('Pre Order'),
                items: selectedItems.map(item => ({
                    product: item.id,
                    quantity: item.quantity,
                    price: item.discount_price || item.price,
                    weight: item.weight
                }))
            };

            const response = await fetch("http://127.0.0.1:8000/api/orders/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const data = await response.json();
                clearCart(); 
                navigate('/order-success', { state: { orderId: data.id } });
            } else {
                const errorData = await response.json();
                console.error("Order failed:", errorData);
                alert("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting order:", error)
            alert("Network error. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10 font-sans">

                <h1 className="text-3xl font-bold text-gray-900 mb-8 hidden">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                    {/* Left: Forms */}
                    <div className="lg:w-2/3 space-y-10">

                        {/* Delivery Address Section */}
                        <DeliveryAddress 
                            onAddressChange={(str, obj) => {
                                setDeliveryAddress(str);
                                setSelectedAddress(obj);
                            }} 
                            onConfirm={(status) => setIsAddressConfirmed(status)}
                            isConfirmed={isAddressConfirmed}
                        />

                        {/* Delivery Option Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Option</h2>
                            <div className="bg-[#f2f8f3] rounded-xl p-8">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label className={`flex-1 flex items-center gap-3 bg-white px-5 py-3.5 rounded-lg cursor-pointer transition-shadow ${deliveryOption === 'Standard Delivery Option' ? 'shadow-sm ring-1 ring-blue-500' : 'hover:shadow-sm'}`}>
                                        <input
                                            type="radio"
                                            name="delivery"
                                            className="w-4 h-4 text-blue-600"
                                            checked={deliveryOption === 'Standard Delivery Option'}
                                            onChange={() => setDeliveryOption('Standard Delivery Option')}
                                        />
                                        <span className="font-semibold text-gray-800">Standard Delivery Option</span>
                                    </label>

                                    <label className={`flex-1 flex items-center gap-3 bg-white px-5 py-3.5 rounded-lg cursor-pointer transition-shadow ${deliveryOption === 'Pre Order Option' ? 'shadow-sm ring-1 ring-blue-500' : 'hover:shadow-sm'}`}>
                                        <input
                                            type="radio"
                                            name="delivery"
                                            className="w-4 h-4 text-blue-600"
                                            checked={deliveryOption === 'Pre Order Option'}
                                            onChange={() => setDeliveryOption('Pre Order Option')}
                                        />
                                        <span className="font-semibold text-gray-800">Pre Order Option</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Payment Option Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Option</h2>
                            <div className="bg-[#f2f8f3] rounded-xl p-8 space-y-3">

                                {/* Card Option Container */}
                                <div className="bg-white rounded-lg overflow-hidden transition-all duration-300">
                                    <label className="flex items-center justify-between p-4 cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                checked={paymentOption === 'Card'}
                                                onChange={() => setPaymentOption('Card')}
                                            />
                                            <div className="flex items-center gap-2">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                                <span className="font-bold text-gray-900 text-[15px]">Card</span>
                                            </div>
                                        </div>
                                        {/* Card Icons */}
                                        <div className="flex items-center gap-2">
                                            <div className="bg-blue-100 text-blue-800 text-[10px] font-black italic px-2 py-1 rounded">VISA</div>
                                            <div className="bg-blue-50 flex items-center justify-center p-1 rounded">
                                                <div className="w-3 h-3 rounded-full bg-red-500 mix-blend-multiply opacity-90 -mr-1"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-400 mix-blend-multiply opacity-90"></div>
                                            </div>
                                        </div>
                                    </label>

                                    {/* Card Details Form (expandable) */}
                                    {paymentOption === 'Card' && (
                                        <div className="px-10 pb-5 pt-1 space-y-3 animate-[fadeIn_0.2s_ease-in-out]">
                                            <input type="text" placeholder="Card Number" className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-green-500 placeholder:text-gray-400" />
                                            <div className="flex gap-3">
                                                <input type="text" placeholder="MM/YY" className="flex-1 border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-green-500 placeholder:text-gray-400" />
                                                <input type="text" placeholder="CVV" className="flex-1 border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-green-500 placeholder:text-gray-400" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* UPI Option */}
                                <label className="flex items-center justify-between bg-white p-4 rounded-lg cursor-pointer hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            className="w-4 h-4 text-blue-600"
                                            checked={paymentOption === 'UPI'}
                                            onChange={() => setPaymentOption('UPI')}
                                        />
                                        <div className="flex items-center gap-2">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                                            <span className="font-bold text-gray-900 text-[15px]">UPI</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-purple-100 text-purple-700 text-[9px] font-black px-1.5 py-1 rounded tracking-tight">पे</div>
                                        <div className="bg-blue-100 text-[#00baf2] text-[9px] font-black px-1.5 py-1 rounded">Paytm</div>
                                    </div>
                                </label>

                                {/* Net Banking Option */}
                                <label className="flex items-center justify-between bg-white p-4 rounded-lg cursor-pointer hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            className="w-4 h-4 text-blue-600"
                                            checked={paymentOption === 'Net Banking'}
                                            onChange={() => setPaymentOption('Net Banking')}
                                        />
                                        <div className="flex items-center gap-2">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800"><path d="M3 21h18"></path><path d="M3 10h18"></path><path d="M5 6l7-3 7 3"></path><path d="M4 10v11"></path><path d="M20 10v11"></path><path d="M8 14v3"></path><path d="M12 14v3"></path><path d="M16 14v3"></path></svg>
                                            <span className="font-bold text-gray-900 text-[15px]">Net Banking</span>
                                        </div>
                                    </div>
                                </label>

                                {/* Cash on Delivery Option */}
                                <label className="flex items-center justify-between bg-white p-4 rounded-lg cursor-pointer hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            className="w-4 h-4 text-blue-600"
                                            checked={paymentOption === 'Cash on Delivery'}
                                            onChange={() => setPaymentOption('Cash on Delivery')}
                                        />
                                        <div className="flex items-center gap-2">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                                            <span className="font-bold text-gray-900 text-[15px]">Cash on Delivery</span>
                                        </div>
                                    </div>
                                </label>

                            </div>
                        </div>

                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:w-1/3 w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 w-full max-w-sm ml-auto">Order Summary</h2>
                        <div className="bg-[#f2f8f3] rounded-xl p-8 sticky top-10 ml-auto w-full">

                            {/* Items List */}
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {selectedItems.map((item) => (
                                    <div key={item.cartItemId} className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <img src={item.image_url || "https://via.placeholder.com/60"} alt={item.name} className="w-12 h-9 object-cover rounded shadow-sm" />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[14px] text-gray-900 leading-tight">{item.name}</span>
                                                <span className="text-[11px] text-[#1a73e8] font-bold">{item.weight}</span>
                                                <span className="text-[11px] text-gray-500">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <span className="font-bold text-[14px] text-gray-900 whitespace-nowrap">₹{(item.discount_price || item.price) * item.quantity}</span>
                                    </div>
                                ))}
                                {selectedItems.length === 0 && <p className="text-gray-400 text-center text-sm py-4">No items selected.</p>}
                            </div>

                            <hr className="border-gray-200 mb-6" />

                            {/* Calculation */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-[15px] text-gray-900 font-medium">
                                    <span>Subtotal</span>
                                    <span className="font-bold">₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-[15px] text-green-600 font-bold py-1">
                                    <span>Total Harvest Weight</span>
                                    <span>{totalWeight} Kg</span>
                                </div>
                                <div className="flex justify-between items-start text-[15px] text-gray-900 font-medium pt-2">
                                    <span>Shipping</span>
                                    <div className="flex flex-col items-end gap-3 translate-y-[-2px]">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                checked={shippingOption === 'Delivery'}
                                                onChange={() => setShippingOption('Delivery')}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="group-hover:text-gray-700 transition-colors">₹40</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group mb-1">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                checked={shippingOption === 'Self Pickup'}
                                                onChange={() => setShippingOption('Self Pickup')}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="group-hover:text-gray-700 transition-colors text-sm text-gray-700">Self Pickup</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handlePlaceOrder}
                                disabled={isSubmitting || !isAddressConfirmed}
                                className={`w-full ${isSubmitting || !isAddressConfirmed ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a73e8] hover:bg-blue-700'} transition-colors text-white py-3.5 rounded-md font-semibold text-[15px] mt-2 shadow-sm flex items-center justify-center gap-2`}
                            >
                                {isSubmitting ? 'Processing...' : !isAddressConfirmed ? 'Confirm Address to Order' : 'Place Order'}
                            </button>

                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}
