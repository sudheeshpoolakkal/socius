
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import itemModel from './models/itemModel.js';
import userModel from './models/userModel.js';
import bcrypt from 'bcrypt';

dotenv.config();

const seedItems = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/spiritus`);
        console.log('Connected to DB');

        // Get a user to be the owner
        let user = await userModel.findOne();
        if (!user) {
            console.log('No users found. Creating a default user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("password123", salt);
            const newUser = new userModel({
                name: "Community Admin",
                email: "admin@socius.com",
                password: hashedPassword,
                phone: "1234567890",
                address: { line1: "Socius HQ", line2: "Cloud City" },
                gender: "Other",
                dob: "2000-01-01"
            });
            user = await newUser.save();
            console.log('Default user created:', user.email);
        }

        const items = [
            {
                name: "Bosch Power Drill",
                description: "Cordless drill driver, perfect for home DIY projects. Includes 2 batteries.",
                category: "Tools",
                deposit: 500,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://res.cloudinary.com/dwyosqqpv/image/upload/v1767123000/sample_drill.jpg",
                date: Date.now()
            },
            {
                name: "Camping Tent (4 Person)",
                description: "Spacious tent for weekend getaways. Easy to set up.",
                category: "Camping",
                deposit: 1000,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://res.cloudinary.com/dwyosqqpv/image/upload/v1767123001/sample_tent.jpg",
                date: Date.now()
            },
            {
                name: "DSLR Camera Canon EOS",
                description: "Great for photography enthusiasts. Lens kit included.",
                category: "Electronics",
                deposit: 5000,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://res.cloudinary.com/dwyosqqpv/image/upload/v1767123002/sample_camera.jpg",
                date: Date.now()
            },
            {
                name: "BBQ Grill Set",
                description: "Portable charcoal grill for outdoor parties.",
                category: "Party",
                deposit: 800,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://res.cloudinary.com/dwyosqqpv/image/upload/v1767123003/sample_grill.jpg",
                date: Date.now()
            }
        ];

        await itemModel.insertMany(items);
        console.log('Items seeded successfully');
        console.log('Connected to DB Name:', mongoose.connection.name);
        const count = await itemModel.countDocuments();
        console.log('Total items in DB:', count);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedItems();
