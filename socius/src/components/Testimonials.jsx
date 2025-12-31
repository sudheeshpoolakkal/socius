import React from 'react';

const testimonials = [
  {
    quote: "Finding the right therapist for my needs was so easy with Spiritus. I'm so grateful for the support I've received.",
    name: "Anoop Menon",
    image: "https://randomuser.me/api/portraits/men/42.jpg",
  },
  {
    quote: "I was hesitant to try online therapy, but Spiritus made it a comfortable and seamless experience. Highly recommended!",
    name: "Lakshmi Nair",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote: "The resources and community on Spiritus have been invaluable to my mental health journey. Thank you!",
    name: "Suresh Pillai",
    image: "https://randomuser.me/api/portraits/men/78.jpg",
  },
];

const Testimonials = () => {
  return (
    // Changed the background color from bg-gray-100 to bg-white
    <section className="bg-white pt-0 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img
                  className="w-12 h-12 rounded-full mr-4"
                  src={testimonial.image}
                  alt={testimonial.name}
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/48x48/EFEFEF/AAAAAA?text=User'; }}
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const App = Testimonials;

export default App;


