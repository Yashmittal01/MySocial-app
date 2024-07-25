const listing = require("../models/listing.js"); //require listing schema which is set in models
const comment = require("../models/comment.js");

module.exports.createReview=async(req, res)=>{
    let listings = await listing.findById(req.params.id);
    let newReview = new comment(req.body.comment);
    newReview.author= req.user._id;
    listings.comment.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash("success", "New Review added");
    res.redirect(`/listing/${listings._id}`);
};
module.exports.deleteReview=async(req,res)=>{
    try{
        let {id, commentId}=req.params;
    await comment.findByIdAndDelete(commentId);
    req.flash("success", "Review deleted");
    res.redirect(`/listing/${id}`);
    }
    catch(err){
        req.flash("error","Something went wrong")
        res.redirect(`/listing/${id}`);
    }
};