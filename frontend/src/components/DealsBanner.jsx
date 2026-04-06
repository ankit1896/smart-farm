export default function DealsBanner() {
    return (
        <div className="mt-12 bg-green-50 rounded-2xl overflow-hidden shadow-sm border border-green-100">
            <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
                <div className="md:w-1/2 mb-6 md:mb-0">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase mb-4 inline-block">Limited Time Offer</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">Peak Season Deals:<br/><span className="text-green-600">Don't Miss Out!</span></h2>
                    <p className="text-gray-600 mb-6 text-[15px] leading-relaxed">Get up to 40% off on bulk orders of fresh, organic vegetables directly from our verified local farms.</p>
                    <button className="bg-[#1a73e8] hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                        Shop Deals Now
                    </button>
                </div>
                <div className="md:w-1/2 flex justify-center md:justify-end">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-green-200 rounded-xl transform rotate-3 scale-105 transition-transform duration-300 group-hover:rotate-6"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" 
                            alt="Fresh Produce Basket" 
                            className="relative rounded-xl shadow-lg w-full max-w-[350px] h-[220px] object-cover border-4 border-white transform transition-transform duration-300"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
