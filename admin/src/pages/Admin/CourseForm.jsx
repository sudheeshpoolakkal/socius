import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';

const CourseForm = ({ course, onSave, onCancel }) => {
  const { courseCategories, getCourseCategories } = useContext(AdminContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    thumbnail: '',
    fee: 0,
    prerequisites: '',
    outcomes: '',
    instructor: '',
    isPublished: true,
  });

  useEffect(() => {
    getCourseCategories();
  }, []);

  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
        prerequisites: course.prerequisites.join(', '),
        outcomes: course.outcomes.join(', '),
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      prerequisites: formData.prerequisites.split(',').map(p => p.trim()),
      outcomes: formData.outcomes.split(',').map(o => o.trim()),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{course ? 'Edit Course' : 'Add Course'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select name="category" id="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" required>
                <option value="">Select a category</option>
                {courseCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" rows="4" required />
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
              <select name="level" id="level" value={formData.level} onChange={handleChange} className="w-full p-2 border rounded">
                <option>beginner</option>
                <option>intermediate</option>
                <option>advanced</option>
              </select>
            </div>
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
              <input type="text" name="thumbnail" id="thumbnail" value={formData.thumbnail} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="fee" className="block text-sm font-medium text-gray-700">Fee</label>
              <input type="number" name="fee" id="fee" value={formData.fee} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">Instructor</label>
              <input type="text" name="instructor" id="instructor" value={formData.instructor} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700">Prerequisites (comma-separated)</label>
              <textarea name="prerequisites" id="prerequisites" value={formData.prerequisites} onChange={handleChange} className="w-full p-2 border rounded" rows="2" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="outcomes" className="block text-sm font-medium text-gray-700">Outcomes (comma-separated)</label>
              <textarea name="outcomes" id="outcomes" value={formData.outcomes} onChange={handleChange} className="w-full p-2 border rounded" rows="2" />
            </div>
            <div className="md:col-span-2 flex items-center">
              <input type="checkbox" name="isPublished" id="isPublished" checked={formData.isPublished} onChange={handleChange} className="mr-2" />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">Published</label>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
