const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const {isloggedin, isOwner}= require("../middleware.js");
const { index, newListing, saveNewListing, indivisualListing, editListing, saveEditListing, deleteListing } = require("../controllers/listing.js");
const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage })
//root route
router.get("/",  wrapAsync(index));

//route for new listing
router.get("/new", isloggedin, newListing);

//save data get from new route
router.post("/", isloggedin, upload.single("listing[image]") ,wrapAsync(saveNewListing));

//show route
router.get("/:id",isloggedin,wrapAsync(indivisualListing));

//edit route
router.get("/:id/edit", isloggedin,isOwner,wrapAsync(editListing));

//save edit data route
router.put("/:id", isloggedin,isOwner, upload.single("listing[image]") ,wrapAsync(saveEditListing));

//delete route
router.delete("/:id", isloggedin,isOwner,wrapAsync(deleteListing));


module.exports=router;