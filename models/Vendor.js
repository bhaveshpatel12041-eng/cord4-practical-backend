import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    upi_id: {
        type: String,
        trim: true
    },
    bank_account: {
        type: String,
        trim: true
    },
    ifsc: {
        type: String,
        trim: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
