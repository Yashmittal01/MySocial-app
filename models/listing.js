const mongoose =require("mongoose");
const review = require("./comment");
const { number } = require("joi");
const schema= mongoose.Schema;
const listingschema = new schema({
    
    caption: String,
    image:{
       url: String,
       filename: String
    },
    likes:{
        type: Number,
    },
    comment:[{
        type: schema.Types.ObjectId,
        ref: "comment"
    }],
    owner:{
        type: schema.Types.ObjectId,
        ref: "user"
    }
});
listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await review.deleteMany({_id: {$in: listing.review}});
    }
});

const listing = mongoose.model("listing", listingschema);
module.exports = listing;
