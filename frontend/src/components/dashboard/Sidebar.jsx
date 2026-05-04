import { useState, useEffect, useRef } from "react";
import {
    LayoutDashboard,
    ShoppingBag,
    User,
    Settings,
    LogOut,
    Package,
    ChevronRight,
    Camera
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);
    const { logout, user } = useAuth();
    const [profileImage, setProfileImage] = useState(null);
    const [farmerData, setFarmerData] = useState({
        name: user?.displayName || user?.fullname || user?.username || "Farmer",
        email: user?.email || "No email available"
    });

    const fetchProfile = () => {
        fetch("http://localhost:8000/api/farmer/dashboard/", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.farmer_profile) {
                    setProfileImage(data.farmer_profile.image_url);
                    setFarmerData({
                        name: data.farmer_profile.farmer_name,
                        email: data.farmer_profile.email
                    });
                }
            })
            .catch(err => console.error("Error fetching sidebar profile:", err));
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("http://localhost:8000/api/farmer/profile/update/", {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                },
                body: formData
            });

            if (response.ok) {
                fetchProfile(); // Refresh image
            } else {
                console.error("Failed to upload image");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/farmer/dashboard" },
        { icon: <ShoppingBag size={20} />, label: "Order", path: "/farmer/orders" },
        { icon: <Package size={20} />, label: "Products", path: "/farmer/products" },
        { icon: <User size={20} />, label: "Profile", path: "/farmer/profile" },
        { icon: <Settings size={20} />, label: "Setting", path: "/farmer/settings" },
    ];

    return (
        <aside className="w-72 bg-[#f4f7ed] flex flex-col h-screen sticky top-0 border-r border-slate-200/50">
            {/* Profile Header Block */}
            <div className="relative mb-6">
                {/* Polygon/Gradient Background */}
                <div className="h-32 w-full bg-gradient-to-br from-fuchsia-500 via-purple-600 to-blue-700 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                </div>

                {/* Avatar Container */}
                <div className="flex flex-col items-center -mt-12 relative px-4 text-center">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                            <img
                                src={profileImage || "https://images.unsplash.com/photo-1595033538458-3560674619b4?w=400&h=400&fit=crop"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={handleImageClick}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                            <Camera size={14} />
                        </button>
                    </div>

                    <h2 className="mt-3 text-lg font-black text-slate-800 leading-tight">
                        {farmerData.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        {farmerData.email}
                    </p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 space-y-1 mt-4">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-none transition-all duration-300 border-l-4 ${location.pathname === item.path
                                ? "bg-[#e2f0ff] text-blue-600 border-blue-600 font-black"
                                : "text-slate-600 border-transparent hover:bg-slate-100/50 font-bold"
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <span className={location.pathname === item.path ? "text-blue-600" : "text-slate-400"}>
                                {item.icon}
                            </span>
                            <span className="text-sm tracking-tight">{item.label}</span>
                        </div>
                        {location.pathname === item.path && <ChevronRight size={14} className="text-blue-600/50" />}
                    </button>
                ))}
            </nav>

            {/* Logout at bottom */}
            <div className="p-6">
                <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            </div>
        </aside>
    );
}
