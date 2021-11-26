const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.get('/', orderController.all);
router.get('/:id', orderController.ById);
router.post('/', orderController.new);
router.patch('/:id',orderController.edit);
router.delete('/:id', orderController.delete);
router.get('/get/totalsales', orderController.totalsales);
router.get('/get/count', orderController.count);
router.get('/get/userOrders/:id', orderController.userOrder);

module.exports = router;