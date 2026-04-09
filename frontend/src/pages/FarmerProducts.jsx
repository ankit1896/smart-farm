import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight, Pencil, Trash2, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function FarmerProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/farmer/products/", { 
            headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setProducts(data.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: `₹${p.price}/${p.weight || 'item'}`,
                    stocks: p.stock || 0, // Assuming stock field exists or default to 0
                    sales: p.sales_count || 0, // Assuming sales_count field exists
                    image: p.image_url || "https://images.unsplash.com/photo-1546097759-47ad3dd6007e?w=100&h=100&fit=crop"
                })));
            }
        })
        .catch(err => console.error("Error fetching products:", err));
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 bg-[#fcfdfa]">
                <div className="container mx-auto px-6 flex h-full"> 
                    <Sidebar />
                    <main className="flex-1 px-8 pb-8 min-w-0">
                        <header className="flex justify-between items-center mb-8">
                            <h1 className="text-[28px] font-black text-slate-900 tracking-tight">All Products</h1>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
                                <Plus size={20} />
                                Add Product
                            </button>
                        </header>

                <div className="bg-[#f4f7ed]/70 rounded-xl border border-slate-100 shadow-sm p-4 pt-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-separate border-spacing-y-0 text-slate-700">
                            <thead>
                                <tr className="text-[13px] font-black text-slate-800 uppercase tracking-tight">
                                    <th className="py-6 font-black">Image</th>
                                    <th className="py-6 font-black">Products Name</th>
                                    <th className="py-6 font-black">Price</th>
                                    <th className="py-6 font-black">Stocks</th>
                                    <th className="py-6 font-black">Sales</th>
                                    <th className="py-6 font-black">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p, i) => (
                                    <tr key={i} className="text-sm font-medium border-t border-slate-200">
                                        <td className="py-4 border-t border-slate-200/60">
                                            <div className="flex justify-center">
                                                <img src={p.image} className="w-12 h-10 rounded-md object-cover border border-slate-200 shadow-sm" alt={p.name} />
                                            </div>
                                        </td>
                                        <td className="py-4 border-t border-slate-200/60">{p.name}</td>
                                        <td className="py-4 border-t border-slate-200/60 font-bold">{p.price}</td>
                                        <td className="py-4 border-t border-slate-200/60">{p.stocks}</td>
                                        <td className="py-4 border-t border-slate-200/60 font-bold">{p.sales}</td>
                                        <td className="py-4 border-t border-slate-200/60">
                                            <div className="flex items-center justify-center gap-3">
                                                <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                                                    <Pencil size={18} />
                                                </button>
                                                <button className="p-1.5 text-rose-300 hover:text-rose-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
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
