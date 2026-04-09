import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function FarmerProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        farmName: "Green Vally",
        farmerName: user?.fullname || user?.username || "Rajesh Patil",
        email: user?.email || "Rajesh@gmail.com",
        country: "India",
        state: "Jharkhand",
        yearEstablished: "2024",
        totalEmployees: "40",
        address: "Suriya, Giridih, Jharhknad, 825320"
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [message, setMessage] = useState({ type: "", text: "" });

    const fetchProfile = () => {
        fetch("http://localhost:8000/api/farmer/dashboard/", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.farmer_profile) {
                const fp = data.farmer_profile;
                const profileData = {
                    farmName: fp.farm_name,
                    farmerName: fp.farmer_name,
                    email: fp.email,
                    phone: fp.phone,
                    location: fp.location,
                    memberSince: fp.date_joined,
                    sellerSince: fp.seller_since_yrs > 0 ? `${fp.seller_since_yrs} years` : "New Seller"
                };
                setProfile(profileData);
                setEditForm(profileData);
            }
        })
        .catch(err => console.error("Error fetching profile:", err));
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/farmer/profile/update/", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                },
                body: JSON.stringify({
                    farmer_name: editForm.farmerName,
                    farm_name: editForm.farmName,
                    email: editForm.email,
                    phone: editForm.phone,
                    location: editForm.location
                })
            });

            if (response.ok) {
                setMessage({ type: "success", text: "Profile updated successfully!" });
                setIsEditing(false);
                fetchProfile();
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
            } else {
                setMessage({ type: "error", text: "Failed to update profile." });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: "error", text: "An error occurred." });
        }
    };

    const profileFields = [
        { key: "farmName", label: "Farm Name :", value: profile.farmName },
        { key: "farmerName", label: "Farmer Name :", value: profile.farmerName },
        { key: "email", label: "Email Address :", value: profile.email },
        { key: "phone", label: "Phone Number :", value: profile.phone },
        { key: "location", label: "Location :", value: profile.location },
        { key: "memberSince", label: "Member Since :", value: profile.memberSince, readOnly: true },
        { key: "sellerSince", label: "Seller Experience :", value: profile.sellerSince, readOnly: true },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 bg-[#fcfdfa]">
                <div className="container mx-auto px-6 flex h-full">
                    <Sidebar />
                    <main className="flex-1 px-8 pb-8 min-w-0">
                        <header className="mb-10">
                            <h1 className="text-[28px] font-black text-slate-900 tracking-tight">My Profile</h1>
                        </header>

                        <div className="bg-[#f4f7ed]/70 rounded-3xl border border-slate-100 shadow-sm p-10 relative">
                            {message.text && (
                                <div className={`absolute top-4 right-10 px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${
                                    message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-10">
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">Profile Details</h2>
                                {!isEditing ? (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="px-5 py-2 bg-rose-500 text-white rounded-lg font-bold text-[13px] hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="px-5 py-2 bg-slate-200 text-slate-600 rounded-lg font-bold text-[13px] hover:bg-slate-300 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSave}
                                            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold text-[13px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                {profileFields.map((field, i) => (
                                    <div key={i} className="flex items-center max-w-2xl">
                                        <label className="w-48 text-sm font-bold text-slate-600">{field.label}</label>
                                        {isEditing && !field.readOnly ? (
                                            <input
                                                type="text"
                                                value={editForm[field.key] || ""}
                                                onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                                                className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                        ) : (
                                            <span className="flex-1 text-sm font-black text-slate-800">{field.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
