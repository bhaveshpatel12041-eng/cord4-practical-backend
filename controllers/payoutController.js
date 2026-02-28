import Payout from '../models/Payout.js';
import PayoutAudit from '../models/PayoutAudit.js';

// Helper to create audit log
const createAuditLog = async (payout_id, action, performed_by, previous_status, new_status) => {
    await PayoutAudit.create({
        payout_id,
        action,
        performed_by,
        previous_status,
        new_status
    });
};

// @desc    Get all payouts
// @route   GET /api/payouts
// @access  Private
// Allows filtering by status and vendor_id
export const getPayouts = async (req, res) => {
    try {
        const { status, vendor_id } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (vendor_id) filter.vendor_id = vendor_id;

        const payouts = await Payout.find(filter).populate('vendor_id', 'name').sort({ createdAt: -1 });
        res.json(payouts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single payout with audit trail
// @route   GET /api/payouts/:id
// @access  Private
export const getPayoutById = async (req, res) => {
    try {
        const payout = await Payout.findById(req.params.id)
            .populate('vendor_id')
            .populate('created_by', 'email role');

        if (!payout) {
            return res.status(404).json({ message: 'Payout not found' });
        }

        const auditTrail = await PayoutAudit.find({ payout_id: payout._id })
            .populate('performed_by', 'email role')
            .sort({ timestamp: -1 });

        res.json({ payout, auditTrail });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a payout
// @route   POST /api/payouts
// @access  Private (OPS)
export const createPayout = async (req, res) => {
    const { vendor_id, amount, mode, note } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    try {
        const payout = new Payout({
            vendor_id,
            amount,
            mode,
            note,
            status: 'Draft',
            created_by: req.user._id
        });

        const createdPayout = await payout.save();
        await createAuditLog(createdPayout._id, 'CREATED', req.user._id, null, 'Draft');

        res.status(201).json(createdPayout);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Submit a payout
// @route   POST /api/payouts/:id/submit
// @access  Private (OPS)
export const submitPayout = async (req, res) => {
    try {
        const payout = await Payout.findById(req.params.id);
        if (!payout) return res.status(404).json({ message: 'Payout not found' });

        if (payout.status !== 'Draft') {
            return res.status(400).json({ message: 'Only Draft payouts can be submitted' });
        }

        payout.status = 'Submitted';
        await payout.save();
        await createAuditLog(payout._id, 'SUBMITTED', req.user._id, 'Draft', 'Submitted');

        res.json(payout);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Approve a payout
// @route   POST /api/payouts/:id/approve
// @access  Private (FINANCE)
export const approvePayout = async (req, res) => {
    try {
        const payout = await Payout.findById(req.params.id);
        if (!payout) return res.status(404).json({ message: 'Payout not found' });

        if (payout.status !== 'Submitted') {
            return res.status(400).json({ message: 'Only Submitted payouts can be approved' });
        }

        payout.status = 'Approved';
        await payout.save();
        await createAuditLog(payout._id, 'APPROVED', req.user._id, 'Submitted', 'Approved');

        res.json(payout);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Reject a payout
// @route   POST /api/payouts/:id/reject
// @access  Private (FINANCE)
export const rejectPayout = async (req, res) => {
    const { decision_reason } = req.body;

    if (!decision_reason) {
        return res.status(400).json({ message: 'Decision reason is required when rejecting a payout' });
    }

    try {
        const payout = await Payout.findById(req.params.id);
        if (!payout) return res.status(404).json({ message: 'Payout not found' });

        if (payout.status !== 'Submitted') {
            return res.status(400).json({ message: 'Only Submitted payouts can be rejected' });
        }

        payout.status = 'Rejected';
        payout.decision_reason = decision_reason;
        await payout.save();

        await createAuditLog(payout._id, 'REJECTED', req.user._id, 'Submitted', 'Rejected');

        res.json(payout);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
