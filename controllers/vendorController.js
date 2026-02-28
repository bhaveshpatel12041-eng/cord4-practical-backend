import Vendor from '../models/Vendor.js';

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Private (OPS and FINANCE)
export const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({});
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new vendor
// @route   POST /api/vendors
// @access  Private (OPS or FINANCE depending on rules, let's say both can or OPS only. Requirements don't strictly isolate Vendor creation, so we allow both)
export const createVendor = async (req, res) => {
    const { name, upi_id, bank_account, ifsc } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Vendor name is required' });
    }

    try {
        const vendor = new Vendor({
            name,
            upi_id,
            bank_account,
            ifsc
        });

        const createdVendor = await vendor.save();
        res.status(201).json(createdVendor);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
