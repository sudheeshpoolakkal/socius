import { assets } from '@/assets/assets_frontend/assets'
import React from 'react'
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] md:h-[70vh] bg-gradient-to-br from-green-900 to-emerald-800 rounded-xl overflow-hidden mt-6 mx-4 md:mx-10 flex items-center justify-center"
      >
        {/* Abstract Shapes/Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] hover:opacity-30 transition-opacity duration-700"></div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Share More. <br className="hidden md:block" /> Buy Less.
          </h1>
          <p className="text-lg md:text-2xl font-light opacity-90 max-w-2xl mx-auto">
            Socius is re-imagining ownership. We believe that everything you need is already in your neighborhood.
          </p>
        </div>
      </section>


      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                The Anti-Consumerism <br />
                <span className="text-green-600">Revolution</span>
              </h2>
              <div className="text-lg text-gray-600 leading-relaxed space-y-6">
                <p>
                  We live in a world where we are constantly told to buy more. A new drill for one hole. A paella pan for one dinner. A tent for one weekend.
                </p>
                <p>
                  At Socius, we ask: <strong>Why buy when you can borrow?</strong>
                </p>
                <p>
                  Our platform connects neighbors to share everyday items. It's not just about saving money (though that's nice). It's about rebuilding community trust, reducing waste, and breaking free from the cycle of endless consumption.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-orange-600 mb-2">Save Money</h3>
                <p className="text-gray-600">Don't spend $200 on something you use once a year.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-blue-600 mb-2">Declutter</h3>
                <p className="text-gray-600">Own less stuff, have more space for living.</p>
              </div>
              <div className="bg-green-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-green-600 mb-2">Eco-Friendly</h3>
                <p className="text-gray-600">Reduce demand for new manufacturing.</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-purple-600 mb-2">Connect</h3>
                <p className="text-gray-600">Meet your neighbors and build trust.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-zinc-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Our Community Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-8 border border-zinc-700 rounded-lg hover:border-green-500 transition-colors duration-300">
              <h3 className="text-5xl font-bold text-green-500 mb-2">250+</h3>
              <p className="text-zinc-400 uppercase tracking-widest text-sm">Items Shared</p>
            </div>
            <div className="p-8 border border-zinc-700 rounded-lg hover:border-blue-500 transition-colors duration-300">
              <h3 className="text-5xl font-bold text-blue-500 mb-2">$15k+</h3>
              <p className="text-zinc-400 uppercase tracking-widest text-sm">Estimated Savings</p>
            </div>
            <div className="p-8 border border-zinc-700 rounded-lg hover:border-orange-500 transition-colors duration-300">
              <h3 className="text-5xl font-bold text-orange-500 mb-2">120+</h3>
              <p className="text-zinc-400 uppercase tracking-widest text-sm">Active Neighbors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Values */}
      <section className="py-20 bg-[#fdf8f4]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Built on Trust</h2>
          <p className="text-xl text-gray-600 mb-12">
            Socius isn't just a marketplace. It's a social contract. We verify every user to ensure that your items are safe.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {['Verified IDs', 'Secure Deposits', 'Community Reviews', 'Respect'].map((item, index) => (
              <span key={index} className="px-6 py-3 bg-white shadow-sm rounded-full text-gray-700 font-medium border border-gray-100">
                ✓ {item}
              </span>
            ))}
          </div>

          <div className="mt-16">
            <button
              onClick={() => navigate("/inventory")}
              className="inline-block px-10 py-4 bg-green-600 text-white text-lg font-semibold rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Browse Items
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
