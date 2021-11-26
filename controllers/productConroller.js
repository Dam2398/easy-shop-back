const Producto = require("../models/Product");
const Category = require("../models/Category");
const multer = require("multer");


const FILE_TYPE_MAP ={
    'image/png': 'png',    //MIME types (media types)
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}
//mantener el control de como y odnde guardar los archivos
//The disk storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid =  FILE_TYPE_MAP[file.mimetype];
        let uploadErro = new Error('Invalid image type')
        if(isValid){
            uploadErro = null
        }
      cb(uploadErro, 'public/uploads')
    },
    filename: function (req, file, cb) {
    
        const fileNname = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype]//mimetype es 'image/png'
      cb(null,`${fileNname}-${Date.now()}.${extension}`)
    }
  })
   
exports.uploadOptions = multer({ storage: storage });

exports.newProduct = async (req, res)=>{

    try {
        await Category.findById(req.body.category);
    } catch (error) {
        console.log(error)
        res.status(502).json({success:false,msg:'Error Categoria'})
    }

    let pro;
    try {
        
        //error de no image
        const file = req.file;
        if(!file){
            res.status(400).json({success:false,msg:'No image in the request'})
        } 
            
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`
        //  http://localhost:3000/public/upload/image-2323232
        let producto = new Producto({
            name: req.body.name,
            description: req.body.description,
            richDescription:req.body.richDescription,
            image: `${basePath}${fileName}`,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating:req.body.rating,
            numReviews:req.body.numReviews,
            isFeatured:req.body.isFeatured
        });

        pro = await producto.save();
        res.status(201).json(pro)

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,msg:'Hubo un error'})
    }
};

exports.getProducts = async (req, res)=>{//Productos con un tipo de categoria
    //localhost://ascasd?categories=123456,135484
    let filter={};//es objeto porque si no se manda alguna cateogria se puede obtener todas las categorias
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')};
    }

    try {//SELECT
       //const productos = await Producto.find(filter).select('name image category').populate('category');//seleccionamos lo que queremos y quitamos la id ('name image -_id') con el menos
       const productos = await Producto.find(filter).populate('category');
       if(!productos){//no sirve el if
            res.status(501).json({success:false,msg:'No hay productos'});
       }else{
           res.status(201).json(productos);
       }
       
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,msg:'Hubo un error'});
    }
};

exports.getById = async (req, res)=>{
    try {
        let product = await Producto.findById(req.params.id).populate('category');//con populate tambien se muestran los datos de la otra tabla, 'category' es el nombre en el esquema
        res.status(201).json(product);
    } catch (error) {
        res.status(501).json({success:false,msg:'No existe producto'});
    }
};

exports.editPro = async (req,res)=>{
    const id= req.params.id;
    try {//validacion de la categoria
        await Category.findById(req.body.category);
    } catch (error) {
        console.log(error)
        res.status(502).json({success:false,msg:'Error Categoria'})
    }
    let imagepath;
    try {//Verificar si esxiste el producto, porque solo actualiza aunque este mal
        const oldProduct = await Producto.findById(id);

        const file = req.file;
        if (file) {//si manda nueva foto
            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            imagepath = `${basePath}${fileName}`;
        } else {//se queda con la misma
            imagepath = oldProduct.image;
        }
    } catch (error) {
        res.status(400).json({msg:"the product cannot be found!"})
    }
    try {
        const product = await Producto.findOneAndUpdate({_id: id},{//OJO CON LA ID
            name: req.body.name,
            description: req.body.description,
            richDescription:req.body.richDescription,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating:req.body.rating,
            numReviews:req.body.numReviews,
            isFeatured:req.body.isFeatured
        },{new:true})//true para de new data
        //console.log(product._id)
        res.status(205).json(product)
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, msg: 'hubo un error'});
    }
};

exports.deletePro = async (req,res)=>{
    try {
        await Producto.findById(req.params.id);
    } catch (error) {
        res.status(400).json( {success:false, msg: 'No existe producto'} )
    };
    try {//cambialo y pon que no hay elemntos
        await Producto.findByIdAndRemove(req.params.id);
        res.status(250).json({success:true, msg: 'Producto eliminado con exito!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, msg: 'hubo un error'});
    }
};

exports.count = async (req,res)=>{//Listo
    try {
        const ProductCount = await Product.countDocuments((count)=>count)
        if (!ProductCount) {
            res.status(500).json({success:false,msg:'Is empty'})
        } else {
            res.status(220).json({success:true,ProductCount});
        }
    } catch (error) {
        console.log(error);
        res.status(410).json({success:false})
    }
};

exports.featured = async (req,res)=>{//Lista
    try {
        const count = req.params.count ? req.params.count : 0;//el count para poner un maximo de de productos
        const Products = await Product.find({isFeatured:true}).limit(+count) //Tipo where || se pone el + para pasar struing a number
        if (!Products) {
            res.status(500).json({success:false,msg:'Is empty'})
        } else {
            res.status(220).json({success:true,Products});
        }
    } catch (error) {
        console.log(error);
        res.status(410).json({success:false})
    }
};

exports.gallery = async(req,res)=>{
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    try {
        if (files) {
            files.map(f =>{
                imagesPaths.push(`${basePath}${f.filename}`)
            })
        }
        const product = await Producto.findByIdAndUpdate(req.params.id,{
            images: imagesPaths
        },{new:true})

        res.status(205).json(product)
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, msg: 'hubo un error'});
    }

};