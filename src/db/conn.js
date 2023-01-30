const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/RCOEM_Employee" , {
    useNewUrlParser:true
}).then(() =>{
    console.log(`Connection succesful`);
}).catch((e)=>{
    console.log(`No Connection`);
})

mongoose.set('strictQuery', false);