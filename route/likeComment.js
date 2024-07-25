
const express = require("express");
const router = express.Router();
const { isloggedin } = require("../middleware");
const likeCommentController= require("../controllers/likeComment");

router.put("/listing/:id/like",isloggedin,likeCommentController.like);
router.get("/listing/:id/comment", isloggedin ,likeCommentController.comment);
module.exports= router;