import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function FarmerOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/farmer/orders/", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setOrders(data.map(o => ({
                    name: o.product_name,
                    id: `#${o.id}`,
                    price: `₹${o.price}`,
                    status: o.status
                })));
            }
        })
        .catch(err => console.error("Error fetching orders:", err));
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 bg-[#fcfdfa]">
                <div className="container mx-auto px-6 flex h-full"> 
                    <Sidebar />
                    <main className="flex-1 px-8 pb-8 min-w-0">
                        <header className="flex justify-between items-center mb-8">
                    <h1 className="text-[28px] font-black text-slate-900 tracking-tight">All Orders</h1>
                </header>

                <div className="bg-[#f4f7ed]/70 rounded-xl border border-slate-100 shadow-sm p-4 pt-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-separate border-spacing-y-0 text-slate-700">
                            <thead>
                                <tr className="text-[13px] font-black text-slate-800 uppercase tracking-tight">
                                    <th className="py-6 font-black">Products Name</th>
                                    <th className="py-6 font-black">Order ID</th>
                                    <th className="py-6 font-black">Price</th>
                                    <th className="py-6 font-black">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, i) => (
                                    <tr key={i} className="text-sm font-medium border-t border-slate-200">
                                        <td className="py-5 border-t border-slate-200/60">{order.name}</td>
                                        <td className="py-5 border-t border-slate-200/60">{order.id}</td>
                                        <td className="py-5 border-t border-slate-200/60 font-bold">{order.price}</td>
                                        <td className="py-5 border-t border-slate-200/60">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                                                order.status === "Shipped" 
                                                    ? "bg-[#e2f0ff] text-blue-600" 
                                                    : "bg-[#ffe8e8] text-rose-500"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-12 flex justify-end items-center gap-4 px-4 text-slate-400">
                    <ChevronLeft size={20} className="cursor-pointer hover:text-slate-600 transition-colors" />
                    <div className="flex gap-2">
                        <span className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold cursor-pointer hover:bg-slate-100">1</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black bg-blue-50 text-blue-600 border border-blue-100">2</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold cursor-pointer hover:bg-slate-100">3</span>
                    </div>
                    <ChevronRight size={20} className="cursor-pointer hover:text-slate-600 transition-colors" />
                </div>
                </main>
            </div>
        </div>
    </div>
    );
}
