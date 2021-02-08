const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database')
const helpers = require('../lib/helpers');

passport.use('local.registro',new LocalStrategy({
    usernameField: 'nombre_usuario',
    passwordField: 'contrasena_usuario',
    passReqToCallback: true
}, async (req,username,password,done)=>{
    const usuario = req.body;
    estado=true;
    switch(usuario.id_tipo){
        case 1:
            usuario.id_tipo = 1
            break;
        case 2:
            usuario.id_tipo = 2
            break;
        case 3:
            usuario.id_tipo = 3
            break;
        }
   const newUser ={
       nombre_usuario: usuario.nombre_usuario,
       contrasena_usuario: usuario.contrasena_usuario,
       rut_usuario: usuario.rut_usuario,
       nombre_trabajador_usuario: usuario.nombre_trabajador_usuario,
       estado_usuario: usuario.estado,
    };
    newUser.contrasena_usuario= await helpers.encryptPassword(newUser.contrasena_usuario);
    const result = await pool.query('INSERT INTO USUARIO SET ?', [newUser]);
    return done(null,newUser);
}));
passport.serializeUser((user,done)=>{
    done(null,user.rut_usuario);
});
passport.deserializeUser(async(rut_usuario,done)=>{
    const rows =  await pool.query('select * from usuario where rut_usuario = ?',[rut_usuario]); 
    done(null,rows[0]);
});
passport.use('local.login',new LocalStrategy({
    usernameField:'nombre_usuario',
    passwordField:'contrasena_usuario',
    passReqToCallback: true
},async (req,username,password,done)=>{
    const usuarioL= req.body;
    const row = await pool.query('select * from usuario where nombre_usuario = ?',[usuarioL.nombre_usuario])
    console.log(row)
    if (row.length > 0){
        const usuario = row[0]
        console.log('paso')
        const validPassword = await helpers.matchPassword(usuarioL.contrasena_usuario, usuario.contrasena_usuario )
        console.log(validPassword)
        if (validPassword){
            done(null,usuario,req.flash('success','bienvenido ' + usuario.nombre_usuario));
        }else{
            return done(null,false,req.flash('message','contraseña invalida'));
        }
    }else{
        return done(null,false,req.flash('message','usuario no valido'))  
    }
}))



