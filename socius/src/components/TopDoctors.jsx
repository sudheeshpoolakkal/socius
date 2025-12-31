import { AppContext } from '@/context/AppContext'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import DoctorCard from './DoctorCard'

function TopDoctors() {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  // Sort doctors by rating from highest to lowest
  const sortedDoctors = [...doctors].sort((a, b) => (b.rating || 0) - (a.rating || 0))

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 my-12 sm:my-16 text-gray-900 mx-4 sm:mx-6 md:mx-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">Top Doctors to Book</h1>
        <p className="text-center text-sm sm:text-base text-gray-600 max-w-md mx-auto">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </motion.div>

      {/* Grid with animations */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="w-full max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
      >
        {sortedDoctors.slice(0, 10).map((item, index) => (
          <DoctorCard key={index} doctor={item} />
        ))}
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { navigate('/doctors'); window.scrollTo(0, 0) }}
        className="bg-primary hover:bg-primary/90 text-white px-8 sm:px-10 py-3 rounded-full transition-all mt-8 text-sm sm:text-base font-semibold shadow-lg shadow-primary/30"
      >
        View All Doctors
      </motion.button>
    </div>
  )
}

export default TopDoctors;