import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/Navbar";
import { Bell, Shield, Smartphone, Globe, Mail, LogOut } from "lucide-react";

export default function FarmerSettings() {
    const [deleteReason, setDeleteReason] = useState("");

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 bg-[#fcfdfa]">
                <div className="container mx-auto px-6 flex h-full">
                    <Sidebar />
                    <main className="flex-1 px-8 pb-8 min-w-0">
                        <header className="mb-10">
                            <h1 className="text-[28px] font-black text-slate-900 tracking-tight">My Setting</h1>
                        </header>

                        <div className="space-y-8">
                            {/* Delete Account Section */}
                    <div className="bg-[#f4f7ed]/70 rounded-3xl border border-slate-100 shadow-sm p-8 max-w-4xl">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight mb-6">Delete Account</h2>
                        <div className="space-y-4 mb-8">
                            {[
                                { id: 'unusable', label: 'No longer usable' },
                                { id: 'switch', label: 'Want to switch to other account' },
                                { id: 'delete-other', label: 'other' }
                            ].map((opt) => (
                                <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="radio" 
                                        name="delete"
                                        value={opt.id}
                                        checked={deleteReason === opt.id}
                                        onChange={(e) => setDeleteReason(e.target.value)}
                                        className="w-5 h-5 border-2 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
                            Save Changes
                        </button>
                    </div>
                </div>
                </main>
            </div>
        </div>
    </div>
    );
}
