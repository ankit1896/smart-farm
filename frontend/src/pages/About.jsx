import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Leaf, ShieldCheck, Cpu, Globe, Users, ArrowRight } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-[#F0F2F5] font-sans flex flex-col">
            <Navbar />
            
            <main className="flex-grow pt-10 pb-20">
                {/* Hero Section */}
                <div className="bg-white border-b border-gray-100 overflow-hidden mb-12">
                    <div className="max-w-7xl mx-auto px-6 py-24 relative">
                        <div className="relative z-10 max-w-2xl">
                            <h1 className="text-5xl font-black text-gray-900 leading-tight mb-6 animate-in fade-in slide-in-from-left duration-700">
                                Bridging the gap between <span className="text-green-600">Farms</span> and your <span className="text-blue-600">Table</span>.
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed mb-10 animate-in fade-in slide-in-from-left duration-1000">
                                Smart Farm is more than just a marketplace. We're a technology-driven ecosystem 
                                empowering small-scale farmers and providing urban families with the 
                                freshest, organic produce direct from the source.
                            </p>
                            <button className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center gap-3 group">
                                Learn More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        
                        {/* Abstract Background Decoration */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-green-50 rounded-full blur-3xl opacity-50 z-0"></div>
                        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-30 z-0"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    {/* Mission Cards */}
                    <div className="grid md:grid-cols-3 gap-8 mb-24">
                        {[
                            {
                                icon: <Leaf className="text-green-600" size={32} />,
                                title: "100% Organic",
                                desc: "We exclusively partner with farmers who practice sustainable, chemical-free agriculture."
                            },
                            {
                                icon: <ShieldCheck className="text-blue-600" size={32} />,
                                title: "Verified Quality",
                                desc: "Every product undergoes rigorous quality checks before it reaches your delivery box."
                            },
                            {
                                icon: <Cpu className="text-purple-600" size={32} />,
                                title: "Smart Logistics",
                                desc: "Our AI-driven supply chain ensures zero-waste and the fastest possible delivery times."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stats Section */}
                    <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-white mb-24 relative overflow-hidden">
                        <div className="grid md:grid-cols-4 gap-12 relative z-10 text-center">
                            <div>
                                <h4 className="text-5xl font-black mb-2 tracking-tighter text-green-400">5k+</h4>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Active Farmers</p>
                            </div>
                            <div>
                                <h4 className="text-5xl font-black mb-2 tracking-tighter text-blue-400">120k</h4>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Happy Customers</p>
                            </div>
                            <div>
                                <h4 className="text-5xl font-black mb-2 tracking-tighter text-yellow-400">50+</h4>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Cities Covered</p>
                            </div>
                            <div>
                                <h4 className="text-5xl font-black mb-2 tracking-tighter text-purple-400">100%</h4>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Zero Waste Goal</p>
                            </div>
                        </div>
                        
                        {/* Decoration */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10">
                            <Globe size={1000} className="text-white animate-spin-slow" />
                        </div>
                    </div>

                    {/* Our Team / Values */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative rounded-[3rem] overflow-hidden group shadow-2xl">
                             <img 
                                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800" 
                                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110" 
                                alt="Farm" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                            <div className="absolute bottom-10 left-10">
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 inline-block">Established 2024</span>
                                <h3 className="text-3xl font-black text-white">Cultivating the Future</h3>
                            </div>
                        </div>
                        <div className="pl-6">
                            <h2 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Meet our community of <Users className="inline-block text-green-600 mb-1" size={36} /> Sustainable Farmers</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                We work hand-in-hand with multi-generational farming families in remote 
                                regions across the country, providing them with advanced soil-testing 
                                technology and fair-market access they never had before.
                            </p>
                            <p className="text-gray-600 mb-10 leading-relaxed">
                                Our platform ensures they receive **fair trade prices** and **instant payments**, 
                                allowing them to focus on what they do best: growing the finest produce 
                                our earth can offer.
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-[#E8F0FE] text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all">Support a Farmer</button>
                                <button className="flex items-center gap-2 font-bold text-gray-600 hover:text-green-600 transition-colors">Join as a Partner <ArrowRight size={18} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
