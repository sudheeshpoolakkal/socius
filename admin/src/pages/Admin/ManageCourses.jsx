import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { FaEdit, FaTrash, FaEye, FaBookOpen } from 'react-icons/fa';
import CourseForm from './CourseForm';

const ManageCourses = () => {
  const { courses, getAllCourses, deleteCourse, createCourse, updateCourse, aToken } = useContext(AdminContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  useEffect(() => {
    if (aToken) {
      getAllCourses();
    }
  }, [aToken, getAllCourses]);

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all associated modules and lessons.')) {
      deleteCourse(courseId);
    }
  };

  const handleSaveCourse = (courseData) => {
    if (selectedCourse) {
      updateCourse(selectedCourse._id, courseData);
    } else {
      createCourse(courseData);
    }
    setIsModalOpen(false);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'grid' : 'table');
  };

  return (
    <div className="p-5 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <div className="flex gap-2">
          <button onClick={toggleViewMode} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg">
            {viewMode === 'table' ? <FaBookOpen className="inline mr-1" /> : <FaEye className="inline mr-1" />}
            {viewMode === 'table' ? 'Grid View' : 'Table View'}
          </button>
          <button onClick={handleAddCourse} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add Course</button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_0.8fr_1fr_1fr_0.8fr_1fr] py-3 px-6 border-b bg-gray-100 font-medium text-gray-600">
            <p>Thumbnail</p>
            <p>Title</p>
            <p>Category</p>
            <p>Instructor</p>
            <p>Fee</p>
            <p>Enrolled</p>
            <p>Status</p>
            <p>Duration</p>
            <p>Actions</p>
          </div>
          {courses.map((course) => {
            // Calculate total lessons across all modules for duration
            const totalLessons = course.modules?.reduce((total, module) => {
              return total + (module.lessons?.length || 0);
            }, 0) || 0;
            
            // Calculate total duration
            const totalDuration = course.modules?.reduce((total, module) => {
              return total + (module.duration || 0);
            }, 0) || 0;
            
            return (
              <div key={course._id} className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_0.8fr_1fr_1fr_0.8fr_1fr] items-center py-3 px-6 border-b hover:bg-gray-50 transition">
                <div className="flex justify-center">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded text-gray-500 text-xs">
                      No Img
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{course.title}</p>
                  <p className="text-sm text-gray-500 truncate max-w-xs">{course.description}</p>
                </div>
                <p className="capitalize">{course.category}</p>
                <p>{course.instructor || 'Spiritus Experts'}</p>
                <p>₹{(course.fee || 0).toLocaleString()}</p>
                <p className="text-center">{course.totalEnrollments || 0}</p>
                <p className={`font-medium text-center ${course.isPublished ? 'text-green-500' : 'text-red-500'}`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </p>
                <p className="text-center">{totalDuration} min</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEditCourse(course)} className="text-blue-500 hover:text-blue-700">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteCourse(course._id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
          {courses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No courses found. Click "Add Course" to create your first course.
            </div>
          )}
        </div>
      ) : (
        // Grid view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            // Calculate total lessons across all modules
            const totalLessons = course.modules?.reduce((total, module) => {
              return total + (module.lessons?.length || 0);
            }, 0) || 0;
            
            // Calculate total duration
            const totalDuration = course.modules?.reduce((total, module) => {
              return total + (module.duration || 0);
            }, 0) || 0;
            
            return (
              <div key={course._id} className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition">
                {course.thumbnail && (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-32 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x200?text=Course+Thumbnail';
                    }}
                  />
                )}
                <div className="p-3">
                  <h3 className="font-bold text-lg mb-1 truncate">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span className="capitalize">{course.category}</span>
                    <span>{course.instructor || 'Spiritus Experts'}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">₹{(course.fee || 0).toLocaleString()}</span>
                    <span>{course.totalEnrollments || 0} enrolled</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span>{totalDuration} min</span>
                    <span>{course.modules?.length || 0} modules</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      course.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditCourse(course)} 
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Edit course"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course._id)} 
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete course"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {courses.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No courses found. Click "Add Course" to create your first course.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <CourseForm
          course={selectedCourse}
          onSave={handleSaveCourse}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageCourses;