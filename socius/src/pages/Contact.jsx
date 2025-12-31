import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/contact/submit`, formData);
      if (response.data.success) {
        toast.success("Message sent successfully!");
        setFormSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Main Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Contact Info */}
          <div className="space-y-8">
            <div>
              <p className="text-green-700 font-semibold tracking-wider uppercase text-sm mb-4">
                CONTACT US
              </p>
              <h1 className="text-4xl md:text-5xl font-serif font-normal text-gray-900 leading-tight mb-6">
                Let's build a sharing community.
              </h1>
              <p className="text-lg text-gray-600">
                Whether you want to start a hub in your neighborhood, ask a question, or just say hello—we're here to help.
              </p>
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Contact Details */}
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">sudheesh@duck.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+91 97448 19606</p>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Office</h3>
                  <p className="text-gray-600">College of Engineering, Trivandrum</p>
                  <p className="text-green-600">Kerala, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600 mb-6">
                    Your message has been sent successfully. We'll get back to you soon.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-semibold transition-all flex justify-center items-center ${loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                      }`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-900 mb-8">Our Location</h2>
          <div className="w-full h-80 overflow-hidden rounded-xl shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.5203552509447!2d76.9037657751543!3d8.545856596364287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bec79541c519%3A0x98324eb5aafb3778!2sCollege%20of%20Engineering%20Trivandrum%20(CET)!5e0!3m2!1sen!2sin!4v1754718701506!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Our Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;