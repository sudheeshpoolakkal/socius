import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categoryData = [
    { category: 'Tools', icon: '🔧', color: 'from-orange-400 to-amber-500', bgColor: 'bg-orange-50', items: '234 items' },
    { category: 'Electronics', icon: '🔌', color: 'from-blue-400 to-indigo-500', bgColor: 'bg-blue-50', items: '189 items' },
    { category: 'Kitchen', icon: '🍳', color: 'from-rose-400 to-pink-500', bgColor: 'bg-rose-50', items: '156 items' },
    { category: 'Books', icon: '📚', color: 'from-emerald-400 to-teal-500', bgColor: 'bg-emerald-50', items: '312 items' },
    { category: 'Sports', icon: '⚽', color: 'from-purple-400 to-violet-500', bgColor: 'bg-purple-50', items: '98 items' },
    { category: 'Camping', icon: '⛺', color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-50', items: '76 items' },
    { category: 'Party', icon: '🎉', color: 'from-pink-400 to-rose-500', bgColor: 'bg-pink-50', items: '145 items' },
    { category: 'Gardening', icon: '🌻', color: 'from-yellow-400 to-amber-500', bgColor: 'bg-yellow-50', items: '87 items' },
];

const CategoryFilter = () => {
    return (
        <section id="categories" className="relative py-20 px-4 bg-white overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                        Categories
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Browse by Category
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Find exactly what you need for your next project or adventure.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-5">
                    {categoryData.map((item, index) => (
                        <Link
                            key={index}
                            to={`/inventory/${item.category.toLowerCase()}`}
                            className="group relative flex flex-col items-center text-center cursor-pointer p-5 md:p-6 rounded-2xl bg-white hover:bg-gradient-to-b hover:from-white hover:to-slate-50 border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Hover gradient overlay */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                            {/* Icon container */}
                            <div className={`relative w-14 h-14 md:w-16 md:h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                <span className="text-3xl md:text-4xl">{item.icon}</span>
                            </div>

                            {/* Category name */}
                            <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                                {item.category}
                            </p>

                            {/* Item count */}
                            <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">
                                {item.items}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* View All Link */}
                <div className="mt-12 text-center">
                    <Link
                        to="/inventory"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5 group"
                    >
                        <span>View All Items</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CategoryFilter;
