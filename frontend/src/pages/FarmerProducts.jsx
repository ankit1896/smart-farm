import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight, Pencil, Trash2, Plus, TrendingUp, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import MarketComparisonWidget from "../components/dashboard/MarketComparisonWidget";

export default function FarmerProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "", price: "", stock: "", category_id: "", weight: "", is_organic: false
    });
    const [image, setImage] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [commodities, setCommodities] = useState({ vegetables: [], fruits: [], dairy: [], others: [] });

    const fetchAllData = () => {
        const headers = { "Authorization": `Bearer ${localStorage.getItem("access_token")}` };
        
        fetch("http://127.0.0.1:8000/api/farmer/products/", { headers })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setProducts(data.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: `₹${p.price}/${p.weight || 'item'}`,
                    stocks: p.stock || 0,
                    sales: p.sales_count || 0,
                    image: p.image_url || "https://images.unsplash.com/photo-1546097759-47ad3dd6007e?w=100&h=100&fit=crop"
                })));
            }
        })
        .catch(err => console.error("Error fetching products:", err));

        fetch("http://127.0.0.1:8000/api/categories/", { headers })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setCategories(data);
        })
        .catch(err => console.error("Error fetching categories:", err));

        fetch("http://127.0.0.1:8000/api/commodities/", { headers })
        .then(res => res.json())
        .then(data => {
            console.log("Commodities fetched:", data);
            if (data && typeof data === 'object') setCommodities(data);
        })
        .catch(err => console.error("Error fetching commodities:", err));
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newProduct).forEach(key => formData.append(key, newProduct[key]));
        if (image) formData.append('image_url', image);

        try {
            const res = await fetch("http://localhost:8000/api/farmer/products/", {
                method: "POST",
                headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` },
                body: formData
            });
            if (res.ok) {
                setIsAddModalOpen(false);
                setNewProduct({ name: "", price: "", stock: "", category_id: "", weight: "", is_organic: false });
                setImage(null);
                fetchAllData();
                setIsSyncing(true);
                // Auto-sync the market data for the new product quietly
                fetch("http://localhost:8000/api/market/sync/", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
                }).then(() => setIsSyncing(false)).catch(() => setIsSyncing(false));
            } else {
                const errData = await res.json();
                alert("Error: " + JSON.stringify(errData));
            }
        } catch (err) {
            console.error("Error adding product:", err);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        
        try {
            const res = await fetch(`http://localhost:8000/api/farmer/products/${id}/`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
            });
            if (res.ok) {
                // If the product being deleted is currently open in the market widget, close it
                if (selectedProductId === id) setSelectedProductId(null);
                fetchAllData();
            } else {
                alert("Failed to delete product.");
            }
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch("http://localhost:8000/api/market/sync/", {
                method: "POST",
                headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
            });
            const data = await res.json();
            alert(data.message || "Sync started!");
            fetchAllData(); 
        } catch (err) {
            console.error("Sync error:", err);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 bg-[#fcfdfa] flex">
                <div className="container mx-auto px-6 flex flex-1"> 
                    <Sidebar />
                    <main className="flex-1 px-8 pb-8 min-w-0 overflow-y-auto">
                        <header className="flex justify-between items-center mb-8 py-4">
                            <h1 className="text-[28px] font-black text-slate-900 tracking-tight">All Products</h1>
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleSync}
                                    disabled={isSyncing}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                >
                                    <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                                    {isSyncing ? "Syncing..." : "Sync Market Prices"}
                                </button>
                                <button 
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                                >
                                    <Plus size={20} />
                                    Add Product
                                </button>
                            </div>
                        </header>

                        {selectedProductId && (
                            <div className="mb-8 relative animate-in fade-in slide-in-from-top-4 duration-300">
                                <MarketComparisonWidget 
                                    productId={selectedProductId} 
                                    onClose={() => setSelectedProductId(null)} 
                                />
                            </div>
                        )}

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
                                            <tr key={i} className="text-sm font-medium border-t border-slate-200 hover:bg-white/50 transition-colors">
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
                                                        <button 
                                                            onClick={() => setSelectedProductId(p.id === selectedProductId ? null : p.id)}
                                                            className={`p-1.5 transition-colors ${selectedProductId === p.id ? 'text-emerald-600 bg-emerald-50 rounded-lg' : 'text-slate-400 hover:text-emerald-600'}`}
                                                            title="Market Insight"
                                                        >
                                                            <TrendingUp size={18} />
                                                        </button>
                                                        <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteProduct(p.id)}
                                                            className="p-1.5 text-rose-300 hover:text-rose-500 transition-colors"
                                                            title="Delete Product"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {products.length === 0 && (
                                    <div className="py-12 text-center text-slate-400 font-medium">
                                        No products found. Add your first product to get started!
                                    </div>
                                )}
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

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-slate-700">
                        <div className="bg-blue-600 p-6 text-white text-center">
                            <h2 className="text-xl font-black">Add New Product</h2>
                            <p className="text-blue-100 text-sm mt-1">Fill in the details to list your harvest on Smart Farm.</p>
                        </div>
                        
                        <form onSubmit={handleAddProduct} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Category</label>
                                    <select 
                                        required
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Product Name</label>
                                    <input 
                                        type="text" required
                                        list="commodity-names"
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                        placeholder={!newProduct.category_id ? "Select category first..." : "e.g. Fresh Potato"}
                                        disabled={!newProduct.category_id}
                                    />
                                    <datalist id="commodity-names">
                                        {( () => {
                                            const catName = categories.find(c => c.id == newProduct.category_id)?.name || "";
                                            let list = [];
                                            if (catName.toLowerCase().includes('veg')) list = commodities.vegetables;
                                            else if (catName.toLowerCase().includes('fruit')) list = commodities.fruits;
                                            else if (catName.toLowerCase().includes('dairy')) list = commodities.dairy;
                                            else list = commodities.others;
                                            
                                            return (list || []).map((comm, idx) => (
                                                <option key={idx} value={comm}>{comm}</option>
                                            ));
                                        })()}
                                    </datalist>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Price (₹)</label>
                                    <input 
                                        type="number" required
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Weight (e.g. kg)</label>
                                    <input 
                                        type="text" required
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={newProduct.weight} onChange={e => setNewProduct({...newProduct, weight: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Stock</label>
                                    <input 
                                        type="number" required
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Image</label>
                                    <input 
                                        type="file" accept="image/*"
                                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={e => setImage(e.target.files[0])}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button" onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-5 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                >
                                    Create Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
