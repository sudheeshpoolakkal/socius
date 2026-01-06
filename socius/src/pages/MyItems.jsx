import React, { useContext } from 'react';
import ItemCard from '../components/ItemCard';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const MyItems = () => {
    const navigate = useNavigate();
    const { items, userData, incomingRequests, updateRequestStatus } = useContext(AppContext);
    const [activeTab, setActiveTab] = React.useState('listings');

    // Filter items owned by the current user
    const myItems = items.filter(item => {
        const ownerId = item.owner?._id || item.owner;
        return ownerId === userData?._id;
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Items</h1>
                    <p className="text-gray-500 mt-1">Manage your shared items and requests.</p>
                </div>
                <button onClick={() => navigate('/add-item')} className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-600 transition shadow-sm font-medium">
                    + Add New Item
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('listings')}
                    className={`pb-3 px-1 mr-8 font-medium text-lg transition-all ${activeTab === 'listings' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    My Listings ({myItems.length})
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`pb-3 px-1 font-medium text-lg transition-all ${activeTab === 'requests' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Incoming Requests ({incomingRequests.filter(r => r.status === 'pending').length})
                </button>
            </div>

            {activeTab === 'listings' ? (
                // My Listings Tab
                myItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {myItems.map(item => (
                            <ItemCard key={item._id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-4">You haven't listed any items yet.</p>
                        <button onClick={() => navigate('/add-item')} className="text-primary font-medium hover:underline">List your first item</button>
                    </div>
                )
            ) : (
                // Incoming Requests Tab
                <div className="space-y-4">
                    {incomingRequests.length > 0 ? (
                        incomingRequests.map((request) => (
                            <div key={request._id} className="bg-white border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                <div className="flex gap-4 items-center">
                                    <img src={request.itemData.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{request.itemData.name}</p>
                                        <p className="text-sm text-gray-500">Requested by <span className="text-gray-900 font-medium">{request.userData.name}</span></p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                            <span className="ml-2 font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">{request.duration} days</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {request.status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => updateRequestStatus(request._id, 'rejected')}
                                                className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm transition"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => updateRequestStatus(request._id, 'approved')}
                                                className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition shadow-sm"
                                            >
                                                {request.type === 'buy' ? `Accept Offer (\u20B9${request.offerPrice})` : 'Approve Request'}
                                            </button>
                                        </>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                            ${request.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                                            ${request.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                                            ${request.status === 'cancelled' ? 'bg-gray-100 text-gray-600' : ''}
                                            ${request.status === 'completed' ? 'bg-blue-100 text-blue-700' : ''}
                                        `}>
                                            {request.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No incoming requests at the moment.</p>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default MyItems;
