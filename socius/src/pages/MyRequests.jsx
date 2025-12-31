import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const MyRequests = () => {
    const { requests } = useContext(AppContext);

    const formatDate = (dateNum) => {
        return new Date(dateNum).toLocaleDateString();
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
                                <h3 className="font-bold text-gray-900">{req.itemData?.name}</h3>
                                <p className="text-sm text-gray-500">Owner: {req.itemData?.owner?.name || 'Unknown'}</p>
                                <p className="text-sm text-gray-500">
                                    Dates: {formatDate(req.startDate)} - {formatDate(req.endDate)}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                    ${req.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'}
                                `}>
                                    {req.status}
                                </span>
                                {req.status === 'approved' && (
                                    <button className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition">
                                        Contact Owner
                                    </button>
                                )}
                                {req.status === 'pending' && (
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition">
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
        </div>
    );
};

export default MyRequests;
