import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyBorrowings = () => {
    const { requests, currencySymbol, backendUrl, token, renewUserRequest, tipAndRateUser } = useContext(AppContext);

    const formatDate = (dateNum) => {
        return new Date(dateNum).toLocaleDateString();
    };

    // UI State for Modals
    const [activeRequest, setActiveRequest] = useState(null);
    const [showRenewModal, setShowRenewModal] = useState(false);
    const [showTipModal, setShowTipModal] = useState(false);

    // Purchase Offer State
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [offerPrice, setOfferPrice] = useState('');

    // Form State
    const [renewDuration, setRenewDuration] = useState(1);
    const [tipAmount, setTipAmount] = useState(0);
    const [rating, setRating] = useState('positive'); // positive, negative

    // Filter for Active (Approved Borrow) and Completed Borrow requests
    const borrowedItems = requests.filter(req =>
        req.type === 'borrow' && (req.status === 'approved' || req.status === 'completed')
    );

    const handleRenewClick = (req) => {
        setActiveRequest(req);
        setShowRenewModal(true);
    };

    const handleTipClick = (req) => {
        setActiveRequest(req);
        setShowTipModal(true);
    };

    const handleBuyClick = (req) => {
        setActiveRequest(req);
        setOfferPrice(req.itemData?.price || '');
        setShowBuyModal(true);
    }

    const submitRenew = async () => {
        if (!activeRequest) return;
        const success = await renewUserRequest(activeRequest._id, renewDuration);
        if (success) {
            setShowRenewModal(false);
            setRenewDuration(1);
            setActiveRequest(null);
        }
    };

    const submitTip = async () => {
        if (!activeRequest) return;
        const success = await tipAndRateUser(activeRequest._id, tipAmount, rating);
        if (success) {
            setShowTipModal(false);
            setTipAmount(0);
            setActiveRequest(null);
        }
    };

    const submitBuyRequest = async () => {
        if (!activeRequest || !offerPrice) return;

        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/request-purchase',
                { itemId: activeRequest.itemData._id, offerPrice },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success('Purchase offer sent! Check My Requests for status.');
                setShowBuyModal(false);
                setActiveRequest(null);
                setOfferPrice('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Borrowed Items</h1>
            <p className="text-gray-500 mb-8">Manage your active rentals and completed history.</p>

            <div className="space-y-4">
                {borrowedItems && borrowedItems.length > 0 ? (
                    borrowedItems.map(req => (
                        <div key={req._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                            <img
                                src={req.itemData?.image}
                                alt={req.itemData?.name}
                                className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                            />

                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                                    {req.itemData?.name}
                                    {req.status === 'approved' && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Active</span>}
                                    {req.status === 'completed' && <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">Returned</span>}
                                </h3>
                                <p className="text-sm text-gray-500">Owner: {req.itemData?.owner?.name || 'Unknown'}</p>
                                <p className="text-sm text-gray-500">
                                    Dates: {formatDate(req.startDate)} - {formatDate(req.endDate)}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">

                                {req.status === 'approved' && (
                                    <>
                                        <button
                                            onClick={() => handleBuyClick(req)}
                                            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-black transition border border-black"
                                        >
                                            Request to Buy
                                        </button>
                                        <button
                                            onClick={() => handleRenewClick(req)}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition"
                                        >
                                            Renew
                                        </button>
                                    </>
                                )}
                                {(req.status === 'approved' || req.status === 'completed') && !req.isRated && (
                                    <button
                                        onClick={() => handleTipClick(req)}
                                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
                                    >
                                        Tip & Rate
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">You haven't borrowed any items yet.</div>
                )}
            </div>

            {/* Renew Modal */}
            {showRenewModal && activeRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-4">Renew Request</h3>
                        <p className="mb-4 text-gray-600">Extend possession of <strong>{activeRequest.itemData?.name}</strong>.</p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                            <input
                                type="number"
                                min="1"
                                max="30"
                                value={renewDuration}
                                onChange={(e) => setRenewDuration(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowRenewModal(false)}
                                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitRenew}
                                className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tip Modal */}
            {showTipModal && activeRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-4">Tip & Rate Owner</h3>
                        <p className="mb-4 text-gray-600">How was your experience with <strong>{activeRequest.itemData?.owner?.name}</strong>?</p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setRating('positive')}
                                    className={`flex-1 py-3 rounded-lg border-2 ${rating === 'positive' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}
                                >
                                    👍 Positive
                                </button>
                                <button
                                    onClick={() => setRating('negative')}
                                    className={`flex-1 py-3 rounded-lg border-2 ${rating === 'negative' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500'}`}
                                >
                                    👎 Negative
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tip Amount ({currencySymbol})</label>
                            <input
                                type="number"
                                min="0"
                                value={tipAmount}
                                onChange={(e) => setTipAmount(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                                placeholder="Optional"
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowTipModal(false)}
                                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitTip}
                                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Buy Request Modal */}
            {showBuyModal && activeRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Make an Offer</h2>
                        <p className="text-gray-600 mb-6">
                            Propose a price to buy <strong>{activeRequest.itemData?.name}</strong> from {activeRequest.itemData?.owner?.name}.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Your Offer Price ({currencySymbol})</label>
                                <input
                                    type="number"
                                    value={offerPrice}
                                    onChange={(e) => setOfferPrice(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                                    placeholder="Enter amount"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowBuyModal(false)}
                                className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitBuyRequest}
                                className="flex-1 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition shadow-lg"
                            >
                                Send Offer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBorrowings;
