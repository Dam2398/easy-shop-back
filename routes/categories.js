const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/categoryController");


router.get('/all',categoryController.getAll);
router.get('/:id',categoryController.getById);
router.post('/new', categoryController.newCategory);
router.delete('/:id', categoryController.deleteCategory);
router.patch('/:id',categoryController.editCategory);

module.exports = router; 