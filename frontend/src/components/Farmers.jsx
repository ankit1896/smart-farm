import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

export default function Farmers() {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/farmers/")
            .then(res => res.json())
            .then(data => {
                setFarmers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching farmers:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="mt-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Our Community</span>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Top Farmers Of This Week</h3>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48 bg-white rounded-[2rem] border border-gray-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {farmers.map((farmer, i) => (
                        <div key={i} className="bg-white group rounded-[2.5rem] p-6 border border-gray-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 text-center flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white relative z-10">
                                    <img
                                        src={farmer.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={farmer.name}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-blue-100 rounded-full scale-110 -z-10 group-hover:scale-125 transition-transform duration-500 opacity-50"></div>
                            </div>

                            <div className="flex-1 space-y-1">
                                <h4 className="text-lg font-black text-gray-900 tracking-tight flex items-center justify-center gap-2">
                                    {farmer.farm_name || farmer.name}
                                    {farmer.is_verified && <span className="text-blue-500" title="Verified Farmer">✔</span>}
                                </h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Star size={12} className="text-amber-400 fill-amber-400" /> {farmer.rating} • {farmer.location}
                                </p>
                            </div>

                            <button
                                onClick={() => navigate(`/farmer/${farmer.id}`)}
                                className="mt-6 w-full py-3 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 border border-gray-100 group-hover:border-transparent group-hover:shadow-lg"
                            >
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}