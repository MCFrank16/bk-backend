import express from 'express';

import adminRouter from '../components/admin/router';
import orderRouter from '../components/order/router';
import farmerRouter from '../components/farmer/router';
import productRouter from '../components/product/router';


const router = express.Router();

router.get("/", (req, res) => {
    res.send("Farmer ordering API.");
});

router.use('/admin', adminRouter);
router.use('/order', orderRouter);
router.use('/farmer', farmerRouter);
router.use('/product', productRouter);

export default router;
