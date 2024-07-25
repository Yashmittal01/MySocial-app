const listing = require("../models/listing");

module.exports.like=async(req,res)=>{
    const{id}=req.params;
    const data=await listing.findById({_id:id});
    const like= data.likes;
    const newLikes=like+1;
    data.likes=newLikes;
    await data.save();
    res.redirect("/listing");
};
module.exports.comment=async(req,res)=>{
    const{id}=req.params;
    res.render(`/listing/${id}`);
};