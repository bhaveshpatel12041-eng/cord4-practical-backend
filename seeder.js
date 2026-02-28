import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Vendor from './models/Vendor.js';
import Payout from './models/Payout.js';
import PayoutAudit from './models/PayoutAudit.js';
import connectDB from './db/connect.js';

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await User.deleteMany();
        await Vendor.deleteMany();
        await Payout.deleteMany();
        await PayoutAudit.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedOpsPassword = await bcrypt.hash('ops123', salt);
        const hashedFinPassword = await bcrypt.hash('fin123', salt);

        const createdUsers = await User.insertMany([
            {
                email: 'ops@demo.com',
                password: hashedOpsPassword,
                role: 'OPS'
            },
            {
                email: 'finance@demo.com',
                password: hashedFinPassword,
                role: 'FINANCE'
            }
        ]);

        const createdVendors = await Vendor.insertMany([
            {
                name: 'Tech Corp',
                upi_id: 'techcorp@upi',
                bank_account: '1234567890',
                ifsc: 'HDFC0001234'
            },
            {
                name: 'Globex Inc',
                upi_id: 'globex@upi',
                bank_account: '0987654321',
                ifsc: 'ICIC0005678'
            }
        ]);

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding data: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Vendor.deleteMany();
        await Payout.deleteMany();
        await PayoutAudit.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error with destroying data: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    seedData();
}
