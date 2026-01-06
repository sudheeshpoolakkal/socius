import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '@/context/AppContext';
import { Calendar, ShieldCheck, Heart, Star } from 'lucide-react';

const Checkout = () => {
  const { backendUrl, token, currencySymbol, loadUserProfileData } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve passed state
  const { appointment, type, amount } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'upi'

  // Dummy state for Card details
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Dummy state for UPI details
  const [upiId, setUpiId] = useState('');

  const isMembership = type === 'membership';

  if (!appointment && !isMembership) {
    toast.error("Checkout details not found.");
    return (
      <div className="text-center mt-10">
        <h1>Error: Invalid Checkout Session</h1>
        <button onClick={() => navigate('/')} className='mt-4 text-blue-600 underline'>Return Home</button>
      </div>
    );
  }

  // Calculate totals
  let baseAmount = 0;
  let totalAmount = 0;
  let surcharge = 0;

  if (isMembership) {
    baseAmount = 199;
    totalAmount = 199; // No surcharge for membership
  } else {
    baseAmount = Number(appointment.amount);
    surcharge = baseAmount * 0.16;
    totalAmount = (baseAmount + surcharge).toFixed(2);
  }

  // Validate card details
  const validateCardDetails = () => {
    if (!cardName.trim()) {
      toast.error("Please enter a valid name on card");
      return false;
    }
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(cardNumber)) {
      toast.error("Please enter a valid 16-digit card number");
      return false;
    }
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) {
      toast.error("Please enter expiry in MM/YY format");
      return false;
    }
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(cvv)) {
      toast.error("Please enter a valid 3-digit CVV");
      return false;
    }
    return true;
  };

  // Validate UPI details
  const validateUpiDetails = () => {
    const upiRegex = /^[\w.-]+@[a-zA-Z]{2,}$/;
    if (!upiRegex.test(upiId)) {
      toast.error("Please enter a valid UPI ID (e.g., username@bank)");
      return false;
    }
    return true;
  };

  // Handler for form submission
  const handlePayment = async (e) => {
    e.preventDefault();

    // Validate inputs based on payment method
    if (paymentMethod === 'card' && !validateCardDetails()) {
      return;
    }
    if (paymentMethod === 'upi' && !validateUpiDetails()) {
      return;
    }

    setLoading(true);
    try {
      if (isMembership) {
        // --- MEMBERSHIP PAYMENT FLOW ---
        // 1. Add Funds (Simulate Payment)
        const addFundsResponse = await axios.post(
          backendUrl + '/api/user/add-funds',
          { amount: 199 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!addFundsResponse.data.success) {
          throw new Error(addFundsResponse.data.message || "Payment Failed (Simulation)");
        }

        // 2. Purchase Membership
        const purchaseResponse = await axios.post(
          backendUrl + '/api/user/purchase-membership',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (purchaseResponse.data.success) {
          toast.success("Welcome! Membership Activated.");
          await loadUserProfileData(); // Refresh user state
          // Navigate to home to start using the app
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          toast.error(purchaseResponse.data.message);
        }

      } else {
        // --- APPOINTMENT/ITEM PAYMENT FLOW ---
        const { data } = await axios.post(
          `${backendUrl}/api/user/process-payment`,
          { appointmentId: appointment._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) {
          toast.success(data.message);
          setTimeout(() => {
            navigate('/my-appointments');
          }, 1500);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Payment processing failed.");
    }
    setLoading(false);
  };

  // Calculate Expiry Date for Membership (30 days from now)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4 pb-20">
      <div className="max-w-3xl mx-auto">

        {/* MEMBERSHIP HEADER / GREETING */}
        {isMembership && (
          <div className="text-center mb-10 animate-fade-in-up">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
              Start Your Journey
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-4">
              Welcome to the Neighbourhood
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              You are investing in a stronger, more connected community. Your membership unlocks exclusive tools to share, borrow, and build trust with your neighbours.
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* LEFT COLUMN: DETAILS */}
          <div className="w-full md:w-1/2 space-y-6">

            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 font-serif">Order Summary</h2>

              {isMembership ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Neighbourhood Plan</p>
                        <p className="text-xs text-gray-500">Monthly Membership</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">{currencySymbol}199.00</span>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Valid Until</span>
                    <span className="font-medium text-gray-900 flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {expiryDate.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs font-medium flex gap-2 items-start">
                    <Heart size={14} className="mt-0.5 shrink-0" />
                    <p>100% of your membership goes towards maintaining the platform and verifying safe community exchanges.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">
                    Appointment ID: <span className="font-semibold text-gray-800">{appointment._id}</span>
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{currencySymbol}{baseAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee (16%)</span>
                    <span>{currencySymbol}{surcharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3 mt-2">
                    <span>Total</span>
                    <span>{currencySymbol}{Number(totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {isMembership && (
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-indigo-200 text-sm font-bold uppercase tracking-wide">
                  <Star size={14} /> Only for checkout today
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  "I love how easier it is to find tools locally now. This membership paid for itself in one rental!"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full" />
                  <div className="text-xs">
                    <p className="font-bold">Sarah Jenkins</p>
                    <p className="text-indigo-200">Local Neighbour</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PAYMENT FORM */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900 font-serif text-lg">Payment Details</h2>
              </div>

              <div className="p-6">
                {/* Payment Method Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${paymentMethod === 'card' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${paymentMethod === 'upi' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    UPI
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Name on Card</label>
                      <input
                        type="text"
                        className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Card Number</label>
                      <input
                        type="text"
                        maxLength="16"
                        inputMode="numeric"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, '');
                          setCardNumber(e.target.value);
                        }}
                        className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        value={cardNumber}
                        placeholder="0000 0000 0000 0000"
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Expiry</label>
                        <input
                          type="text"
                          maxLength="5"
                          inputMode="numeric"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9\/]/g, '');
                            setExpiry(e.target.value);
                          }}
                          className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                          value={expiry}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">CVV</label>
                        <input
                          type="text"
                          maxLength="3"
                          inputMode="numeric"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '');
                            setCvv(e.target.value);
                          }}
                          className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                          value={cvv}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-200 hover:bg-black hover:transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Processing...' : `Pay ${currencySymbol}${totalAmount}`}
                      </button>
                      <p className="text-xs text-center text-gray-400 mt-3 flex justify-center items-center gap-1">
                        <ShieldCheck size={12} /> Secure 256-bit SSL Encrypted Payment
                      </p>
                    </div>
                  </form>
                )}

                {paymentMethod === 'upi' && (
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">UPI ID</label>
                      <input
                        type="text"
                        className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                        required
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-[#0D8845] text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-[#0a7038] hover:transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Processing...' : `Pay ${currencySymbol}${totalAmount} via UPI`}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
