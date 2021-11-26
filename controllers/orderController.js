const Order = require("../models/Order");
const OrderItem = require("../models/order-items")

exports.all = async (req,res) =>{
    try {
        //const orderList = await Order.find().populate('user','name').populate('orderItems'); || "dateOrdered" descending
        const orderList = await Order.find().populate('user','name').sort({'dateOrdered': -1});
        if(!orderList){
            res.status(501).json({success:false,msg:'No hay orders'});
       }else{
           res.status(201).json(orderList);//GOOD
       }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,msg:'Hubo un error'}); 
    }
}
//POPULATION OF THE RELATION BETWEEN THE TABLES IN DB
exports.ById = async (req,res) =>{
    try {
        const order = await Order.findById(req.params.id)
        .populate('user','name')
        .populate({
            path:'orderItems',populate: {
                path:'product', populate: 'category'}
            });
        if(!order){
            res.status(501).json({success:false,msg:'No hay orders'});
       }else{
           res.status(201).json(order);//GOOD
       }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,msg:'Hubo un error'}); 
    }
}

exports.new = async (req, res)=>{
    //map para el loop para todos los ids de las orders
    
    try {//Promise.all ya que se genera una promesa por cada order item
        const orderItemsIds = Promise.all(req.body.orderItems.map(async orderitem=>{//por cada orderitem
            let newOrderItem = new OrderItem({//crea una orderitem
                quantity: orderitem.quantity,
                product: orderitem.product
            })
            
            newOrderItem = await newOrderItem.save();//y guardarlo en la bd
    
            return newOrderItem._id;//orderItemsIds es esto || id de cada producto
        })) 
        const orderItemsIdsResolved =  await orderItemsIds;//para solucionar la promesa all
        //console.log(orderItemsIdsResolved)
        
        //totalPriceses un array || El total del precio se saca de la base de datos
        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (ItemId)=>{
            const orderItem = await OrderItem.findById(ItemId).populate('product', 'price');//obtener todo el json
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice
        }))
        console.log(totalPrices);

        const total = totalPrices.reduce((a,b)=> a+b,0)//sumar todos los valores

        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: total,
            user: req.body.user,
        });
        
        await order.save();
        res.status(201).json(order);
    } catch (error) { 
        console.log(error);
        res.status(500).json({success:false,msg:'Hubo un error'})
    }
}

exports.edit = async (req, res)=>{
    try {
        await Order.findById(req.params.id);
    } catch (error) {
        res.status(400).json({msg:"the order cannot be found!"})
    }
    try {
        const order = await Order.findByIdAndUpdate(req.params.id,{
            status: req.body.status
        },{new:true})//true para de new data

        res.status(205).json(order)
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, msg: 'hubo un error'});
    }
}

exports.delete = async (req,res)=>{
    try {//Validar que existe la orden
        const orden = await Order.findById(req.params.id);
        //console.log((orden.orderItems).length)
        //res.json(orden)
        Promise.all(orden.orderItems.map(async orderitem=>{//eliminamos order-item
            await OrderItem.findByIdAndRemove(orderitem)
            console.log('OK')
        }))
        
    } catch (error) {
        res.status(400).json( {success:false, msg: 'No existe order'} )
    };
    try {//eliminamo order
        await Order.findByIdAndRemove(req.params.id);
        res.status(250).json({success:true, msg: 'Order eliminado con exito!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, msg: 'hubo un error'});
    }
}

/* router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
}) */

exports.totalsales = async (req,res)=>{
    try {
        const totalSales= await Order.aggregate([//aggregate puede agrupar como join en bases relacionales
            { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
        ])

        if(!totalSales) {
            res.status(400).send('The order sales cannot be generated')
        }else{
            res.status(250).json({totalSales:totalSales.pop().totalsales});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, msg: 'hubo un error'});
    }

}

exports.count = async (req,res)=>{
    try {
        const orderCount = await Order.countDocuments((count)=>count)
        if (!orderCount) {
            res.status(500).json({success:false,msg:'Is empty'})
        } else {
            res.status(220).json({success:true,orderCount});
        }
    } catch (error) {
        console.log(error);
        res.status(410).json({success:false})
    }
}

exports.userOrder = async (req,res) =>{
    try {
        const userId = req.params.id;
        const userOrderList = await Order.find({user: userId}).populate({
            path:'orderItems',populate: {
                path:'product', populate: 'category'}
            }).sort({'dateOrdered': -1});
        if(!userOrderList){
            res.status(501).json({success:false,msg:'No hay orders'});
       }else{
           res.status(201).json(userOrderList);//GOOD
       }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,msg:'Hubo un error'}); 
    }
}