const listings = require("./models/listing");
const reviews= require("./models/comment");
module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        //to save last access route so that after login we can redirect user but it will get reset once logged in 
        req.flash("error","Please Login in first");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let{id}=req.params;
    let listing= await listings.findById({_id:id});
    if(!listing.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","Permission denied");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isReviewOwner = async (req, res, next) => {
    const { id, commentId } = req.params;

    try {
        const review = await reviews.findById(commentId); 
        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listing/${id}`);
        }

        if (!review.author._id.equals(res.locals.curruser._id)) {
            req.flash("error", "Permission denied");
            return res.redirect(`/listing/${id}`);
        }

        next();
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong");
        res.redirect(`/listing/${id}`);
    }
};