const mongoose =require('mongoose');


const  mongoUri="mongodb://localhost:27017/"

const connectMongo = ()=>{
    mongoose.connect(mongoUri);
    console.log("connected to mongo");
}

module.exports= connectMongo;