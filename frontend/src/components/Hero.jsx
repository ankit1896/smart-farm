export default function Hero() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-6">
            {/* Left - 70% */}
            <div className="md:col-span-7 bg-green-600 text-white p-8 rounded-2xl flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    Reach Local farmers near you,<br />
                    faster and Smarter!
                </h2>

                <p className="mb-8 text-lg opacity-90 max-w-lg">
                    Order fresh vegetables directly from local farms. Support your community and eat healthier.
                </p>

                <div className="flex gap-4">
                    <button className="bg-[#1a73e8] hover:bg-blue-700 transition px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20">
                        Order Now
                    </button>
                    <button className="border-2 border-white/30 hover:bg-white/10 transition px-8 py-3 rounded-xl font-bold">
                        Pre-Order
                    </button>
                </div>
            </div>

            {/* Right - 30% */}
            <div className="md:col-span-3 bg-green-50 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-green-200 min-h-[300px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2ecc71 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="bg-white p-4 rounded-full shadow-lg mb-4 relative z-10 text-3xl">📍</div>
                <p className="text-lg font-black text-green-800 tracking-tight relative z-10">Farm Near You</p>
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest mt-1 relative z-10">Interactive Map</p>
            </div>
        </div>
    );
}