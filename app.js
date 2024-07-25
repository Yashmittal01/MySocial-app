require('dotenv').config();
const express= require ("express");
const app = express();
const mongoose = require("mongoose");
const path= require("path");
const methodOverride = require ("method-override"); // cannot use put patch, delete request directly soo it is used 
const ejsmate = require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const listings= require("./route/listing.js");
const comments= require("./route/comment.js");
const userRoute= require("./route/user.js");
const user= require("./models/user.js");
const likeRoute=require("./route/likeComment.js");
const MongoStore = require('connect-mongo');
const session= require("express-session");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const flash= require("connect-flash");
const store= MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto:{
        secret: "mysecretCode"
    },
    touchAfter: 24 * 3600
});
const sessionOption= {
    store: store, 
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true //
    },
};
const PORT= process.env.PORT;
app.listen(PORT ,()=>{
    console.log("listening on port 8080");
});
async function main(){
    await mongoose.connect(process.env.MONGO_URL); //database connection
}main().then(()=>{
    console.log("connected db");
}).catch((err)=>{
    console.log(err);
});

app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.curruser= req.user;
    next();
});
app.get("/",(req,res)=>{
    res.redirect("/listing");
});
app.use(express.static(path.join(__dirname,"/public")));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);

app.use("/listing", listings);
app.use("/listing/:id/comment", comments);
app.use("/",userRoute);
app.use("/",likeRoute);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"))
});
app.use((err,req,res,next)=>{
    let {statuscode=500, message="something went wrong!"}=err;
    res.status(statuscode).render("error.ejs", {message});
    //res.status(statuscode).send(message);
});