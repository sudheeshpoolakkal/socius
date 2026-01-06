import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CheckCircle, Zap, Calendar, ShieldCheck, CreditCard, X } from 'lucide-react';

const MembershipDetailsModal = ({ onClose }) => {
    const { userData, backendUrl, token, loadUserProfileData } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!userData) return null;

    const expiryDate = new Date(userData.membershipExpiry);
    const isValid = expiryDate > new Date();
    const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));

    const handleSubscribe = async () => {
        if (!token) {
            toast.error('Please login to subscribe');
            return;
        }

        // Navigate to Checkout Page for Renewal
        navigate('/checkout', {
            state: {
                type: 'membership',
                amount: 199
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative animate-fade-in-up">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20 text-white"
                >
                    <X size={20} />
                </button>

                {/* Status Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-800 px-8 py-10 text-white">
                    {/* Nebula effect overlay */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

                    <div className="relative z-10 flex flex-col items-start gap-4">
                        <div className="flex items-center gap-3 w-full">
                            <p className="text-white/90 text-xs font-bold uppercase tracking-widest">Membership Status</p>
                            <div className="bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full border border-white/20">
                                <span className="font-mono text-xs font-bold tracking-wide text-white">
                                    {userData.membershipType || "Neighbourhood"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isValid ? (
                                <div className="p-2 bg-emerald-500/20 rounded-full border border-emerald-400/50">
                                    <CheckCircle size={32} className="text-emerald-300" />
                                </div>
                            ) : (
                                <div className="p-2 bg-red-500/20 rounded-full border border-red-400/50">
                                    <Zap size={32} className="text-red-300" />
                                </div>
                            )}
                            <div>
                                <h2 className="text-4xl font-bold font-serif leading-none tracking-tight">
                                    {isValid ? 'Active Member' : 'Expired'}
                                </h2>
                                <p className="text-white/60 text-sm mt-1 font-medium">
                                    {isValid ? 'Your community benefits are active' : 'Renew to regain access'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Validity Info */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mb-8">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">Valid Until</p>
                            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg font-serif">
                                <Calendar size={18} className="text-blue-600" />
                                {expiryDate.toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                        {isValid && (
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${daysLeft < 5 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                                {daysLeft} days left
                            </div>
                        )}
                    </div>

                    {/* Benefits Grid */}
                    <h3 className="text-gray-900 font-bold mb-4 font-serif text-lg">Your Active Benefits</h3>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <ShieldCheck size={16} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Verified Badge</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <CreditCard size={16} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">0% Fees</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleSubscribe}
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Zap size={18} />
                                    {isValid ? 'Extend Membership (₹199)' : 'Renew Membership (₹199)'}
                                </>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembershipDetailsModal;
