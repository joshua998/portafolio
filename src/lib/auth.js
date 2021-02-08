const { body } = require("express-validator");
const { serializeUser, session } = require("passport");


module.exports={

    isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/login');
    },

    isNotloggedin(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/links')
    },

}

