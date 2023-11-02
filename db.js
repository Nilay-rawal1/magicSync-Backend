const mongoose =require('mongoose');


const  mongoUri="mongodb://127.0.0.1/MagicSync"


const connectMongo = ()=>{
    mongoose.connect(mongoUri);
    console.log("connected to mongo");
}

module.exports= connectMongo;