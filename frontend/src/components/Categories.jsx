import { useState, useEffect } from "react";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/categories/")
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="mt-10">
            <h3 className="text-xl font-bold mb-4 font-sans">Browse By Category</h3>

            {loading ? (
                <div className="flex justify-center items-center h-20">
                    <p className="text-gray-400 text-sm animate-pulse">Loading categories...</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-4">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className="bg-green-50 p-6 rounded-2xl flex justify-between items-center hover:bg-green-100 transition-colors cursor-pointer border border-green-100 group shadow-sm hover:shadow-md"
                        >
                            <span className="font-bold text-green-800">{cat.name}</span>
                            <span className="text-green-500 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}