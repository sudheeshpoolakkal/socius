
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

        // Clear existing items
        await itemModel.deleteMany({});
        console.log('Cleared existing items');

        const items = [
            // Tools
            {
                name: "Bosch Power Drill",
                description: "Cordless drill driver, perfect for home DIY projects. Includes 2 batteries.",
                category: "Tools",
                deposit: 500,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },
            {
                name: "Toolbox Set (50-piece)",
                description: "Complete set of essential tools including hammer, pliers, wrenches, and screwdrivers.",
                category: "Tools",
                deposit: 300,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },
            {
                name: "Heavy Duty Ladder",
                description: "10ft aluminum ladder, lightweight but sturdy. Great for painting or repairs.",
                category: "Tools",
                deposit: 400,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },

            // Electronics
            {
                name: "DSLR Camera Canon EOS",
                description: "Great for photography enthusiasts. Lens kit 18-55mm included.",
                category: "Electronics",
                deposit: 5000,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },
            {
                name: "GoPro Hero 9",
                description: "Capture your adventures in 5K. Waterproof and rugged.",
                category: "Electronics",
                deposit: 2000,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },
            {
                name: "Projector (1080p)",
                description: "Portable projector for movie nights. HDMI and USB compatible.",
                category: "Electronics",
                deposit: 1500,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },

            // Kitchen
            {
                name: "Stand Mixer",
                description: "Professional grade stand mixer for baking. Includes whisk, dough hook, and beater.",
                category: "Kitchen",
                deposit: 1200,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },
            {
                name: "Pasta Maker",
                description: "Manual pasta machine for fresh homemade noodles.",
                category: "Kitchen",
                deposit: 400,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1613634326309-7fe54ed25ffa?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFzdGElMjBtYWtlciUyMG1hY2hpbmV8ZW58MHx8MHx8fDA%3D",
                date: Date.now()
            },
            {
                name: "Chocolate Fountain",
                description: "3-tier chocolate fondue fountain for parties and events.",
                category: "Kitchen",
                deposit: 600,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1565898161012-6489d2a73ce8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvY29sYXRlJTIwZm91bnRhaW58ZW58MHx8MHx8fDA%3D",
                date: Date.now()
            },

            // Camping
            {
                name: "Camping Tent (4 Person)",
                description: "Spacious tent for weekend getaways. Weather resistant and easy setup.",
                category: "Camping",
                deposit: 1000,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },
            {
                name: "Camping Stove",
                description: "Portable 2-burner propane stove. Ideal for car camping.",
                category: "Camping",
                deposit: 500,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },
            {
                name: "Sleeping Bag (0°F)",
                description: "Cold weather sleeping bag, freshly cleaned. Stay warm!",
                category: "Camping",
                deposit: 300,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1558477280-1bfed08ea5db?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2xlZXBpbmclMjBiYWd8ZW58MHx8MHx8fDA%3D",
                date: Date.now()
            },

            // Sports
            {
                name: "Tennis Rackets (Pair)",
                description: "Two Wilson tennis rackets with a pack of balls.",
                category: "Sports",
                deposit: 400,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },
            {
                name: "Mountain Bike",
                description: "Hardtail mountain bike, frame size L. Helmet included.",
                category: "Sports",
                deposit: 3000,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1506316940527-4d1c138978a0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW4lMjBiaWtlfGVufDB8fDB8fHww",
                date: Date.now()
            },
            {
                name: "Kayak (Inflatable)",
                description: "2-person inflatable kayak with paddles and pump. Fun for the lake!",
                category: "Sports",
                deposit: 1500,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },

            // Party
            {
                name: "BBQ Grill Set",
                description: "Portable charcoal grill for outdoor parties.",
                category: "Party",
                deposit: 800,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },
            {
                name: "Karaoke Machine",
                description: "Bluetooth karaoke machine with 2 microphones. Party favorite!",
                category: "Party",
                deposit: 800,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1741594347991-4ad8bb863eb5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2FyYW9rZSUyMG1pY3JvcGhvbmV8ZW58MHx8MHx8fDA%3D",
                date: Date.now()
            },
            {
                name: "Folding Chairs (Set of 6)",
                description: "Sturdy folding chairs for extra seating at events.",
                category: "Party",
                deposit: 300,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1554941829-fcef7b298d5d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9sZGluZyUyMGNoYWlyfGVufDB8fDB8fHww",
                date: Date.now()
            },

            // Gardening
            {
                name: "Electric Lawnmower",
                description: "Corded electric lawnmower. Quiet and eco-friendly.",
                category: "Gardening",
                deposit: 1000,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1690068023694-053da714f95f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGF3bm1vd2VyfGVufDB8fDB8fHww",
                date: Date.now()
            },
            {
                name: "Hedge Trimmer",
                description: "Battery powered hedge trimmer for keeping your bushes neat.",
                category: "Gardening",
                deposit: 600,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1562823212-71febdbacb41?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyZGVuaW5nJTIwc2hlYXJzfGVufDB8fDB8fHww",
                date: Date.now()
            },

            // Books
            {
                name: "The Lord of the Rings Set",
                description: "Complete trilogy paperback set. A classic read.",
                category: "Books",
                deposit: 200,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                date: Date.now()
            },
            {
                name: "Sapiens: A Brief History",
                description: "Hardcover edition of Sapiens by Yuval Noah Harari.",
                category: "Books",
                deposit: 150,
                address: { line1: "123 Main St", line2: "Apt 4B" },
                owner: user._id,
                available: true,
                image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
