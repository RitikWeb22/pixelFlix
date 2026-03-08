require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('./src/models/auth.model');

async function makeUserAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get email from command line argument
        const email = process.argv[2];

        if (!email) {
            console.log('❌ Please provide an email address');
            console.log('Usage: node makeAdmin.js <email>');
            process.exit(1);
        }

        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            console.log(`❌ User with email "${email}" not found`);
            process.exit(1);
        }

        // Update role to admin
        user.role = 'admin';
        await user.save();

        console.log(`✅ User "${user.username}" (${user.email}) is now an ADMIN!`);
        console.log('Please logout and login again to refresh your session.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

makeUserAdmin();
