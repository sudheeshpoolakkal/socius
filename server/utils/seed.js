import testimonialModel from '../models/testimonialModel.js';

const seedTestimonials = async () => {
  try {
    const count = await testimonialModel.countDocuments();
    if (count === 0) {
      const testimonials = [
        {
          quote: "Finding the right therapist for my needs was so easy with Spiritus. I'm so grateful for the support I've received.",
          name: "John Doe",
          image: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          quote: "I was hesitant to try online therapy, but Spiritus made it a comfortable and seamless experience. Highly recommended!",
          name: "Jane Smith",
          image: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
          quote: "The resources and community on Spiritus have been invaluable to my mental health journey. Thank you!",
          name: "Sam Wilson",
          image: "https://randomuser.me/api/portraits/men/56.jpg",
        },
      ];
      await testimonialModel.insertMany(testimonials);
    }
  } catch (error) {
    console.error('Error seeding testimonials:', error);
  }
};

export default seedTestimonials;