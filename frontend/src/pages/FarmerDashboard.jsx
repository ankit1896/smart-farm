import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/dashboard/DashboardCard";
import {
    Package,
    ShoppingBag,
    Clock,
    ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function FarmerDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total_products: 0,
        total_sales: 0,
        pending_orders: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [salesDistribution, setSalesDistribution] = useState([]);
    const [farmerInfo, setFarmerInfo] = useState({
        farmer_name: "",
        farm_name: ""
    });

    useEffect(() => {
        fetch("http://localhost:8000/api/farmer/dashboard/", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setStats({
                    total_products: data.total_products || 0,
                    total_sales: data.total_sales || 0,
                    pending_orders: data.order_pending || 0
                });

                setFarmerInfo({
                    farmer_name: data.farmer_name,
                    farm_name: data.farm_name
                });

                if (data.recent_orders) {
                    setRecentOrders(data.recent_orders.map(o => ({
                        name: o.product_name,
                        id: o.order_id,
                        status: o.status
                    })));
                }

                if (data.trending_products) {
                    setTrendingProducts(data.trending_products.map(p => ({
                        name: p.name,
                        price: `₹${p.price}/kg`,
                        sales: p.sales,
                        image: p.image || "https://images.unsplash.com/photo-1546097759-47ad3dd6007e?w=100&h=100&fit=crop"
                    })));
                }

                if (data.revenue_growth) {
                    setRevenueData(data.revenue_growth);
                }

                if (data.products_sales) {
                    setSalesDistribution(data.products_sales);
                }
            })
            .catch(err => console.error("Error fetching dashboard data:", err));
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 bg-[#fcfdfa]">
                <div className="container mx-auto px-6 flex h-full">
                    <Sidebar />
                    <main className="flex-1 px-8 pb-8 min-w-0">
                        <header className="mb-10">
                            <h1 className="text-[28px] font-black text-slate-900 tracking-tight">
                                My Dashboard
                            </h1>

                        </header>

                        {/* Welcome section */}
                        <div className="mb-10">
                            <div className="mb-1">
                                <p className="text-[11px] font-bold text-blue-600/70 tracking-tight">
                                    {farmerInfo.farm_name || "Smart Farm Partner"} • {user?.email || "No email available"}
                                </p>
                            </div>

                            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mt-3">
                                Welcome to your <span className="font-bold text-slate-700">{farmerInfo.farm_name || "farm"}</span> dashboard.
                                Stay updated on your deliveries, manage your products, and track your revenue growth in real-time.
                            </p>
                        </div>

                        {/* Stats cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <DashboardCard
                                title="Total Products"
                                value={stats.total_products}
                                icon={<Package size={28} />}
                                bgColor="bg-[#e8f3f6]"
                            />
                            <DashboardCard
                                title="Total Sales"
                                value={stats.total_sales}
                                icon={<ShoppingBag size={28} />}
                                bgColor="bg-[#f0f9ff]"
                            />
                            <DashboardCard
                                title="Order pending"
                                value={stats.pending_orders}
                                icon={<Clock size={28} />}
                                bgColor="bg-[#eff6ef]"
                            />
                        </div>

                        {/* Charts section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Revenue Growth Chart */}
                            <div className="bg-[#f4f7ed]/70 p-6 rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-lg font-black text-slate-800">Revenue Growth</h2>
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 shadow-sm">
                                        Week <ChevronDown size={14} />
                                    </button>
                                </div>

                                {/* Dynamic Bar Chart */}
                                <div className="relative h-64 w-full mt-4 flex items-end justify-between px-2">
                                    {/* Grid lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between py-1">
                                        {[100, 80, 60, 40, 20].map(percent => (
                                            <div key={percent} className="flex items-center gap-4 w-full">
                                                <span className="text-[10px] font-bold text-slate-400 w-8">
                                                    {percent / 100 * Math.max(...revenueData.map(d => d.revenue), 1000)}
                                                </span>
                                                <div className="flex-1 h-[1px] bg-slate-200/50"></div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bars */}
                                    {(revenueData.length > 0 ? revenueData : [
                                        { day: 'Sun', revenue: 0 }, { day: 'Mon', revenue: 0 }, { day: 'Tue', revenue: 0 },
                                        { day: 'Wed', revenue: 0 }, { day: 'Thr', revenue: 0 }, { day: 'Fri', revenue: 0 }, { day: 'Sat', revenue: 0 }
                                    ]).map((bar, i) => {
                                        const maxRev = Math.max(...revenueData.map(d => d.revenue), 1000);
                                        const heightPercent = (bar.revenue / maxRev) * 100;
                                        return (
                                            <div key={i} className="relative group flex flex-col items-center gap-2 z-10 flex-1">
                                                <div
                                                    className="w-8 bg-[#52a15c] rounded-sm transition-all duration-500 group-hover:brightness-110"
                                                    style={{ height: `${heightPercent}%` }}
                                                >
                                                    {/* Tooltip */}
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        ₹{bar.revenue}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{bar.day}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Products Sales Chart */}
                            <div className="bg-[#f4f7ed]/70 p-6 rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-black text-slate-800">Products Sales</h2>
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 shadow-sm">
                                        Week <ChevronDown size={14} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center justify-center h-72">
                                    {/* Dynamic Donut Chart using SVG */}
                                    <svg className="w-52 h-52 transform -rotate-90">
                                        {salesDistribution.length > 0 ? (
                                            salesDistribution.map((item, i) => {
                                                const total = salesDistribution.reduce((acc, curr) => acc + curr.value, 0);
                                                const percentage = item.value / total;
                                                const strokeDasharray = 2 * Math.PI * 80;
                                                const strokeDashoffset = salesDistribution.slice(0, i).reduce((acc, curr) => acc + (curr.value / total), 0) * strokeDasharray;
                                                const colors = ['#1e3a8a', '#f39c12', '#52a15c', '#e11d48', '#7c3aed'];
                                                return (
                                                    <circle
                                                        key={i}
                                                        cx="104" cy="104" r="80" fill="transparent"
                                                        stroke={colors[i % colors.length]} strokeWidth="32"
                                                        strokeDasharray={`${strokeDasharray * percentage}, ${strokeDasharray * (1 - percentage)}`}
                                                        strokeDashoffset={-strokeDashoffset}
                                                        className="transition-all duration-1000"
                                                    />
                                                );
                                            })
                                        ) : (
                                            <circle cx="104" cy="104" r="80" fill="transparent" stroke="#f1f5f9" strokeWidth="32" />
                                        )}
                                    </svg>

                                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                                        {salesDistribution.map((item, i) => {
                                            const colors = ['#1e3a8a', '#f39c12', '#52a15c', '#e11d48', '#7c3aed'];
                                            const total = salesDistribution.reduce((acc, curr) => acc + curr.value, 0);
                                            const percent = ((item.value / total) * 100).toFixed(0);
                                            return (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></div>
                                                    <span className="text-[10px] font-bold text-slate-600">{item.name} <span className="text-slate-400 ml-1">{percent}%</span></span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tables Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {/* Trending Products */}
                            <div className="lg:col-span-3 bg-[#f4f7ed]/70 rounded-xl border border-slate-100 shadow-sm p-6">
                                <h2 className="text-lg font-black text-slate-800 mb-6">Trending Products</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[11px] font-black text-slate-500 uppercase tracking-tight">
                                                <th className="pb-4">Images</th>
                                                <th className="pb-4">Products Name</th>
                                                <th className="pb-4">Prices</th>
                                                <th className="pb-4">Sales</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-t border-slate-200">
                                            {trendingProducts.map((p, i) => (
                                                <tr key={i} className="text-sm font-medium border-b border-slate-200/50 hover:bg-white/50 transition-colors">
                                                    <td className="py-4">
                                                        <img src={p.image} className="w-12 h-10 rounded-md object-cover border border-slate-200 shadow-sm" alt={p.name} />
                                                    </td>
                                                    <td className="py-4 text-slate-700">{p.name}</td>
                                                    <td className="py-4 text-slate-700">{p.price}</td>
                                                    <td className="py-4 text-slate-700 font-bold">{p.sales}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="lg:col-span-2 bg-[#f4f7ed]/70 rounded-xl border border-slate-100 shadow-sm p-6">
                                <h2 className="text-lg font-black text-slate-800 mb-6">Recent Orders</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[11px] font-black text-slate-500 uppercase tracking-tight">
                                                <th className="pb-4">Products Name</th>
                                                <th className="pb-4">Order ID</th>
                                                <th className="pb-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-t border-slate-200">
                                            {recentOrders.map((o, i) => (
                                                <tr key={i} className="text-sm font-medium border-b border-slate-200/50 hover:bg-white/50 transition-colors">
                                                    <td className="py-4 text-slate-700">{o.name}</td>
                                                    <td className="py-4 text-slate-700">{o.id}</td>
                                                    <td className="py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${o.status === "Shipped" ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]"
                                                            }`}>
                                                            {o.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
