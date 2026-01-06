import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CategoryFilter from "../components/CategoryFilter";
import {
  ArrowRight,
  Shield,
  Leaf,
  Users,
  Zap,
  Globe,
  Award,
  CheckCircle2
} from "lucide-react";

function Home() {
  return (
    <div className="bg-slate-50/50 min-h-screen font-sans">
      <Hero />
      <CategoryFilter />

      {/* Value Proposition Section - Redesigned for Elegance */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Why <span className="text-blue-600">Socius</span>?
            </h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto font-light leading-relaxed">
              We're reimagining ownership for the modern world. Simple, sustainable, and social.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1 */}
            <div className="group bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-blue-100/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 ease-out"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform duration-300">
                  <Zap className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Save Money</h3>
                <p className="text-slate-500 leading-relaxed mb-8">
                  Access premium tools and gear without the premium price tag. Why buy when you can borrow for a fraction of the cost?
                </p>
                <Link to="/about" className="inline-flex items-center text-blue-600 font-semibold group/link">
                  <span className="border-b-2 border-transparent group-hover/link:border-blue-600 transition-all">How much can I save?</span>
                  <ArrowRight className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-emerald-100/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 ease-out"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-200 group-hover:rotate-6 transition-transform duration-300">
                  <Leaf className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Reduce Waste</h3>
                <p className="text-slate-500 leading-relaxed mb-8">
                  Maximize the lifespan of goods. Every shared item means one less thing manufactured, shipped, and eventually discarded.
                </p>
                <Link to="/about" className="inline-flex items-center text-emerald-600 font-semibold group/link">
                  <span className="border-b-2 border-transparent group-hover/link:border-emerald-600 transition-all">Our impact</span>
                  <ArrowRight className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-purple-100/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 ease-out"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-200 group-hover:rotate-6 transition-transform duration-300">
                  <Users className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Build Trust</h3>
                <p className="text-slate-500 leading-relaxed mb-8">
                  Connect with real neighbors. Our verification system ensures that every interaction is safe, reliable, and friendly.
                </p>
                <Link to="/about" className="inline-flex items-center text-purple-600 font-semibold group/link">
                  <span className="border-b-2 border-transparent group-hover/link:border-purple-600 transition-all">Safety guarantees</span>
                  <ArrowRight className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Classic Elegant Theme */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-100 relative shadow-2xl shadow-slate-200/50">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white flex flex-col items-center justify-center p-8 text-center border border-slate-100">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Users size={28} className="text-blue-600" />
                  </div>
                  <h3 className="font-serif text-2xl text-slate-900 mb-3">Community First</h3>
                  <p className="text-slate-500 font-light leading-relaxed text-sm">
                    "Connecting with my neighbors through Socius has been transformative. It's about more than just borrowing items; it's about building lasting relationships."
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">Sarah M.</p>
                      <p className="text-xs text-slate-400">Member since 2024</p>
                    </div>
                  </div>

                  {/* Decorative floating elements */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-50 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-block text-blue-600 font-bold tracking-[0.2em] text-xs uppercase mb-4">Simple Process</span>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">
                Effortless sharing, <br />
                <span className="italic text-slate-400">locally connected.</span>
              </h2>
              <p className="text-slate-500 text-lg mb-12 font-light leading-relaxed max-w-lg">
                We believe in keeping things simple. Our platform handles the details so you can focus on the connection.
              </p>

              <div className="space-y-10">
                {[
                  { title: "Browse Inventory", desc: "Discover useful items right in your neighborhood.", icon: <Globe size={20} /> },
                  { title: "Request & Connect", desc: "Send a friendly request and coordinate pickup.", icon: <CheckCircle2 size={20} /> },
                  { title: "Enjoy & Return", desc: "Use the item and return it when you're done.", icon: <ArrowRight size={20} /> }
                ].map((item, i) => (
                  <div key={i} className="group flex gap-6">
                    <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-blue-600 group-hover:text-blue-600 transition-all duration-300 bg-white shadow-sm group-hover:shadow-md">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2 font-serif">{item.title}</h4>
                      <p className="text-slate-500 font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section - Modern Modular Cards */}
      <section className="px-4 -mt-16 relative z-20 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Impact", value: "2.5k+", sub: "Items Shared", icon: <Globe size={20} />, color: "blue" },
              { label: "Community", value: "1k+", sub: "Active Neighbors", icon: <Users size={20} />, color: "emerald" },
              { label: "Diversity", value: "100+", sub: "Categories", icon: <Award size={20} />, color: "purple" },
              { label: "Savings", value: "$45k", sub: "Money Saved", icon: <CheckCircle2 size={20} />, color: "amber" }
            ].map((stat, i) => (
              <div key={i} className={`group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-50/50 rounded-bl-[80px] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500`}></div>
                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">{stat.label}</div>
                  <div className="text-4xl font-black text-slate-900 mb-1 leading-none">{stat.value}</div>
                  <div className="text-slate-500 font-medium text-sm">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Sophisticated Premium Banner */}
      <section className="py-24 px-4 mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[4rem] overflow-hidden bg-slate-950 p-12 md:p-24 shadow-2xl">
            {/* Multi-layered dynamic background */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:32px_32px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                <Shield size={14} />
                Verified & Secure Community
              </div>

              <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[1.1] tracking-tight">
                Your neighborhood, <br />
                <span className="italic text-slate-400">reimagined.</span>
              </h2>

              <p className="text-slate-400 text-xl md:text-2xl mb-12 font-light leading-relaxed max-w-2xl mx-auto">
                Join our collective movement of sustainable consumption and meaningful local connections.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {/*  
                    TODO: If user is logged in, hide "Join for Free" or change it to something else? 
                    For now, keeping "Join for Free" as per request for non-members 
                 */}
                <Link
                  to="/login"
                  className="group relative px-10 py-5 bg-white text-slate-950 font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] min-w-[220px]"
                >
                  <span className="relative z-10">Join for Free</span>
                  <div className="absolute inset-0 bg-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <Link
                  to="/membership"
                  className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 border border-white/10 text-white font-bold rounded-2xl hover:brightness-110 transition-all duration-300 min-w-[220px] shadow-lg flex items-center justify-center gap-2"
                >
                  <Award size={20} className="text-white" />
                  Become a Member
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
