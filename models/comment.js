const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const reviewSchema= new Schema({
    Comment: String,
    createdAt:{
        type: Date,
        default: Date.now
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"user",
    },
});
module.exports= mongoose.model("comment", reviewSchema);