// sample-data-loader.js
// This script demonstrates how to load sample courses into the application
// In a real application, this would connect to the actual database or API

const sampleCourses = require('./src/data/sample-courses.json');

class SampleDataLoader {
  constructor() {
    this.courses = sampleCourses.courses;
  }

  // Simulate fetching courses (in real app, this would be an API call)
  async fetchCourses() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          courses: this.courses
        });
      }, 500); // Simulate network delay
    });
  }

  // Simulate fetching courses by category
  async fetchCoursesByCategory(category) {
    return new Promise(resolve => {
      setTimeout(() => {
        const filteredCourses = this.courses.filter(course => 
          course.category.toLowerCase().includes(category.toLowerCase())
        );
        resolve({
          success: true,
          courses: filteredCourses
        });
      }, 300);
    });
  }

  // Simulate fetching a single course
  async fetchCourseById(courseId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const course = this.courses.find(course => course._id === courseId);
        resolve({
          success: true,
          course: course
        });
      }, 300);
    });
  }

  // Simulate enrolling in a course
  async enrollInCourse(courseId, userId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Successfully enrolled in course"
        });
      }, 500);
    });
  }

  // Get all unique categories
  getCategories() {
    const categories = [...new Set(this.courses.map(course => course.category))];
    return categories.map(category => ({
      value: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: this.courses.filter(c => c.category === category).length
    }));
  }

  // Get sample testimonials for courses
  getTestimonials() {
    return [
      {
        id: 1,
        name: "Alex Johnson",
        course: "Mindfulness and Meditation Fundamentals",
        rating: 5,
        comment: "This course completely transformed how I handle stress. The techniques are practical and easy to implement in daily life.",
        date: "2024-01-15"
      },
      {
        id: 2,
        name: "Maria Garcia", 
        course: "CBT Techniques",
        rating: 5,
        comment: "The CBT techniques taught here have been life-changing. I can now challenge negative thoughts effectively.",
        date: "2024-02-20"
      },
      {
        id: 3,
        name: "David Chen",
        course: "Stress Management",
        rating: 4,
        comment: "Excellent course for anyone dealing with high stress levels. The practical exercises made a real difference.",
        date: "2024-01-30"
      },
      {
        id: 4,
        name: "Sarah Williams",
        course: "Emotional Intelligence",
        rating: 5,
        comment: "Improved my relationships both at work and home. The self-awareness techniques are particularly valuable.",
        date: "2024-03-05"
      }
    ];
  }
}

// If running directly, log sample data
if (require.main === module) {
  const loader = new SampleDataLoader();
  

}

module.exports = SampleDataLoader;