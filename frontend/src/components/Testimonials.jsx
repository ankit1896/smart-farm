import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
    return (
        <div className="container mx-auto px-6 mt-16 pb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">What Our Customers Says</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                    { name: "Anjali", role: "Regular Customer", text: "Fresh produce every time! I love the interface." },
                    { name: "Akshay Sharma", role: "Wholesaler", text: "Quality is unmatched. Reaching farmers directly has cut down my costs significantly." },
                    { name: "Pooja Desai", role: "Chef", text: "The pre-order option helps me plan my restaurant's menu effectively." }
                ].map((item, i) => (
                    <div key={i} className="bg-green-50 p-6 rounded-2xl relative shadow-sm border border-green-100 hover:shadow-md transition">
                        <Quote className="text-green-500 w-10 h-10 mb-4 opacity-50 absolute right-4 top-4" />
                        <p className="text-gray-600 mb-6 italic z-10 relative">"{item.text}"</p>
                        <div className="flex items-center gap-4">
                            <img src={`https://i.pravatar.cc/150?img=${i + 15}`} alt={item.name} className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                                <p className="text-xs text-gray-500">{item.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center gap-4">
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition shadow-md shadow-green-200"><ChevronLeft size={24} /></button>
                <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><div className="w-2 h-2 rounded-full bg-gray-300"></div><div className="w-2 h-2 rounded-full bg-gray-300"></div></div>
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition shadow-md shadow-green-200"><ChevronRight size={24} /></button>
            </div>
        </div>
    );
}
