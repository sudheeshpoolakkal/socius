import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
    Users,
    ShieldCheck,
    Star,
    Zap,
    CreditCard,
    CheckCircle,
    Crown,
    Calendar,
    Award
} from 'lucide-react';

// --- SALES VIEW COMPONENT ---
const MembershipSalesView = ({ handleSubscribe, loading }) => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-['Cormorant_Garamond']">
            {/* Header Section */}
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold tracking-wide uppercase mb-4 border border-blue-100">
                    <Crown size={14} className="fill-blue-700" />
                    Premium Community Access
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 font-serif leading-tight">
                    Upgrade Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Neighbourhood Experience</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-sans">
                    Support your local community and unlock exclusive tools to make borrowing and sharing even easier.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Benefits List */}
                <div className="space-y-8 order-2 lg:order-1 font-sans">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-600">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">Verified "Neighbour" Badge</h3>
                                <p className="text-gray-600 leading-relaxed">Safety first. Stand out with a verified badge next to your name, building instant trust within the community.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">Priority Requests</h3>
                                <p className="text-gray-600 leading-relaxed">Need something urgent? Your item requests get bumped to the top of neighbors' feeds.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-600">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">Zero Transaction Fees</h3>
                                <p className="text-gray-600 leading-relaxed">Keep more of what you save (and earn!). Members pay 0% service fees on all exchanges.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-600">
                                <Award size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">Exclusive Events</h3>
                                <p className="text-gray-600 leading-relaxed">Get invited to local meetups, tool-sharing workshops, and community potlucks.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Card */}
                <div className="order-1 lg:order-2 font-sans">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl transform rotate-2 opacity-20 group-hover:rotate-3 transition-transform duration-500"></div>
                        <div className="relative bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden">
                            <div className="p-8 md:p-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">Monthly Plan</p>
                                        <h3 className="text-3xl font-bold text-gray-900 font-serif mt-1">Neighbourhood</h3>
                                    </div>
                                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">
                                        Best Value
                                    </div>
                                </div>

                                <div className="flex items-baseline mb-8">
                                    <span className="text-5xl font-extrabold text-gray-900">₹199</span>
                                    <span className="text-gray-500 ml-2">/ month</span>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {['Full Platform Access', 'Unlimited Requests', '24/7 Priority Support', 'Cancel Anytime'].map((item, i) => (
                                        <div key={i} className="flex items-center text-gray-600">
                                            <CheckCircle size={18} className="text-green-500 mr-3" />
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : 'Get Started Now'}
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-4">
                                    Charge will be deducted from your Wallet Balance.
                                </p>
                            </div>
                            <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
                                <p className="text-sm text-gray-600">
                                    Join <span className="font-bold text-gray-900">1,200+</span> neighbours in your area
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
// --- MAIN PAGE COMPONENT ---
import { useNavigate } from 'react-router-dom';

const Membership = () => {
    const { userData, backendUrl, token, loadUserProfileData } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubscribe = async () => {
        if (!token) {
            toast.error('Please login to subscribe');
            return;
        }

        // Navigate to Checkout Page
        navigate('/checkout', {
            state: {
                type: 'membership',
                amount: 199
            }
        });
    };

    return <MembershipSalesView handleSubscribe={handleSubscribe} loading={loading} />;
};

export default Membership;
