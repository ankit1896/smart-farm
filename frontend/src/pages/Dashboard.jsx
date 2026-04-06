import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DeliveryAddress from "../components/DeliveryAddress";
import {
    LayoutDashboard,
    ShoppingCart,
    MapPin,
    Heart,
    User,
    Camera,
    Edit2,
    Mail,
    Lock,
    Package,
    Clock,
    CheckCircle2
} from "lucide-react";

export default function Dashboard() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || "Dashboard");
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Profile
                const profileRes = await fetch("http://localhost:8000/api/profile/", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (profileRes.status === 401) {
                    console.error("Profile Fetch 401 Unauthorized. Token might be invalid.");
                    return handleLogout("Unauthorized - Profile");
                }
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData);
                }

                // Fetch Orders
                const ordersRes = await fetch("http://localhost:8000/api/orders/", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (ordersRes.status === 401) {
                    console.error("Orders Fetch 401 Unauthorized.");
                    return handleLogout("Unauthorized - Orders");
                }
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData);
                }

                // Fetch Addresses
                const addressesRes = await fetch("http://localhost:8000/api/addresses/", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (addressesRes.status === 401) {
                    console.error("Addresses Fetch 401 Unauthorized.");
                    return handleLogout("Unauthorized - Addresses");
                }
                if (addressesRes.ok) {
                    const addressesData = await addressesRes.json();
                    setAddresses(addressesData);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (token) {
            fetchData();
        } else {
            setIsLoading(false);
            navigate("/");
        }
    }, [token, navigate]);

    const handleRefreshAddresses = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/addresses/", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setAddresses(await res.json());
        } catch (e) { console.error(e); }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm("Are you sure you want to remove this address?")) return;
        try {
            const res = await fetch(`http://localhost:8000/api/addresses/${id}/`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) handleRefreshAddresses();
        } catch (e) { console.error(e); }
    };

    const sidebarItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Order", icon: <ShoppingCart size={20} /> },
        { name: "Address", icon: <MapPin size={20} /> },
        { name: "Profile", icon: <User size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "Dashboard":
                return <DashboardHome profile={profile} addresses={addresses} setActiveTab={setActiveTab} />;
            case "Address":
                return <AddressBook addresses={addresses} onDelete={handleDeleteAddress} onRefresh={handleRefreshAddresses} />;
            case "Order":
                return <OrderHistory orders={orders} />;
            case "Profile":
                return <ProfileSettings profile={profile} />;
            default:
                return <DashboardHome profile={profile} setActiveTab={setActiveTab} />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-blue-600">
                    <CheckCircle2 className="animate-bounce" size={48} />
                    <p className="font-black text-xs uppercase tracking-[0.3em] text-gray-400">Syncing with Farm...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-[#F0F2F5] font-sans flex flex-col">
            <Navbar onLogout={handleLogout} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">

                {/* Sidebar */}
                <aside className="lg:w-[320px] w-full flex flex-col bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden min-h-[700px] border border-gray-100">
                    {/* Sidebar Header with Gradient */}
                    <div className="h-40 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 relative">
                        <img src="https://www.transparenttextures.com/patterns/cubes.png" className="absolute inset-0 opacity-20 w-full h-full object-cover" alt="" />
                    </div>

                    {/* Profile Info Card Area */}
                    <div className="flex flex-col items-center -mt-20 px-8 pb-8 flex-1 text-[#4F5B6E]">
                        <div className="relative mb-6">
                            <div className="w-36 h-36 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-gray-100">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
                                    className="w-full h-full object-cover"
                                    alt="Profile"
                                />
                            </div>
                            <button className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-all text-gray-600">
                                <Edit2 size={16} />
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold text-[#1F2937] text-center">
                            {profile?.user_details?.first_name} {profile?.user_details?.last_name || "User"}
                        </h2>
                        <p className="text-gray-400 text-sm font-medium mb-10 tracking-tight">{profile?.user_details?.email}</p>

                        {/* Navigation Menu */}
                        <nav className="w-full space-y-1">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => setActiveTab(item.name)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[15px] transition-all duration-300 ${activeTab === item.name
                                        ? "bg-[#EBF5FF] text-[#3B82F6] shadow-sm"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        }`}
                                >
                                    <span className={activeTab === item.name ? "text-[#3B82F6]" : "text-gray-400"}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <section className="flex-1 bg-white rounded-[3rem] p-10 lg:p-14 shadow-2xl shadow-gray-200/40 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <header className="mb-12">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                            {activeTab === "Order" ? "My Order History" : "My Dashboard"}
                        </h1>
                    </header>

                    {renderContent()}
                </section>
            </main>

            <Footer />
        </div>
    );
}

// Sub-component: Dashboard Home (Matches the image)
function DashboardHome({ profile, addresses, setActiveTab }) {
    const stats = profile?.stats || { total_orders: 0, pending_orders: 0, wishlist_count: 0 };

    return (
        <div className="space-y-12">
            {/* Welcome Greeting */}
            <div className="space-y-3">
                <h2 className="text-2xl font-bold text-[#1F2937]">Hello <span className="text-blue-600">{profile?.user_details?.first_name || "Farmer"}</span></h2>
                <p className="text-[#6B7280] leading-relaxed max-w-3xl font-medium">
                    Your dashboard gives you a clear overview of your orders, wishlist, and account settings. Explore fresh products, stay updated on deliveries, and manage everything in one simple place.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#F2FAF4] p-8 rounded-[2.5rem] flex items-center gap-6 border border-[#E0F2E5] transition-transform hover:scale-[1.02]">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-blue-600 border border-blue-50">
                        <Package size={32} />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Total Order</p>
                        <p className="text-3xl font-black text-gray-900 text-center">{stats.total_orders}</p>
                    </div>
                </div>

                <div className="bg-[#F0F7FF] p-8 rounded-[2.5rem] flex items-center gap-6 border border-[#D9EAFB] transition-transform hover:scale-[1.02]">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-blue-600 border border-blue-50">
                        <Clock size={32} />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pending Order</p>
                        <p className="text-3xl font-black text-gray-900 text-center">{stats.pending_orders}</p>
                    </div>
                </div>
            </div>

            {/* Account Information Section */}
            <div className="space-y-8 mt-4">
                <h3 className="text-2xl font-bold text-gray-900 pb-2 border-b-2 border-gray-50 uppercase tracking-widest text-xs opacity-50">Account Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <h4 className="font-bold text-gray-900">Contact Information</h4>
                            <button className="text-blue-600 text-xs font-bold hover:underline">Edit</button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-gray-700">{profile?.user_details?.first_name} {profile?.user_details?.last_name}</p>
                            <p className="text-sm text-gray-500 font-medium">{profile?.user_details?.email}</p>
                            <button className="text-blue-600 text-[13px] font-bold mt-2 hover:underline">Change Password</button>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <h4 className="font-bold text-gray-900">Newsletter</h4>
                            <button className="text-blue-600 text-xs font-bold hover:underline">Edit</button>
                        </div>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                            You are currently not subscribed to any newsletter.
                        </p>
                    </div>
                </div>

                <div className="space-y-4 pt-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <h4 className="font-bold text-gray-900">Address Book</h4>
                        <button onClick={() => setActiveTab("Address")} className="text-blue-600 text-xs font-bold hover:underline">Manage All</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-2">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Default Shipping Address</p>
                            {addresses && addresses.length > 0 ? (
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-gray-700">{addresses[0].full_name}</p>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {addresses[0].house_no}, {addresses[0].area}, {addresses[0].landmark}
                                    </p>
                                    <p className="text-sm text-gray-500 font-medium">{addresses[0].city}, {addresses[0].state} - {addresses[0].postal_code}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 font-medium leading-relaxed italic mb-3">
                                    You have not set a default shipping address.
                                </p>
                            )}
                            <button onClick={() => setActiveTab("Address")} className="text-blue-600 text-[13px] font-bold hover:underline flex items-center gap-1 mt-2">Edit address</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-component: Order History (Matches the image)
function OrderHistory({ orders }) {
    const navigate = useNavigate();

    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 italic text-gray-400">
                <Package className="mx-auto mb-4 opacity-20" size={48} />
                You haven't placed any orders yet.
            </div>
        );
    }

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {orders.map((order) => (
                <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col gap-6 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>

                    <div className="flex justify-between items-center border-b border-gray-50 pb-5 relative z-10">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Order Status</span>
                            <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm transition-all duration-500 ${getStatusStyles(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter mb-0.5">Order ID</span>
                            <span className="text-sm font-black text-gray-900 tracking-tight">SF-{order.id.toString().padStart(4, '0')}</span>
                        </div>
                    </div>

                    <div className="space-y-5 relative z-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {order.items.map((item, idx) => (
                            <div key={`${order.id}-${idx}`} className="flex gap-4 items-center animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-gray-50 border border-gray-100 flex-shrink-0 group/img">
                                    <img
                                        src={item.product_details?.image_url || "https://images.unsplash.com/photo-1597362868123-a55d39a93f2f?auto=format&fit=crop&q=80&w=200"}
                                        className="w-full h-full object-cover transition-transform group-hover/img:scale-110"
                                        alt={item.product_details?.name}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[13px] font-black text-gray-800 truncate">{item.product_details?.name || 'Fresh Item'}</h4>
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">{item.weight} • Qty: {item.quantity || 1}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[14px] font-black text-blue-600">₹{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-5 mt-auto border-t border-gray-50 relative z-10">
                        <div className="flex justify-between items-center bg-[#F8FAF8] p-5 rounded-[1.5rem] mb-5 border border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</span>
                                <span className="text-2xl font-black text-gray-900 tracking-tighter">₹{order.total_amount}</span>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                                <CheckCircle2 size={20} className="text-green-500" />
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/order-status/${order.id}`)}
                            className="w-full py-4 rounded-[1.25rem] bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-xl shadow-gray-200 hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-3 group/btn"
                        >
                            <Package size={16} className="group-hover/btn:scale-125 transition-transform" />
                            Track Unified Order
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Sub-component: Address Book (Matches the image)
function AddressBook({ addresses, onDelete, onRefresh }) {
    const [editingAddress, setEditingAddress] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const token = localStorage.getItem("access_token");

    const [form, setForm] = useState({
        full_name: '', address_type: 'Home', phone: '', house_no: '', area: '', landmark: '', city: '', state: '', postal_code: ''
    });

    const handleEditClick = (address) => {
        setEditingAddress(address);
        setForm(address);
        setShowForm(true);
    };

    const handleAddClick = () => {
        setEditingAddress(null);
        setForm({
            full_name: '', address_type: 'Home', phone: '', house_no: '', area: '', landmark: '', city: '', state: '', postal_code: ''
        });
        setShowForm(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = editingAddress ? "PUT" : "POST";
        const url = editingAddress
            ? `http://127.0.0.1:8000/api/addresses/${editingAddress.id}/`
            : "http://127.0.0.1:8000/api/addresses/";

        const fullAddressStr = `${form.house_no}, ${form.area}, ${form.landmark ? 'Near ' + form.landmark : ''}, ${form.city}, ${form.state} - ${form.postal_code}`;
        const payload = { ...form, address: fullAddressStr };

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowForm(false);
                onRefresh();
            } else {
                const errorData = await res.json();
                console.error("Failed to save address:", errorData);
                alert("Failed to save address: " + JSON.stringify(errorData));
            }
        } catch (e) {
            console.error(e);
            alert("Network error. Please try again.");
        }
    };
    if (showForm) {
        return (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">{editingAddress ? "Edit Address" : "Add New Address"}</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">Cancel</button>
                </div>
                <form onSubmit={handleSave} className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="w-full bg-white rounded-2xl p-4 text-sm font-bold border-2 border-transparent focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="Enter full name" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-white rounded-2xl p-4 text-sm font-bold border-2 border-transparent focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="Phone number" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address Type</label>
                        <div className="flex gap-4">
                            {['Home', 'Work', 'Other'].map(type => (
                                <button key={type} type="button" onClick={() => setForm({ ...form, address_type: type })} className={`flex-1 py-3 rounded-xl font-bold text-[12px] transition-all border-2 ${form.address_type === type ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-100'}`}>{type}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">House/Flat No.</label>
                        <input required value={form.house_no} onChange={e => setForm({ ...form, house_no: e.target.value })} className="w-full bg-white rounded-2xl p-4 text-sm font-bold border-2 border-transparent focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="House/Flat No." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Area/Street</label>
                        <input required value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} className="w-full bg-white rounded-2xl p-4 text-sm font-bold border-2 border-transparent focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="Area/Street" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                        <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full bg-white rounded-2xl p-4 text-sm font-bold border-2 border-transparent focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="City" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                        <input required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="w-full bg-white rounded-2xl p-4 text-sm font-bold border-2 border-transparent focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="State" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Postal Code</label>
                        <input required value={form.postal_code} onChange={e => setForm({ ...form, postal_code: e.target.value })} className="w-full bg-white rounded-2xl p-4 text-sm font-bold border-2 border-transparent focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="XXXXXX" />
                    </div>
                    <button type="submit" className="md:col-span-2 bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95">
                        {editingAddress ? "Update Address" : "Save New Address"}
                    </button>
                </form>
            </div>
        );
    }

    if (!addresses || addresses.length === 0) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 italic text-gray-400">
                    <MapPin className="mx-auto mb-4 opacity-20" size={48} />
                    You haven't saved any addresses yet.
                </div>
                <button onClick={handleAddClick} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center gap-2 mx-auto shadow-lg active:scale-95">
                    + Add New Address
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm shadow-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900">My Address Book</h3>
                <button onClick={handleAddClick} className="bg-blue-50 text-blue-600 border border-blue-100 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-100 transition-all active:scale-95">
                    + Add New Address
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map((address) => (
                    <div key={address.id} className={`p-6 rounded-[1.5rem] border-2 transition-all duration-300 relative bg-white flex flex-col justify-between ${address.is_default ? "border-blue-500 shadow-lg shadow-blue-50" : "border-gray-100 hover:border-gray-200"
                        }`}>
                        <div>
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${address.is_default ? "border-blue-500 bg-blue-500" : "border-gray-300"
                                    }`}>
                                    {address.is_default && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{address.full_name}</h4>
                                    <div className="space-y-1">
                                        <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                                            <span className="font-bold text-gray-700">Address:</span> {address.house_no}, {address.area}, {address.landmark}, {address.city}, {address.state}
                                        </p>
                                        <p className="text-[13px] text-gray-500 font-medium tracking-tight">
                                            <span className="font-bold text-gray-700">Pin:</span> {address.postal_code}
                                        </p>
                                        <p className="text-[13px] text-gray-500 font-medium tracking-tight">
                                            <span className="font-bold text-gray-700">Phone:</span> {address.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6 pt-6 border-t border-gray-50">
                            <button onClick={() => handleEditClick(address)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-bold text-[13px] hover:bg-gray-100 transition-all border border-gray-100">
                                <Edit2 size={14} className="text-gray-400" /> Edit
                            </button>
                            <button onClick={() => onDelete(address.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-[13px] hover:bg-red-100 transition-all border border-red-100">
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Placeholder for Profile Settings Tab
function ProfileSettings({ profile }) {
    return (
        <div className="space-y-10 max-w-2xl">
            <h3 className="text-2xl font-bold mb-8">Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-center items-center">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">First Name</label>
                    <input type="text" className="w-full bg-gray-50 border-transparent focus:ring-blue-500 focus:bg-white transition-all rounded-xl p-4 text-sm font-bold" value={profile?.user_details?.first_name || ""} readOnly />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Last Name</label>
                    <input type="text" className="w-full bg-gray-50 border-transparent focus:ring-blue-500 focus:bg-white transition-all rounded-xl p-4 text-sm font-bold" value={profile?.user_details?.last_name || ""} readOnly />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Email Address</label>
                    <input type="email" className="w-full bg-gray-50 border-transparent focus:ring-blue-500 focus:bg-white transition-all rounded-xl p-4 text-sm font-bold" value={profile?.user_details?.email || ""} readOnly />
                </div>
            </div>
            <button className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                Save Profile Changes
            </button>
        </div>
    );
}