import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { MapPin, ChevronDown, Search, Heart, ShoppingCart, User, Menu, PercentSquare, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { cartCount } = useCart();

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-white w-full border-b border-gray-100 shadow-sm font-sans">
            <div className="container mx-auto px-6 py-4">

                {/* ---------- TOP ROW ---------- */}
                <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-6 mb-8">

                    {/* LOGO */}
                    <Link to="/home" className="flex items-center gap-2 relative min-w-[160px] hover:opacity-80 transition-opacity">
                        <div className="relative flex items-center justify-center w-8 h-8 mr-1">
                            {/* A stylized green cart with a leaf */}
                            <ShoppingCart size={32} className="text-green-500 absolute" strokeWidth={2} />
                            <span className="text-xl text-green-600 absolute -top-3 -right-2 transform rotate-12">🌱</span>
                        </div>
                        <h1 className="text-[22px] font-bold text-blue-600 tracking-tight">Smart Farm</h1>
                    </Link>

                    {/* SEARCH & LOCATION */}
                    <div className="flex w-full md:flex-1 items-center gap-4 flex-col md:flex-row md:pl-8">

                        {/* Location Selector */}
                        <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2.5 hover:border-green-500 cursor-pointer min-w-max transition text-gray-500 bg-white">
                            <MapPin size={16} className="text-green-500" />
                            <span className="text-sm font-medium">Your Location</span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>

                        {/* Search Bar */}
                        <div className="flex w-full items-center border border-gray-300 rounded-full px-4 py-2.5 hover:border-gray-400 transition bg-white">
                            <Search size={18} className="text-gray-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Search Products"
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* RIGHT ICONS */}
                    <div className="flex items-center justify-end gap-5 text-gray-500 min-w-[150px] ml-4">
                        <button className="hover:text-green-600 transition transform hover:scale-105">
                            <Heart size={26} strokeWidth={1.5} />
                        </button>
                        <span className="text-gray-300 font-light text-2xl mb-1">|</span>
                        <Link to="/cart" className="relative hover:text-green-600 transition transform hover:scale-105">
                            <ShoppingCart size={26} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <span className="text-gray-300 font-light text-2xl mb-1">|</span>
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => {
                                    if (isAuthenticated) {
                                        setIsProfileOpen(!isProfileOpen);
                                    } else {
                                        navigate("/");
                                    }
                                }}
                                className="flex hover:text-green-600 transition transform hover:scale-105"
                                title={isAuthenticated ? `Hi, ${user?.displayName}` : "Login"}
                            >
                                <div className="flex items-center gap-2">
                                    {isAuthenticated && (
                                        <span className="text-sm font-bold text-gray-700">
                                            Hi, {user?.displayName}
                                        </span>
                                    )}
                                    <User size={26} strokeWidth={1.5} />
                                </div>
                            </button>

                            {/* Profile Dropdown */}
                            {isAuthenticated && isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-[200px] bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden font-sans">
                                    <div className="py-3 px-4 border-b border-gray-50 bg-green-50/50">
                                        <p className="text-sm font-bold text-gray-800 truncate">Hi, {user?.displayName}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Welcome back!</p>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            onClick={() => { navigate('/dashboard'); setIsProfileOpen(false); }}
                                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition font-medium"
                                        >
                                            <UserCircle size={16} /> Dashboard View
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-100 font-medium"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* ---------- BOTTOM ROW ---------- */}
                <div className="hidden md:flex justify-between items-center px-1">

                    {/* Categories Button */}
                    <button className="bg-[#1a73e8] text-white flex items-center gap-3 px-6 py-2.5 rounded-full font-medium text-sm hover:bg-blue-700 transition shadow-sm">
                        <Menu size={18} />
                        All Categories
                    </button>

                    {/* Navigation Links */}
                    <div className="flex gap-10 font-bold text-gray-700 text-[15px]">
                        <Link to="/home" className="hover:text-green-600 transition text-gray-800">Home</Link>
                        <Link to="/home" className="hover:text-green-600 transition">Products</Link>
                        <Link to="/pre-order" className="hover:text-green-600 transition">Pre-Order</Link>
                        <Link to="/about" className="hover:text-green-600 transition">About</Link>
                        <Link to="/contact" className="hover:text-green-600 transition">Contact</Link>
                    </div>

                    {/* Deals Button */}
                    <button className="flex items-center gap-2 bg-cyan-50 text-cyan-500 px-5 py-2 rounded-full font-bold text-sm hover:bg-cyan-100 transition border border-cyan-100/50">
                        <div className="bg-cyan-500 rounded-full p-1 drop-shadow-sm">
                            <PercentSquare size={12} className="text-white" fill="currentColor" />
                        </div>
                        Sessional Deals
                    </button>

                </div>

            </div>
        </nav>
    );
}