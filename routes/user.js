const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/all', userController.getAll);
router.get('/:id', userController.getById);
router.post('/new', userController.newUser);
router.post('/login',userController.login);
router.get('/get/count', userController.count);
router.delete('/:id', userController.delete);
router.patch('/:id',userController.edit);






module.exports = router;