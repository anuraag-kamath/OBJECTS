const mongoose = require('mongoose')


var url = process.env.OBJ_MONGODB_URL || "mongodb://localhost:27017/objs"

mongoose.connect(url, () => {
    console.log("DB connected successfully @ ", url);
})


module.exports = {
    mongoose
} 