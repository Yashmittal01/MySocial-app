const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const { isloggedin, isReviewOwner } = require("../middleware.js");
const reviewController= require("../controllers/comment.js");

//review(post route)
router.post("/",isloggedin,wrapAsync(reviewController.createReview));

//delete review
router.delete("/:commentId", isloggedin,isReviewOwner, reviewController.deleteReview);

module.exports=router;