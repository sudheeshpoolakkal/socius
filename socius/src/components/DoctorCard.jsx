import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -8 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => { navigate(`/appointment/${doctor._id}`); window.scrollTo(0, 0) }}
            className="group bg-white rounded-b-xl shadow-sm hover:shadow-xl overflow-hidden cursor-pointer border border-gray-100 flex flex-col h-full"
        >
            {/* Image Container with Skeleton */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                {/* Skeleton placeholder */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse">
                        <div className="absolute inset-0 skeleton-shimmer" />
                    </div>
                )}

                <img
                    className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    src={doctor.image}
                    alt={doctor.name}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                        setImageLoaded(true);
                        e.target.src = 'https://placehold.co/400x400/f3f4f6/9ca3af?text=Doctor';
                    }}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                    <span className={`flex items-center gap-1.5 ${doctor.available ? 'text-green-600' : 'text-red-600'}`}>
                        <span className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {doctor.available ? 'Available' : 'Busy'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                            {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">{doctor.speciality}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                        <FaStar className="text-yellow-400 text-xs" />
                        <span className="text-xs font-bold text-gray-700">
                            {doctor.rating ? doctor.rating.toFixed(1) : 'New'}
                        </span>
                    </div>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-50">
                    <button className="w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold group-hover:bg-primary group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                        <FaCalendarAlt className="text-xs" />
                        Book Appointment
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default DoctorCard;
