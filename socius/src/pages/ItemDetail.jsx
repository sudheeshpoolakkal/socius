import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ItemDetail = () => {
    const { itemId } = useParams();
    const { items, currencySymbol, backendUrl, token, userData, requests } = useContext(AppContext);
    const [item, setItem] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('rent'); // 'rent' or 'buy'
    const navigate = useNavigate();

    useEffect(() => {
        if (item) {
            // Set initial tab priority: Rent -> Buy
            // Treat undefined isBorrowable as TRUE (legacy support)
            const canBorrow = item.isBorrowable !== false;

            if (canBorrow) setActiveTab('rent');
            else if (item.isBuyable) setActiveTab('buy');
        }
    }, [item]);

    useEffect(() => {
        if (items.length > 0) {
            const foundItem = items.find(i => i._id === itemId);
            if (foundItem) {
                setItem(foundItem);
            } else {
                // If not in standard list, maybe fetch via API (omitted for now)
                toast.error("Item not found");
            }
        }
    }, [items, itemId]);

    const handleRequest = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.warn('Please login to request items');
            navigate('/login');
            return;
        }

        if (item.owner._id === userData?._id) {
            toast.error("You cannot borrow your own item!");
            return;
        }

        setLoading(true);
        try {
            // Calculate duration
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (duration <= 0) {
                toast.error("End date must be after start date");
                setLoading(false);
                return;
            }

            const { data } = await axios.post(`${backendUrl}/api/user/request-item`, {
                itemId: item._id,
                startDate: start.getTime(),
                endDate: end.getTime(),
                duration
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success('Request sent successfully!');
                setShowRequestModal(false);
                navigate('/my-requests');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Request to Buy Logic
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [offerPrice, setOfferPrice] = useState('');

    const handleBuyRequest = async (e) => {
        e.preventDefault();
        if (!token) return navigate('/login');

        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/request-purchase`, {
                itemId: item._id,
                offerPrice
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (data.success) {
                toast.success(data.message);
                setShowBuyModal(false);
                navigate('/my-requests');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!item) return <div className="p-10 text-center">Loading item...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Image */}
                <div className="w-full md:w-1/2">
                    <img src={item.image} alt={item.name} className="w-full h-auto rounded-xl shadow-lg border border-gray-100 object-cover" />
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.name}</h1>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold uppercase tracking-wide">
                            {item.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${item.sold ? 'bg-gray-200 text-gray-800' :
                            item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {item.sold ? 'Sold' : item.available ? 'Available' : 'Unavailable'}
                        </span>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                        {item.description}
                    </p>

                    <div className="bg-white rounded-xl border border-gray-100 p-1 mb-8">
                        {/* Tabs */}
                        {((item.isBorrowable !== false) && item.isBuyable) && (
                            <div className="flex bg-gray-50 rounded-lg p-1 mb-6">
                                <button
                                    onClick={() => setActiveTab('rent')}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'rent' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Rent / Borrow
                                </button>
                                <button
                                    onClick={() => setActiveTab('buy')}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'buy' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Buy Item
                                </button>
                            </div>
                        )}

                        {/* Details based on Tab */}
                        <div className="p-4 pt-0">
                            {activeTab === 'rent' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 font-medium">Refundable Deposit</span>
                                        <span className="text-xl font-bold text-gray-800">{currencySymbol}{item.deposit}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        💡 Deposit will be refunded after the item is returned in good condition.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'buy' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 font-medium">Selling Price</span>
                                        <span className="text-xl font-bold text-gray-800">{currencySymbol}{item.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 bg-green-50 p-3 rounded-lg border border-green-100">
                                        ✨ You will own this item permanently after purchase.
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-medium">Owner</span>
                                    <span className="font-medium text-gray-800 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">{item.owner.name?.[0]}</div>
                                        {item.owner.name}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-medium">Location</span>
                                    <span className="font-medium text-gray-800">{item.address?.line1 || 'Local Community'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto flex justify-end">
                        {activeTab === 'buy' ? (
                            <button
                                onClick={async () => {
                                    if (!token) return navigate('/login');
                                    if (window.confirm(`Are you sure you want to buy ${item.name} for ${currencySymbol}${item.price}?`)) {
                                        setLoading(true);
                                        try {
                                            const { data } = await axios.post(`${backendUrl}/api/user/buy-item`, { itemId: item._id }, { headers: { Authorization: `Bearer ${token}` } });
                                            if (data.success) {
                                                toast.success(data.message);
                                                navigate('/my-items');
                                            } else {
                                                toast.error(data.message);
                                            }
                                        } catch (error) {
                                            toast.error(error.message);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }
                                }}
                                disabled={item.sold || !item.isBuyable}
                                className={`w-full md:w-auto px-8 py-3 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 
                                    ${item.sold ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                            >
                                {item.sold ? 'Sold Out' : `Buy Now • ${currencySymbol}${item.price}`}
                            </button>
                        ) : (
                            <>
                                <button
                                    disabled={!item.available || item.sold || (item.isBorrowable === false)}
                                    onClick={() => setShowRequestModal(true)}
                                    className={`w-full md:w-auto px-6 py-2.5 rounded-full text-white font-bold text-base shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 
                                        ${item.available && !item.sold && (item.isBorrowable !== false) ? 'bg-gray-900 hover:bg-black' : 'bg-gray-400 cursor-not-allowed'}`}
                                >
                                    {item.sold ? 'Sold Out' : (item.isBorrowable === false) ? 'Not for Rent' : item.available ? 'Request to Borrow' : 'Currently Unavailable'}
                                </button>

                                {/* Request to Buy Button - visible if item is not sold, and not user's own item */}
                                {!item.sold && item.owner?._id !== userData?._id && (
                                    <button
                                        onClick={() => setShowBuyModal(true)}
                                        className="ml-3 w-full md:w-auto px-6 py-2.5 rounded-full border-2 border-black text-black font-bold text-base hover:bg-black hover:text-white transition"
                                    >
                                        Request to Buy
                                    </button>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>

            {/* Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
                        <button
                            onClick={() => setShowRequestModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <h2 className="text-xl font-bold text-gray-800 mb-4">Select Borrowing Dates</h2>

                        <form onSubmit={handleRequest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-orange-600 transition mt-2 flex justify-center items-center"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Confirm Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Buy Request Modal */}
            {showBuyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
                        <button onClick={() => setShowBuyModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Make an Offer to Buy</h2>
                        <p className="text-sm text-gray-500 mb-4">Request the owner to sell this item to you. They can accept or reject your offer.</p>

                        <form onSubmit={handleBuyRequest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Offer Price ({currencySymbol})</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                                    value={offerPrice}
                                    onChange={(e) => setOfferPrice(e.target.value)}
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white rounded-lg font-bold shadow-md hover:bg-gray-800 transition">
                                {loading ? 'Sending...' : 'Send Purchase Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetail;
