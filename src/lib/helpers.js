const bcrypt = require ('bcryptjs');
const passport = require('passport');
const Handlebars = require("handlebars");
const { serializeUser } = require('passport');

const  helpers = {};

helpers.encryptPassword = async (contrasena_usuario)  =>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena_usuario,salt);
    return hash;
};

helpers.matchPassword = async (contrasena_usuario,savedContrasena_usuario) =>{
    try{
    return await bcrypt.compare(contrasena_usuario,savedContrasena_usuario);
    }catch(e){
        console.log(e)
    }
};

/*Handlebars.registerHelper("if",function(num1,op1,num2){
    if(arguments.length<3)
        throw new error ("solo 2 parametros");
    var operator = Option.hash.operator || "==";

    var operator ={
        '==': function(num1,num2){return num1 == num2;}
    }
    if (!operators[operator])
        throw new error ("no funciona el helper"+operator);
    var result = operators[operator](num1,num2);
    if(result){
        return Option.fn(this);
    }else{return options.inverse(this)}
});*/
/*Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});*/



module.exports = helpers;
