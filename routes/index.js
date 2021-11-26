const express = require('express');
const router = express.Router();

const product = require('./product');
const category = require('./categories');
const user = require('./user');
const order = require('./order');




router.use('/product', product);
router.use('/category',category);
router.use('/user',user);
router.use('/order',order);


module.exports =router;