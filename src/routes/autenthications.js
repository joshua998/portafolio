const express = require('express')
const router = express.Router();
const passport=require('passport');

router.get('/registro',(req,res)=>{
    res.render('auth/registro');
});
/*router.post('/registro',passport.authenticate('local.registro',{
        suceessRedirect: '/profile',
        failureRedirect: '/registro',
        failureflash: true
    }));
*/
    router.post('/registro',passport.authenticate('local.registro',{
        successRedirect: '/profile',
        failureRedirect: '/registro',
        failureflash: true
    }));
    
router.get('/profile',(req,res)=>{
   res.render('links/list')
})

router.get('/login',(req,res)=>{
    res.render('auth/login');
});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local.login',{
        successRedirect: '/links',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,)
})

router.get('/logout',(req,res)=>{
        req.logOut();
        res.redirect('/login');
});



module.exports = router;