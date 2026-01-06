import React from 'react';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/inventory/item/${item._id}`)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group"
        >
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {item.image ? (
                    <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={item.image}
                        alt={item.name}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                        📦
                    </div>
                )}

                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.sold ? 'bg-gray-200 text-gray-600' :
                            item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {item.sold ? 'Sold' : item.available ? 'Available' : 'Borrowed'}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.category}</p>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                            {item.ownerName?.[0]}
                        </div>
                        <span className="text-xs text-gray-600 truncate max-w-[80px]">{item.ownerName}</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${item.isBuyable ? 'bg-green-50 text-green-700' : 'text-orange-600 bg-orange-50'}`}>
                        {item.isBuyable
                            ? `₹${item.price} `
                            : item.deposit > 0 ? `Dep: ₹${item.deposit}` : 'Free'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
