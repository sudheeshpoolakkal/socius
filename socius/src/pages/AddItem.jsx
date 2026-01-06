import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

// Categories constant
const categories = ['Tools', 'Electronics', 'Kitchen', 'Books', 'Sports', 'Camping', 'Party', 'Gardening'];

const AddItem = () => {
    const navigate = useNavigate();
    const { backendUrl, token, getItemsData } = useContext(AppContext);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [deposit, setDeposit] = useState('');
    const [price, setPrice] = useState('');
    const [isBuyable, setIsBuyable] = useState(false);
    const [isBorrowable, setIsBorrowable] = useState(true);
    const [address, setAddress] = useState(''); // Simple string for now
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!image) {
                return toast.error('Please upload an image');
            }

            // We need to upload image first or send as multipart form data if backend handles it
            // itemController.addItem expects: name, category, description, address, deposit, image (url)
            // But adminController.addDoctor handled file upload. 
            // My refactored itemController.addItem (Step 193) expects `image` in body, suggesting URL or handling it.
            // Wait, adminController.addDoctor used `req.file` and Cloudinary upload.
            // My refactored `addItem` in Step 193 just takes `req.body.image`. This implies I need to handle upload separately or update controller to handle file.
            // Let's check itemController again.
            // Step 193: const { image } = req.body; ... const newItem = new itemModel({..., image, ...});
            // It assumes specific image URL logic or that it receives a URL.
            // However, `userController.updateProfile` handles file upload.
            // I should probably update `itemController` to handle file upload OR upload from frontend.
            // Frontend upload is easier if I use a generic upload endpoint or rely on `itemController` using `upload.single` middleware.
            // `itemRoute.js` (Step 200) uses `upload.single`? No, it just says `itemRouter.post('/add', authUser, addItem)`.
            // It does NOT have `upload.single('image')`.
            // So `addItem` expects JSON body with image URL.

            // To fix this without changing backend again just yet:
            // I'll add `upload` middleware to `itemRoute.js` OR implement a separate upload endpoint.
            // Actually, `userController.uploadProfileImage` exists.
            // Let's modify `itemRoute` to support file upload or use a utility.
            // For now, I will blindly try to send a URL if I can't upload.
            // But real users need to upload.
            // I'll assume I need to update `itemRoute.js` to include `upload.single('image')` and `itemController` to handle `req.file`.

            // Wait, let's look at `adminController.addDoctor` again (Step 195). It used `req.file`.
            // I replaced `doctorController` with `itemController` (Step 193).
            // My `addItem` impl: `const { ... image } = req.body`.
            // It does NOT handle `req.file`.
            // I missed the file upload logic in `itemController`.

            // I should update `itemController.js` to handle file upload using Cloudinary, similar to `addDoctor`.
            // AND update `itemRoute.js` to use `upload` middleware.

            // For now, I'll write this component assuming I WILL fix the backend in the next steps.

            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('deposit', deposit);
            formData.append('price', price);
            formData.append('isBuyable', isBuyable);
            formData.append('isBorrowable', isBorrowable);
            formData.append('address', JSON.stringify({ line1: address, formatted: address })); // Hack for object
            formData.append('image', image);

            // This requires backend update.
            const { data } = await axios.post(backendUrl + '/api/item/add', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // axios sets this automatically for FormData but explicit is fine
                }
            });

            if (data.success) {
                toast.success(data.message);
                getItemsData(); // Refresh list
                navigate('/my-items');
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">List an Item</h1>

            <form onSubmit={onSubmitHandler} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                            {image ? (
                                <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400 text-2xl">📷</span>
                            )}
                        </div>
                        <input
                            type="file"
                            id="image"
                            hidden
                            onChange={(e) => setImage(e.target.files[0])}
                            accept="image/*"
                        />
                        <label htmlFor="image" className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition text-sm font-medium">
                            Choose Image
                        </label>
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-primary outline-none"
                        placeholder="e.g., Cordless Drill"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-primary outline-none"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                {/* Listing Type Selection */}
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition flex-1">
                        <input
                            type="checkbox"
                            checked={isBorrowable}
                            onChange={(e) => setIsBorrowable(e.target.checked)}
                            className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        <span className="font-medium text-gray-700">Available for Borrow (Rent)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition flex-1">
                        <input
                            type="checkbox"
                            checked={isBuyable}
                            onChange={(e) => setIsBuyable(e.target.checked)}
                            className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        <span className="font-medium text-gray-700">Available for Sale</span>
                    </label>
                </div>

                {/* Price & Deposit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isBorrowable && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Refundable Deposit (₹)
                            </label>
                            <input
                                type="number"
                                required={isBorrowable}
                                value={deposit}
                                onChange={(e) => setDeposit(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-primary outline-none"
                                placeholder="e.g. 500"
                            />
                        </div>
                    )}

                    {isBuyable && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Selling Price (₹)
                            </label>
                            <input
                                type="number"
                                required={isBuyable}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-primary outline-none"
                                placeholder="e.g. 1500"
                            />
                        </div>
                    )}
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                    <textarea
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-primary outline-none"
                        placeholder="Your full address"
                        rows={2}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-primary outline-none"
                        placeholder="Describe the condition, age, etc."
                        rows={3}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-bold transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'}`}
                >
                    {loading ? 'Adding Item...' : 'List Item'}
                </button>

            </form>
        </div>
    );
};

export default AddItem;
