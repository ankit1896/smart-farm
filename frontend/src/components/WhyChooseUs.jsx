import { Leaf, Truck, ShieldCheck, HeadphonesIcon, BadgePercent } from "lucide-react";

export default function WhyChooseUs() {
    const features = [
        { icon: <Leaf size={28} className="text-green-600" />, title: "100% Organic", desc: "No chemicals or pesticides" },
        { icon: <Truck size={28} className="text-blue-500" />, title: "Farm to Door", desc: "Direct speedy delivery" },
        { icon: <ShieldCheck size={28} className="text-emerald-500" />, title: "Verified Farms", desc: "Strict quality checks" },
        { icon: <BadgePercent size={28} className="text-amber-500" />, title: "Best Prices", desc: "No middleman margins" },
        { icon: <HeadphonesIcon size={28} className="text-purple-500" />, title: "24/7 Support", desc: "Always here for you" }
    ];

    return (
        <div className="mt-16 mb-8">
            <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Why Choose Smart Farm?</h3>
                <p className="text-gray-500 max-w-xl mx-auto text-sm">We connect you directly with local farmers to ensure the highest quality produce at the fairest prices.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                {features.map((feature, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all group hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-green-50 transition-all">
                            {feature.icon}
                        </div>
                        <h4 className="font-bold text-gray-800 text-[14px] md:text-[15px] mb-1">{feature.title}</h4>
                        <p className="text-[11px] md:text-[12px] text-gray-500 leading-snug">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
