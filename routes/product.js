const express = require('express');
const router = express.Router();
const productController = require('../controllers/productConroller');


router.get('/all',productController.getProducts);
router.get('/:id',productController.getById);
router.post('/new',[productController.uploadOptions.single('image')],productController.newProduct);
router.patch('/:id',[productController.uploadOptions.single('image')],productController.editPro);
router.delete('/:id',productController.deletePro);
router.get('/get/count', productController.count);//solo sale con el 'get'
router.get('/get/featured/:count', productController.featured);
router.patch('/gallery-images/:id',[productController.uploadOptions.array('images',10)],productController.gallery)


module.exports = router;