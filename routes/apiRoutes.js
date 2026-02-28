import express from 'express';
import { getVendors, createVendor } from '../controllers/vendorController.js';
import { getPayouts, createPayout, getPayoutById, submitPayout, approvePayout, rejectPayout } from '../controllers/payoutController.js';
import { protect, authorize } from '../middleware/auth.js';

const vendorRouter = express.Router();
const payoutRouter = express.Router();

// Vendor Routes
vendorRouter.route('/')
    .get(protect, getVendors)
    .post(protect, createVendor);

// Payout Routes
payoutRouter.route('/')
    .get(protect, getPayouts)
    .post(protect, authorize('OPS'), createPayout);

payoutRouter.route('/:id')
    .get(protect, getPayoutById);

payoutRouter.route('/:id/submit')
    .post(protect, authorize('OPS'), submitPayout);

payoutRouter.route('/:id/approve')
    .post(protect, authorize('FINANCE'), approvePayout);

payoutRouter.route('/:id/reject')
    .post(protect, authorize('FINANCE'), rejectPayout);

export { vendorRouter, payoutRouter };
