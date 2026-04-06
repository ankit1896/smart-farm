import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ArrowRight, Globe, Share2 } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thanks for reaching out! Our team will get back to you within 24 hours.");
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] font-sans flex flex-col">
            <Navbar />
            
            <main className="flex-grow pt-16 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    
                    {/* Header Section */}
                    <div className="text-center mb-16 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-700">
                        <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Let's grow <span className="text-green-600">together</span>.</h1>
                        <p className="text-lg text-gray-600 leading-relaxed text-balance">
                            Have questions about our produce, partnership opportunities, or just want to say hi? 
                            We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        
                        {/* Contact Info - 5 Columns */}
                        <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                            
                            {/* Detailed Info Cards */}
                            <div className="grid gap-4">
                                {[
                                    { 
                                        icon: <Mail className="text-blue-600" />, 
                                        label: "Email Us", 
                                        value: "hello@smartfarm.com", 
                                        desc: "Support and Inquiries" 
                                    },
                                    { 
                                        icon: <Phone className="text-green-600" />, 
                                        label: "Call Support", 
                                        value: "+91 98765 43210", 
                                        desc: "Mon - Sat, 9am - 6pm" 
                                    },
                                    { 
                                        icon: <MapPin className="text-red-500" />, 
                                        label: "Our Head Office", 
                                        value: "Farm-Tech District, Suite 402", 
                                        desc: "Mumbai, Maharashtra 400001" 
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-5 hover:border-blue-100 transition-all group">
                                        <div className="bg-gray-50 p-4 rounded-2xl group-hover:bg-blue-50 transition-colors">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className="text-lg font-bold text-gray-900 mb-1">{item.value}</p>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Additional Help Section */}
                            <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black mb-4">Quick Support</h3>
                                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                        Visit our Help Center for instant answers to frequently asked questions 
                                        about deliveries, farming practices, and orders.
                                    </p>
                                    <button className="flex items-center gap-2 font-bold text-green-400 hover:text-green-300 transition-colors">
                                        Visit Help Center <ArrowRight size={18} />
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 p-8 opacity-20">
                                    <MessageSquare size={120} />
                                </div>
                            </div>

                            {/* Social Presence */}
                            <div className="flex items-center gap-4 pl-4">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-4">Follow us</span>
                                {[Globe, Share2, Globe].map((Icon, idx) => (
                                    <button key={idx} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all">
                                        <Icon size={20} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form - 7 Columns */}
                        <div className="lg:col-span-7 animate-in fade-in slide-in-from-right duration-1000">
                            <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-gray-200 border border-gray-100 relative group overflow-hidden">
                                
                                {/* Background Accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[10rem] transition-all group-hover:w-40 group-hover:h-40"></div>
                                
                                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Full Name</label>
                                            <input 
                                                required
                                                type="text" 
                                                placeholder="e.g. Pratap Singh"
                                                className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Email Identity</label>
                                            <input 
                                                required
                                                type="email" 
                                                placeholder="name@email.com"
                                                className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Subject</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="What's this about?"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Your Message</label>
                                        <textarea 
                                            required
                                            rows={5} 
                                            placeholder="Tell us what's on your mind..."
                                            className="w-full bg-gray-50 border-none rounded-[2rem] p-6 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        ></textarea>
                                    </div>

                                    <div className="pt-4">
                                        <button 
                                            type="submit"
                                            className="w-full bg-gray-900 text-white rounded-[1.5rem] py-5 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#1a73e8] transition-all shadow-xl shadow-gray-200 active:scale-95 group"
                                        >
                                            Send Message <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <p className="text-center text-[10px] text-gray-400 mt-6 flex items-center justify-center gap-2">
                                            <Clock size={12} /> We typically respond in under 24 hours
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
