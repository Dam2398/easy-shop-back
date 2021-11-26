const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAll = async (req, res)=>{
    try {
        const userList = await User.find().select('-passwordHash');
        if(!userList){
            res.status(501).json({success:false,msg:'No hay usuarios'});
        }else{
            res.status(201).json(userList);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,msg:'Error'});
    }
};

exports.getById = async (req, res)=>{
    try {
        let user = await User.findById(req.params.id).select('-passwordHash');
        res.status(201).json(user);
    } catch (error) {
        res.status(501).json({success:false,msg:'No existe el usuario'});
    }
};

exports.newUser = async (req, res)=>{
    let cate;
    try {
        let user = new User({
            name: req.body.name,
            email: req.body.email, 
            passwordHash: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
            phone:req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street, 
            apartment: req.body.apartment,
            zip:req.body.zip,
            city: req.body.city,
            country: req.body.country
        });
        cate = await user.save();
        res.status(201).json(cate);

    } catch (error) { 
        console.log(error);
        res.status(500).json({success:false,msg:'Hubo un error'})
    }
};

exports.login = async (req, res)=>{
    const secret = process.env.secret;
    try {
        const user = await User.findOne({email: req.body.email });
        if (!user) {
            res.status(410).json({msg: 'email or password incorrect'});
        } 
        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign({
                    userId: user.id, 
                    isAdmin: user.isAdmin
                },//si es administrador ||mejora la seguridad que solo mandar el rol || se personaliza el token
                secret,
                { expiresIn: '1h' });

            res.status(205).json(   {success:true,
                                    id:user.id,
                                    name: user.name,
                                    token})
        }else{
            res.status(411).json({msg: 'email or password incorrect'});
        }
    } catch (error) {
        res.status(500).json({success:false,msg:'Hubo un error'})
    }
}

exports.count = async (req,res)=>{//Listo
    try {
        const UserCount = await User.countDocuments((count)=>count)
        if (!UserCount) {
            res.status(500).json({success:false,msg:'Is empty'})
        } else {
            res.status(220).json({success:true,UserCount});
        }
    } catch (error) {
        console.log(error);
        res.status(410).json({success:false})
    }
}

exports.delete = async (req,res)=>{
    try {
        await User.findById(req.params.id);
    } catch (error) {
        res.status(400).json( {success:false, msg: 'No existe el usuario'} )
    };
    try {//cambialo y pon que no hay elemntos
        await User.findByIdAndRemove(req.params.id);
        res.status(250).json({success:true, msg: 'Usuario eliminado con exito!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, msg: 'hubo un error'});
    }
}

exports.edit = async (req,res)=>{
    const id= req.params.id;
    let userExist
    let newPassword

    try {//Verificar si esxiste el usuario, porque solo actualiza aunque este mal
       userExist = await User.findById(id);
       if (req.body.password) {
           newPassword = bcrypt.hashSync(req.body.password, 10)
       } else {
           newPassword = userExist.passwordHash;
       }
    } catch (error) {
        res.status(400).json({msg:"the user cannot be found!"})
    }
    try {
        const user = await User.findByIdAndUpdate(id,{
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        },{new:true})
        res.status(205).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, msg: 'hubo un error'});
    }
};