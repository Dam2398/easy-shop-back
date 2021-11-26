const Category = require("../models/Category");
//import {Category} from "../models/Category";


exports.getAll = async (req, res)=>{
    try {
        const categoryList = await Category.find();
        res.status(201).json(categoryList);
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,msg:'No hay categorias'});
    }
}

exports.getById = async (req, res)=>{
    try {
        let category = await Category.findById(req.params.id);
        res.status(201).json(category);
    } catch (error) {
        res.status(501).json({success:false,msg:'No existe la categoria'});
    }
}

exports.newCategory = async (req, res)=>{
    let cate;
    try {
        let category = new Category({
            name: req.body.name,
            color: req.body.color, 
            icon: req.body.icon,
            image:req.body.image
        });
        cate = await category.save();
        res.status(201).json(cate);

    } catch (error) { 
        console.log(error);
        res.status(500).json({success:false,msg:'Hubo un error'})
    }
}

exports.editCategory = async (req, res)=>{
    try {
        await Category.findById(req.params.id);
    } catch (error) {
        res.status(400).json({msg:"the category cannot be created!"})
    }
    try {
        const category = await Category.findOneAndUpdate({_id: req.params.id},{
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },{new:true})//true para de new data

        res.status(205).json(category)
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, msg: 'hubo un error'});
    }
}

exports.deleteCategory = async (req,res)=>{
    try {
        await Category.findById(req.params.id);
    } catch (error) {
        res.status(400).json( {success:false, msg: 'No existe la categoria'} )
    };
    try {//cambialo y pon que no hay elemntos
        await Category.findByIdAndRemove(req.params.id);
        res.status(250).json({success:true, msg: 'Categoria eliminado con exito!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, msg: 'hubo un error'});
    }
}