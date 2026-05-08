const mongoose = require("mongoose")

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("server is Connected to DB"); 
    })
    .catch((err) =>{
        console.log("error connected to DB");
        process.exit(1)
    })
}

module.exports = connectToDB
