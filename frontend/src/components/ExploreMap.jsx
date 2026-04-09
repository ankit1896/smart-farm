import { useState } from "react";

export default function ExploreMap() {
    const [searchQuery, setSearchQuery] = useState("farms");
    const [inputValue, setInputValue] = useState("");

    const handleSearch = () => {
        if (inputValue.trim()) {
            setSearchQuery(inputValue.trim() + " farms");
        }
    };

    return (
        <div className="container mx-auto px-6 mt-16 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Explore Farm Near You</h3>

            <div className="w-full h-[450px] md:h-[550px] rounded-2xl overflow-hidden shadow-lg border-4 border-white relative bg-gray-100 ring-1 ring-gray-200">

                {/* Search Overlay overlayed on top of the live map */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[60%] bg-white p-2 pl-4 rounded-xl shadow-2xl flex items-center justify-between z-10 border border-gray-100">
                    <span className="text-xl mr-3 opacity-60 pointer-events-none drop-shadow-sm">📍</span>
                    <input
                        type="text"
                        placeholder="Enter your location (e.g., Pune, Delhi)..."
                        className="w-full bg-transparent outline-none text-[15px] font-medium text-gray-700 placeholder:font-normal placeholder:opacity-60"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch();
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-green-600 hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-white px-6 py-2.5 rounded-lg text-sm font-semibold ml-2 shrink-0 drop-shadow-sm"
                    >
                        Search
                    </button>
                </div>

                {/* Live Interactive Map iframe */}
                <iframe
                    title="Live Explore Farms Map"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    className="border-0 w-full h-full"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    );
}
