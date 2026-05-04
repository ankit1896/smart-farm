import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, MapPin, Info, CheckCircle, AlertCircle, TrendingDown, ArrowRight, X } from 'lucide-react';

const MarketComparisonWidget = ({ productId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`http://localhost:8000/api/market/compare/${productId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        console.error("Error fetching market comparison:", err);
        setError(err.response?.data?.error || "No market data available");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId]);

  if (loading) return <div className="p-4 animate-pulse bg-gray-50 rounded-xl">Analyzing market prices...</div>;
  if (error) return (
    <div className="p-6 bg-orange-50/50 backdrop-blur-sm border border-orange-100 rounded-3xl flex items-start gap-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="p-2 bg-orange-100 rounded-xl">
        <AlertCircle className="w-5 h-5 text-orange-600" />
      </div>
      <div>
        <h4 className="font-black text-orange-900 text-base">Market Insight Unavailable</h4>
        <p className="text-orange-700/80 text-sm mt-1 leading-relaxed">{error}</p>
        <button className="mt-3 text-xs font-bold text-orange-800 uppercase tracking-widest hover:underline">Retry Analysis</button>
      </div>
    </div>
  );

  const { product_name, current_price, market_data, suggestion, source, is_dairy } = data;

  const { market_name, modal_price, range } = market_data;

  const priceDiff = current_price - modal_price;
  const isCompetitive = Math.abs(priceDiff) <= (modal_price * 0.1); // within 10%
  const isLow = current_price < modal_price;

  // Gauge calculation: where does current_price sit between range[0] and range[1]
  const min = range[0] * 0.8; // show a bit below the min
  const max = range[1] * 1.2; // show a bit above the max
  const percentage = Math.min(Math.max(((current_price - min) / (max - min)) * 100, 0), 100);

  return (
    <div className="group relative bg-[#fcfdfa] rounded-[32px] overflow-hidden border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-7 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-50" />
              </div>
              <h3 className="text-lg font-black tracking-tight">
                {product_name} <span className="text-blue-200 font-medium opacity-80">| Market Insight</span>
              </h3>
            </div>

          <p className="text-blue-100/80 text-[11px] font-bold uppercase tracking-[1.5px] flex items-center gap-1.5">
            <MapPin size={12} className="text-blue-300" /> {market_name} Mandi Comparison
          </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-wider">
              {source}
            </div>
            {onClose && (
              <button 
                onClick={onClose}
                className="p-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-white transition-all active:scale-95"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Price Matrix */}
        <div className="grid grid-cols-2 gap-6">
          <div className="relative p-5 bg-emerald-50/50 rounded-[24px] border border-emerald-100 group-hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute top-4 right-4 text-emerald-500 opacity-20">
              <TrendingDown size={32} />
            </div>
            <p className="text-[10px] text-emerald-600/70 font-black uppercase tracking-wider mb-2">Mandi Modal</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-emerald-600">₹</span>
              <span className="text-3xl font-black text-emerald-900 tracking-tighter">{modal_price}</span>
              <span className="text-xs font-bold text-emerald-600/60">/kg</span>
            </div>
          </div>
          <div className="relative p-5 bg-slate-50 border border-slate-100 rounded-[24px] group-hover:scale-[1.02] transition-transform duration-300 delay-75">
            <p className="text-[10px] text-slate-500/70 font-black uppercase tracking-wider mb-2">Your Current</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-slate-400">₹</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">{current_price}</span>
              <span className="text-xs font-bold text-slate-400">/kg</span>
            </div>
          </div>
        </div>

        {/* Visual Gauge */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Pricing Gauge</p>
              <p className="text-sm font-black text-slate-800">
                {isCompetitive ? "Optimal Range" : (isLow ? "Below Market" : "Above Market")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tighter">Market Spread</p>
              <p className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 inline-block">
                ₹{range[0]} — ₹{range[1]}
              </p>
            </div>
          </div>

          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative p-0.5">
            <div className="absolute inset-y-0.5 left-0.5 right-0.5 rounded-full bg-gradient-to-r from-amber-400 via-emerald-500 to-rose-500 opacity-20"></div>
            <div
              className="absolute inset-y-0 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out"
              style={{
                left: `${Math.max(0, ((range[0] - min) / (max - min)) * 100)}%`,
                right: `${100 - Math.min(100, ((range[1] - min) / (max - min)) * 100)}%`
              }}
            ></div>
            <div
              className="absolute top-0 w-4 h-4 bg-white border-2 border-slate-900 rounded-full shadow-lg -mt-0.5 transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
              style={{ left: `calc(${percentage}% - 8px)` }}
            ></div>
          </div>
        </div>

        {/* Suggestion Card */}
        <div className={`p-5 rounded-3xl flex items-start gap-4 transition-all duration-300 ${isCompetitive ? 'bg-emerald-50/50 border border-emerald-100/50' : 'bg-amber-50/50 border border-amber-100/50'}`}>
          <div className={`p-2.5 rounded-2xl ${isCompetitive ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
            {isCompetitive ? <CheckCircle size={20} /> : <Info size={20} />}
          </div>
          <div>
            <p className={`text-sm font-black ${isCompetitive ? 'text-emerald-900' : 'text-amber-900'}`}>
              {isCompetitive ? "Listing is Competitive" : "Pricing Strategy Insight"}
            </p>
            <p className={`text-xs mt-1 leading-relaxed ${isCompetitive ? 'text-emerald-700/80' : 'text-amber-700/80'}`}>
              {suggestion}
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            {is_dairy ? "Verified by Co-op Data" : `Last Mandi Update: ${new Date().toLocaleDateString()}`}
          </p>
          <button className="flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-700 transition-all active:scale-95 group/btn">
            Optimize Listing <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketComparisonWidget;
