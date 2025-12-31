import testimonialModel from '../models/testimonialModel.js';

// Get all testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialModel.find({});
    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new testimonial
const addTestimonial = async (req, res) => {
  const { quote, name, image } = req.body;

  if (!quote || !name || !image) {
    return res.status(400).json({ message: 'Please provide quote, name, and image.' });
  }

  try {
    const newTestimonial = new testimonialModel({
      quote,
      name,
      image,
    });

    await newTestimonial.save();
    res.status(201).json({ message: 'Testimonial added successfully.', testimonial: newTestimonial });
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getTestimonials, addTestimonial };