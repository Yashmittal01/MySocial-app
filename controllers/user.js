const user= require("../models/user");
const nodemailer= require('nodemailer');
const randomString= require('randomstring');

module.exports.signupForm=(req,res)=>{
    res.render("signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
     let {username, email,password}=req.body;
     const newuser= new user({
         email,
         username
     })
     const registedUser = await user.register(newuser,password);
     req.login(registedUser, (err)=>{
         if(err){
             return next(err);
         }
         req.flash("success","Registered Successfully!");
     res.redirect("/listing");
     })
    }catch(e){
     req.flash("error",e.message);
     res.redirect("/signup");
    }
};
module.exports.loginForm=(req,res)=>{
    res.render("login.ejs");
};
module.exports.login=(req, res) => {
    req.flash('success', 'Welcome back!');
    let redirectUrl= res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl); // Redirect to a route that exists
};
module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you're logged out");
        res.redirect("/listing");
    });
};

const sendmail = async(name, email, token)=>{
    try{
        const transporter=nodemailer.createTransport({
            service: "gmail",
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user: process.env.USER,
                pass: process.env.PASS
            }
        });
        const mailOptions= {
            from: process.env.USER,
            to: email,
            subject: "reset password",
            html: 'Hii you can reset your password <a href="https://mysocial-app.onrender.com/reset-password?token='+token+'"> click here </a>'
        }
        transporter.sendMail(mailOptions,function(err,info){
            if(err){
                res.status(200).json({ message: 'something went wrong' });
            }
            else{
                console.log("send",info.response);
            }
        });
    }
    catch(err){
        res.status(400).json({ message: 'something went wrong' });
    }
}

module.exports.email= async(re,res)=>{
    res.render("email.ejs");
};

module.exports.forget= async(req,res)=>{
    console.log("req recived");
    const {email}= req.body;
    try{
        const oldUser = await user.findOne({email});
        console.log(oldUser);
        if(!oldUser){
            req.flash("error","User doesn't exist");
        }
        else{
            const gstring= randomString.generate();
            await user.updateOne({email:email},{$set:{token:gstring}});
            sendmail(oldUser.name, oldUser.email, gstring);
            req.flash("success","Mail sent");
            res.redirect("/login");
        }
    }
    catch(err){

    }
}

module.exports.reset= async(req,res)=>{
    try{
        const token= req.query.token;
        const tokendata = await user.findOne({token: token});
        if(tokendata){
            const token = req.query.token;
            res.render("reset.ejs",{token});
        }
        else{
            req.flash("error","Link expired");
        }
    }catch(err){
        res.send("Not Valid");
    }
}

module.exports.postreset= async(req,res)=>{
    try {
        const token = req.body.token;
        const newpassword = req.body.password;
        const tokendata = await user.findOne({token: token});
        const suc = await user.findByIdAndUpdate({_id:tokendata._id},{$set:{password:newpassword, token:''}});
        console.log(suc);
        req.flash("success","Password reset successfully")
        res.redirect("/login");
    }catch(err){
        req.flash("error","Something went wrong");        
    }
}
