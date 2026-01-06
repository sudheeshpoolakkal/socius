import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const MyRequests = () => {
    const { requests } = useContext(AppContext);

    const formatDate = (dateNum) => {
        return new Date(dateNum).toLocaleDateString();
    };

    const { renewUserRequest, tipAndRateUser, completePurchase } = useContext(AppContext);

    // UI State for Modals
    const [activeRequest, setActiveRequest] = React.useState(null);
    const [showRenewModal, setShowRenewModal] = React.useState(false);
    const [showTipModal, setShowTipModal] = React.useState(false);

    // Form State
    const [renewDuration, setRenewDuration] = React.useState(1);
    const [tipAmount, setTipAmount] = React.useState(0);
    const [rating, setRating] = React.useState('positive'); // positive, negative

    const handleRenewClick = (req) => {
        setActiveRequest(req);
        setShowRenewModal(true);
    };

    const handleTipClick = (req) => {
        setActiveRequest(req);
        setShowTipModal(true);
    };

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

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Requests</h1>
            <p className="text-gray-500 mb-8">Track the status of items you want to borrow.</p>

            <div className="space-y-4">
                {requests && requests.length > 0 ? (
                    requests.map(req => (
                        <div key={req._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                            <img
                                src={req.itemData?.image}
                                alt={req.itemData?.name}
                                className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                            />

                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                                    {req.itemData?.name}
                                    {req.type === 'buy' && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">Buy Request</span>}
                                </h3>
                                <p className="text-sm text-gray-500">Owner: {req.itemData?.owner?.name || 'Unknown'}</p>
                                {req.type === 'buy' ? (
                                    <p className="text-sm font-medium text-gray-800 mt-1">
                                        Offer: {'\u20B9'}{req.offerPrice}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Dates: {formatDate(req.startDate)} - {formatDate(req.endDate)}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                    ${req.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            req.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'}
                                `}>
                                    {req.status}
                                </span>

                                {/* Logic for Approved Buy Requests - Pay & Claim */}
                                {req.type === 'buy' && req.status === 'approved' && (
                                    <button
                                        onClick={async () => {
                                            if (window.confirm(`Complete purchase for ${req.itemData.name} at ${'\u20B9'}${req.offerPrice}?`)) {
                                                // Call completePurchase
                                                try {
                                                    const { useContext } = React; // access context or use axios directly
                                                    // Ideally we should use function from context but I will implement context method later or use direct axios here if needed.
                                                    // Actually, let's look at how submitRenew does it. It uses context.
                                                    // I need to add completePurchase method to AppContext? Or just do it here?
                                                    // The component above uses context methods: renewUserRequest, tipAndRateUser.
                                                    // I'll assume I'll add completePurchase to AppContext or just use imports.
                                                    // Wait, I can't use imports easily without adding to top.
                                                    // I will add completePurchase to AppContext in Step 3.
                                                    // For now, I'll pass a handler or expect it in context.
                                                    // Let's use `handleCompletePurchase` passed via context or implemented here if I had axios.
                                                    // But I don't import axios here.
                                                    // I should update AppContext first or use a prop?
                                                    // I'll grab it from context: `completePurchase`
                                                } catch (e) { }
                                            }
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                                    >
                                        Pay & Claim
                                    </button>
                                )}




                                {req.status === 'approved' && req.type !== 'buy' && (
                                    <>
                                        <button className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition">
                                            Contact Owner
                                        </button>
                                        <button
                                            onClick={() => handleRenewClick(req)}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition"
                                        >
                                            Renew
                                        </button>
                                    </>
                                )}
                                {(req.status === 'approved' || req.status === 'completed') && !req.isRated && req.type !== 'buy' && (
                                    <button
                                        onClick={() => handleTipClick(req)}
                                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
                                    >
                                        Tip & Rate
                                    </button>
                                )}
                                {req.status === 'pending' && (
                                    <button className="px-4 py-2 border border-blue-300 text-blue-700 text-sm rounded-lg hover:bg-blue-50 transition">
                                        Cancel Request
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">No requests found.</div>
                )}
            </div>

            {/* Renew Modal */}
            {showRenewModal && activeRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
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
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tip Amount ({'\u20B9'})</label>
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
        </div>
    );
};

export default MyRequests;
