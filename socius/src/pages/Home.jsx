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
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 relative shadow-2xl shadow-slate-200/50">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white flex flex-col items-center justify-center p-12 text-center border border-slate-100">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-sm">
                    <Users size={32} className="text-blue-600" />
                  </div>
                  <h3 className="font-serif text-3xl text-slate-900 mb-4">Community First</h3>
                  <p className="text-slate-500 font-light leading-relaxed">
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

      {/* Stats Section - Floating Dashboard Style */}
      <section className="px-4 -mt-20 relative z-20 mb-20">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
            <div className="text-center group">
              <div className="flex items-center justify-center gap-2 mb-2 text-slate-400">
                <Globe size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Impact</span>
              </div>
              <div className="text-3xl md:text-5xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">2.5k<span className="text-blue-600">+</span></div>
              <p className="text-slate-500 font-medium">Items Shared</p>
            </div>
            <div className="text-center group pl-8">
              <div className="flex items-center justify-center gap-2 mb-2 text-slate-400">
                <Users size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Community</span>
              </div>
              <div className="text-3xl md:text-5xl font-black text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">1k<span className="text-emerald-600">+</span></div>
              <p className="text-slate-500 font-medium">Active Neighbors</p>
            </div>
            <div className="text-center group pl-8">
              <div className="flex items-center justify-center gap-2 mb-2 text-slate-400">
                <Award size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Diversity</span>
              </div>
              <div className="text-3xl md:text-5xl font-black text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">100<span className="text-purple-600">+</span></div>
              <p className="text-slate-500 font-medium">Categories</p>
            </div>
            <div className="text-center group pl-8">
              <div className="flex items-center justify-center gap-2 mb-2 text-slate-400">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Savings</span>
              </div>
              <div className="text-3xl md:text-5xl font-black text-slate-900 mb-1 group-hover:text-amber-500 transition-colors">$45k</div>
              <p className="text-slate-500 font-medium">Money Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Elegant Banner */}
      <section className="py-20 px-4 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            {/* Background Patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                Ready to join the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">neighborhood?</span>
              </h2>
              <p className="text-blue-100 text-xl mb-12 font-light">
                Join thousands of neighbors who are already saving money and building distinct connections. It's free to get started.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/login"
                  className="px-10 py-5 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-xl shadow-blue-900/50 hover:scale-105 active:scale-95 min-w-[200px]"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/about"
                  className="px-10 py-5 bg-transparent border border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300 min-w-[200px]"
                >
                  View Inventory
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
