const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    quantity:{
        type: Number,
        require:true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require:true//Pusiste que es requerido
    }
})

module.exports = mongoose.model('OrderItems', OrderItemSchema)