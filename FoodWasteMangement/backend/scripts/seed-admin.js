require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@foodwaste.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log(`📧 Email: ${existingAdmin.email}`);
            console.log(`👤 Name: ${existingAdmin.name}`);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: process.env.ADMIN_NAME || 'System Administrator',
            email: adminEmail,
            password: process.env.ADMIN_PASSWORD || 'Admin@123',
            role: 'admin',
            phoneNumber: '+91-1234567890',
            location: 'India',
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📧 Email: ${admin.email}`);
        console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
        console.log(`👤 Name: ${admin.name}`);
        console.log(`🎭 Role: ${admin.role}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('⚠️  Please change the password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
