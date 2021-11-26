const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    description:{
        type: String,
        required: true
    },
    richDescription:{
        type:String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images:[{
        type: String
    }],
    brand:{
        type: String,
        default: ''
    },
    price:{
        type: Number,
        default: 0
    },
    category:{//Esta id conecta con el esquema de categoria
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    countInStock:{
        type: Number,
        required: true,
        min:0,
        max:255
    },
    rating:{
        type:Number,
        default:0
    },
    numReviews:{
        type:Number,
        default:0
    },
    isFeatured:{
        type: Boolean,
        default: false
    },
    dateCreated:{
        type: Date,
        default: Date.now()
    }
})

//es una variable virtual, o sea que no ocupa memoria,
//solo es una representacion de los datos, en este caso la id para ayudar al front
ProductSchema.virtual('id').get(function () {
    return this._id.toHexString();//lo pasa a string
});
ProductSchema.set('toJSON', {
    virtuals: true,
});



module.exports = mongoose.model('Product', ProductSchema);;