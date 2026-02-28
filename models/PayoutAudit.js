import mongoose from 'mongoose';

const payoutAuditSchema = new mongoose.Schema({
    payout_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payout',
        required: true
    },
    action: {
        type: String,
        enum: ['CREATED', 'SUBMITTED', 'APPROVED', 'REJECTED'],
        required: true
    },
    performed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    previous_status: String,
    new_status: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const PayoutAudit = mongoose.model('PayoutAudit', payoutAuditSchema);
export default PayoutAudit;
