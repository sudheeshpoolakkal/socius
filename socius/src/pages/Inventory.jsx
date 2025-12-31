import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';

const categories = ['Tools', 'Electronics', 'Kitchen', 'Books', 'Sports', 'Camping', 'Party', 'Gardening'];

const Inventory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { items } = useContext(AppContext); // Use global items
  const [searchTerm, setSearchTerm] = useState('');

  // Filter Logic
  const filteredItems = items.filter(item => {
    const matchCategory = category ? item.category.toLowerCase() === category.toLowerCase() : true;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-[3.25rem] z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Items'}
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>

            {/* Quick Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <button
                onClick={() => navigate('/inventory')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${!category ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => navigate(`/inventory/${cat.toLowerCase()}`)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${category === cat.toLowerCase() ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredItems.map(item => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;