import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    ArrowRight,
    ShieldCheck,
    MapPin,
    Package,
    Heart,
    Sparkles,
    Share2,
    HandHeart,
    Crown
} from 'lucide-react';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative pt-16 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-200/50 to-indigo-200/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-gradient-to-tr from-emerald-200/40 to-teal-200/30 rounded-full blur-[100px]"></div>
                <div className="absolute top-[20%] left-[10%] w-24 h-24 bg-orange-200/30 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-[30%] right-[15%] w-16 h-16 bg-purple-200/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s' }}></div>

                {/* Decorative grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left Content */}
                    <div className="relative z-10 space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100/50 shadow-sm backdrop-blur-sm animate-fade-in">
                            <MapPin size={14} className="animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest">Hyperlocal Sharing Network</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                            Borrow from neighbors, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 animate-gradient">
                                build community.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Socius transforms your neighborhood into a shared library. Save money on tools, gear, and books while reducing waste and connecting with the people next door.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                            <button
                                onClick={() => navigate('/inventory')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl shadow-blue-200/50 active:scale-95 flex items-center gap-2 overflow-hidden"
                            >
                                <span className="relative z-10">Start Borrowing</span>
                                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </button>

                            <button
                                onClick={() => navigate('/membership')}
                                className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 font-bold rounded-2xl border border-slate-200/50 hover:border-slate-300 hover:bg-white hover:shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-2"
                            >
                                <Crown size={18} className="text-amber-500" />
                                <span>Join Neighbourhood</span>
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="pt-8 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                            <div className="flex -space-x-3">
                                {[
                                    'bg-gradient-to-br from-rose-400 to-pink-500',
                                    'bg-gradient-to-br from-blue-400 to-indigo-500',
                                    'bg-gradient-to-br from-emerald-400 to-teal-500',
                                    'bg-gradient-to-br from-amber-400 to-orange-500'
                                ].map((gradient, i) => (
                                    <div key={i} className={`w-12 h-12 rounded-2xl border-4 border-white overflow-hidden shadow-lg ${gradient} flex items-center justify-center`}>
                                        <Users size={20} className="text-white/90" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                    1k+
                                </div>
                            </div>
                            <div className="text-sm text-slate-500 text-center sm:text-left">
                                <div className="flex items-center gap-1 justify-center sm:justify-start mb-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Heart key={s} size={14} className="fill-emerald-500 text-emerald-500" />
                                    ))}
                                </div>
                                <p className="font-semibold text-slate-700">Trusted by 100+ local neighborhoods</p>
                                <p className="text-xs text-slate-400">Safe, insured, and verified members</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual Component */}
                    <div className="relative group">
                        {/* Floating Cards for Visual Interest */}
                        <div className="absolute top-4 left-[-10px] md:left-[-20px] bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl z-20 animate-float hidden sm:block">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-orange-600 shadow-inner">
                                    <Package size={22} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Just Borrowed</p>
                                    <p className="text-sm font-bold text-slate-800">Power Drill</p>
                                    <p className="text-xs text-emerald-600 font-medium">Saved $89!</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-16 right-[-10px] md:right-0 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl z-20 animate-float-delayed hidden sm:block">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                                    <ShieldCheck size={22} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Community</p>
                                    <p className="text-sm font-bold text-slate-800">100% Verified</p>
                                    <p className="text-xs text-blue-600 font-medium">Trust Score: A+</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-1/2 right-[-30px] md:right-[-40px] bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl z-20 animate-pulse hidden lg:block">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-purple-600">
                                    <Share2 size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-600">12 items shared</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Visual */}
                        <div className="relative aspect-square max-w-[450px] mx-auto lg:max-w-none">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-emerald-500/20 rounded-[3rem] rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border border-white/50 rounded-[3rem] shadow-2xl overflow-hidden">
                                {/* Premium Visual Design */}
                                <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-8 relative">
                                    {/* Decorative circles */}
                                    <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-br from-blue-200/50 to-indigo-200/50 rounded-full blur-md"></div>
                                    <div className="absolute bottom-12 left-8 w-16 h-16 bg-gradient-to-br from-emerald-200/50 to-teal-200/50 rounded-full blur-md"></div>

                                    {/* Central Icon Group */}
                                    <div className="relative">
                                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-blue-300/50">
                                            <HandHeart size={60} className="text-white -rotate-12" />
                                        </div>
                                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
                                            <Users size={28} className="text-white" />
                                        </div>
                                    </div>

                                    {/* Text below */}
                                    <div className="mt-10 text-center">
                                        <p className="text-xl md:text-2xl font-bold text-slate-800">Share. Borrow. Connect.</p>
                                        <p className="text-sm text-slate-500 mt-2">Your neighborhood, reimagined</p>
                                    </div>

                                    {/* Stats row */}
                                    <div className="mt-8 flex gap-6 text-center">
                                        <div>
                                            <p className="text-2xl font-bold text-blue-600">2.5k+</p>
                                            <p className="text-xs text-slate-400">Items Shared</p>
                                        </div>
                                        <div className="w-px bg-slate-200"></div>
                                        <div>
                                            <p className="text-2xl font-bold text-emerald-600">100+</p>
                                            <p className="text-xs text-slate-400">Communities</p>
                                        </div>
                                        <div className="w-px bg-slate-200"></div>
                                        <div>
                                            <p className="text-2xl font-bold text-purple-600">$45k</p>
                                            <p className="text-xs text-slate-400">Saved</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Brand Bar / Partners */}
            <div className="mt-20 border-t border-slate-200/60 bg-white/60 backdrop-blur-md py-10">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Featured in local communities</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {['EcoShare', 'Neighborhood+', 'NextBlock', 'GreenLife', 'ShareCity'].map((name, i) => (
                            <span
                                key={i}
                                className="text-lg md:text-xl font-black text-slate-300 hover:text-slate-500 transition-colors duration-300 cursor-default"
                                style={{ fontStyle: i % 2 === 0 ? 'normal' : 'italic' }}
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 4s ease-in-out infinite;
                    animation-delay: 1s;
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
};

export default Hero;