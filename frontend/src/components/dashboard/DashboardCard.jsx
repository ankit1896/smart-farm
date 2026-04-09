export default function DashboardCard({ title, value, icon, bgColor }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all flex items-center gap-5 group">
            <div className={`${bgColor} w-14 h-14 rounded-lg flex items-center justify-center text-blue-600 transition-transform group-hover:scale-105 duration-300`}>
                {icon}
            </div>
            
            <div>
                <p className="text-slate-500 text-[13px] font-bold mb-0.5">{title}</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
            </div>
        </div>
    );
}
