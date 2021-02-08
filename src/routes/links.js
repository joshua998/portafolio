const { request } = require('express');
const express = require('express');
const { query } = require('../database');
const router = express.Router();
const pool = require('../database')
const { isLoggedIn, role } = require('../lib/auth')
const {isNotloggedin} = require('../lib/auth')


router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {


    const { rut_usuario, nombre_usuario, contrasena_usuario, nombre_trabajador_usuario, estado, id_tipo } = req.body;
    console.log(rut_usuario, nombre_usuario, contrasena_usuario, nombre_trabajador_usuario, estado, id_tipo)

    switch (id_tipo) {
        case 1:
            id_tipo = 1
            break;
        case 2:
            id_tipo = 2
            break;
        case 3:
            id_tipo = 3
            break;
    }
    const newlink = {
        rut_usuario,
        nombre_usuario,
        contrasena_usuario,
        nombre_trabajador_usuario,
        estado,
        id_tipo
    };
    await pool.query('INSERT INTO USUARIO SET ?', [newlink])
    req.flash('success', 'Usuario registrado con exito');
    console.log(newlink);
    res.redirect('/links');

});

router.get('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM USUARIO where estado_usuario = 1');
    console.log(links);
    res.render('links/list', { links })
});

router.get('/delete/:rut_usuario', async (req, res) => {
    const { rut_usuario } = req.params;
    await pool.query('update usuario set estado = 0 where rut_usuario = ? ', [rut_usuario]);
    res.redirect('/links')
})

router.get('/edit/:rut_usuario', async (req, res) => {
    const { rut_usuario } = req.params;
    const link = await pool.query('SELECT * FROM usuario WHERE rut_usuario = ? ', [rut_usuario]);// el await es por que es una consulta asincrona
    // console.log(link[0]);
    res.render('links/edit', { link: link[0] });
});

router.post('/edit/:rut_usuario', async (req, res) => {
    const { rut_usuario } = req.params;
    const { nombre_usuario, contrasena_usuario, nombre_trabajador_usuario } = req.body;
    const newLink = {
        nombre_usuario,
        contrasena_usuario,
        nombre_trabajador_usuario
    };
    await pool.query('UPDATE USUARIO SET ? WHERE RUT_USUARIO =?', [newLink, rut_usuario]);
    res.redirect('/links');
});




router.get('/login',isNotloggedin ,async (req, res) => {

    res.render('links/login')
});


router.post('/auth', function (request, response) {
    var nombre_usuario = request.body.username;
    var contrasena_usuario = request.body.password;

    if (nombre_usuario && contrasena_usuario) {
        pool.query('SELECT * FROM usuario WHERE nombre_usuario = ? AND contrasena_usuario = ?', [nombre_usuario, contrasena_usuario], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.nombre_usuario = nombre_usuario;
                response.redirect('/');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Por Favor Ingrese Usuario y Contraseña');
        response.end();
    }
});


router.get('/', function (request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.nombre_usuario + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});




/////////////////////  crud producto ///////////////////////////////


///// get agregar Producto
router.get('/add_prod', async (req, res) => {
    const provlist = await pool.query('SELECT * FROM CATEGORIA');
    const proveedor = await pool.query('SELECT * FROM PROVEEDOR');
    res.render('links/add_prod', { provlist, proveedor });
});




///// post agregar Producto
router.post('/add_prod', async (req, res) => {


    const { nombre_prod, detalle_prod, cantidad_prod, valor_prod, rut_empresa, id_categoria } = req.body;
    console.log(nombre_prod, detalle_prod, cantidad_prod, valor_prod, rut_empresa, id_categoria)


    const newlink = {

        nombre_prod,
        detalle_prod,
        cantidad_prod,
        valor_prod,
        rut_empresa,
        id_categoria
    };
    await pool.query('INSERT INTO producto SET ?', [newlink])
    req.flash('success', 'Producto registrado con exito');
    console.log(newlink);
    res.redirect('/principal_prod');

});




///revisar
///get listar  Producto
router.get('/principal_prod', async (req, res) => {
    const links = await pool.query('SELECT * FROM producto;');
    console.log(links);
    res.render('links/list_prod', { links })
});

///revisar
/// get Eliminar Producto
router.get('/delete/:id_prod', async (req, res) => {
    const { id_prod } = req.params;
    await pool.query('delete from producto  where id_prod = ? ', [id_prod]);
    res.redirect('/principal_prod')
})



/// get Editar Producto
router.get('/edit_prod/:id_prod', async (req, res) => {
    const { id_prod } = req.params;
    const link = await pool.query('SELECT * FROM producto WHERE id_prod = ? ', [id_prod]);// el await es por que es una consulta asincrona
    // console.log(link[0]);
    res.render('/links/edit_prod', { link: link[0] });
});
//// post Editar Producto

router.post('/edit_prod/:id_prod', async (req, res) => {
    const { id_prod } = req.params;
    const { nombre_prod, detalle_prod, cantidad_prod, valor_prod, rut_empresa, id_categoria } = req.body;
    const newLink = {
        nombre_prod,
        detalle_prod,
        cantidad_prod,
        valor_prod,
        rut_empresa,
        id_categoria
    };
    await pool.query('UPDATE producto SET ? WHERE id_prod =?;', [newLink, id_prod]);
    res.redirect('/links/principal_prod');
});


////////////// CRUD  Proveedor  //////////////////////////////



///// get agregar Proveedor
router.get('/add_prov', (req, res) => {
    res.render('links/add_prov');
});




///// post agregar Proveedor
router.post('/add_prov', async (req, res) => {


    const { rut_empresa, nombre_empresa, direccion_empresa, telefono_empresa } = req.body;
    console.log(rut_empresa, nombre_empresa, direccion_empresa, telefono_empresa)


    const newlink = {
        rut_empresa,
        nombre_empresa,
        direccion_empresa,
        telefono_empresa
    };
    await pool.query('INSERT INTO proveedor SET ?', [newlink])
    req.flash('success', 'Proveedor registrado con exito');
    console.log(newlink);
    res.redirect('/principal_prov');

});

///revisar
///get listar  Proveedor
router.get('/principal_prov', async (req, res) => {
    const links = await pool.query('SELECT * FROM proveedor;');
    console.log(links);
    res.render('links/list_prov', { links })
});

///revisar
/// get Eliminar Proveedor
router.get('/delete_prov/:rut_empresa', async (req, res) => {
    const { rut_empresa } = req.params;
    await pool.query('delete from proveedor  where rut_empresa = ? ', [rut_empresa]);
    res.redirect('/links/principal_prov')
})




/// get Editar Proveedor
router.get('/edit_prov/:rut_empresa', async (req, res) => {
    const { rut_empresa } = req.params;
    const link = await pool.query('SELECT * FROM proveedor WHERE rut_empresa = ? ', [rut_empresa]);// el await es por que es una consulta asincrona
    // console.log(link[0]);
    res.render('links/edit_prov', { link: link[0] });
});
//// post Editar Proveedor

router.post('/edit_prov/:rut_empresa', async (req, res) => {
    const { rut_empresa } = req.params;
    const { nombre_empresa, direccion_empresa, telefono_empresa } = req.body;
    const newLink = {
        nombre_empresa,
        direccion_empresa,
        telefono_empresa
    };
    await pool.query('UPDATE proveedor SET ? WHERE rut_empresa =?;', [newLink, rut_empresa]);
    res.redirect('/links/principal_prov');
});
//// 

//////////////////// Representante Proveedor //////////////

///// get agregar  Representante Proveedor
router.get('/add_rep_prov', async (req, res) => {
    const proveedor = await pool.query('SELECT * FROM PROVEEDOR');
    res.render('links/add_rep_prov', { proveedor });
});




///// post agregar Representante_proveedor
router.post('/add_rep_prov', isLoggedIn, async (req, res) => {


    const { rut_repre, nombre_repre, direccion_repre, telefono_repre, rut_empresa } = req.body;
    console.log(rut_repre, nombre_repre, direccion_repre, telefono_repre, rut_empresa)


    const newlink = {
        rut_repre,
        nombre_repre,
        direccion_repre,
        telefono_repre,
        rut_empresa
    };
    await pool.query('INSERT INTO representante_proveedor SET ?', [newlink])
    req.flash('success', 'Representante Proveedor registrado con exito');
    console.log(newlink);
    res.redirect('/principal_rep_prov');

});



///revisar
///get listar  Representante Proveedor
router.get('/principal_rep_prov', async (req, res) => {
    const links = await pool.query('SELECT * FROM representante_proveedor;');
    console.log(links);
    res.render('links/list_rep_prov', { links })
});

///revisar
/// get Eliminar Representante proveedor
router.get('/delete_rep_prov/:rut_repre', async (req, res) => {
    const { rut_repre } = req.params;
    await pool.query('delete from representante_proveedor where rut_repre = ? ;', [rut_repre]);
    res.redirect('/links/principal_rep_prov')
})


/// get Editar Representante proveedor
router.get('/edit_rep_prov/:rut_repre', async (req, res) => {
    const { rut_repre } = req.params;
    const link = await pool.query('SELECT * FROM representante_proveedor WHERE rut_repre = ? ', [rut_repre]);// el await es por que es una consulta asincrona
    // console.log(link[0]);
    res.render('links/edit_rep_prov', { link: link[0] });
});
//// post Editar Representante Proveedor

router.post('/edit_rep_prov/:rut_repre', async (req, res) => {
    const { rut_repre } = req.params;
    const { nombre_repre, direccion_repre, telefono_repre, rut_empresa } = req.body;
    const newLink = {
        nombre_repre,
        direccion_repre,
        telefono_repre,
        rut_empresa
    };
    await pool.query('UPDATE representante_proveedor SET ? WHERE rut_repre =?;', [newLink, rut_repre]);
    res.redirect('/links/principal_rep_prov');
});




///// CRUD Tipo De Pago /////

router.get('/add_tipo_pago', (req, res) => {
    res.render('links/add_tipo_pago');
});




///// post agregar Tipo Pago
router.post('/add_tipo_pago', async (req, res) => {


    const { nombre_tipo } = req.body;
    console.log(nombre_tipo)


    const newlink = {
        nombre_tipo
    };
    await pool.query('INSERT INTO tipo_pago SET ?', [newlink])
    req.flash('success', 'Tipo De PAgo Con Exito');
    console.log(newlink);
    res.redirect('/links/principal_tipo_pago');

});


///get listar Tipo De Pago
router.get('/principal_tipo_pago', async (req, res) => {
    const links = await pool.query('SELECT * FROM tipo_pago;');
    console.log(links);
    res.render('links/list_tipo_pago', { links })
});



/// get Editar Tipo Pago
router.get('/edit_tipo_pago/:id_tipo', async (req, res) => {
    const { id_tipo } = req.params;
    const link = await pool.query('SELECT * FROM tipo_pago WHERE id_tipo = ? ;', [id_tipo]);// el await es por que es una consulta asincrona
    // console.log(link[0]);
    res.render('links/edit_tipo_pago', { link: link[0] });
});
//// post Editar Proveedor

router.post('/edit_tipo_pago/:id_tipo', async (req, res) => {
    const { id_tipo } = req.params;
    const { nombre_tipo } = req.body;
    const newLink = {
        id_tipo,
        nombre_tipo
    };
    await pool.query('UPDATE tipo_pago SET ? WHERE id_tipo =?;', [newLink, id_tipo]);
    res.redirect('/links/principal_tipo_pago');
});


/////////////////////////// CRUD tipo_ Usuario ///////////////




////get agregar tipo usuario
router.get('/add_tipo_usu',isLoggedIn, (req, res) => {
    res.render('links/add_tipo_usu');
});




///// post agregar tipo usuario
router.post('/add_tipo_usu', isLoggedIn, async (req, res) => {


    const { nombre_tipo } = req.body;
    console.log(nombre_tipo)


    const newlink = {

        nombre_tipo
    };
    await pool.query('INSERT INTO tipo_usuario SET ?', [newlink])
    req.flash('success', 'Tipo De Usuario registrado con exito');
    console.log(newlink);
    res.redirect('/links/principal_tipo_usu');

});


///get listar Tipo De usuario
router.get('/principal_tipo_usu',adminController, async (req, res) => {
    const links = await pool.query('SELECT * FROM tipo_usuario;');
    console.log(links);
    res.render('links/list_tipo_usu', { links })
});



/// get Editar Tipo usuario
router.get('/edit_tipo_usu/:id_tipo', async (req, res) => {
    const { id_tipo } = req.params;
    const link = await pool.query('SELECT * FROM tipo_usuario WHERE id_tipo = ? ;', [id_tipo]);// el await es por que es una consulta asincrona
    // console.log(link[0]);
    res.render('links/edit_tipo_usu', { link: link[0] });
});
//// post Editar Usuario

router.post('/edit_tipo_usu/:id_tipo', async (req, res) => {
    const { id_tipo } = req.params;
    const { nombre_tipo } = req.body;
    const newLink = {
        id_tipo,
        nombre_tipo
    };
    await pool.query('UPDATE tipo_usuario SET ? WHERE id_tipo =?;', [newLink, id_tipo]);
    res.redirect('/links/principal_tipo_usu');
});









//////////// CRUD  Categoria /////////////


////get agregar tipo usuario
router.get('/add_categoria', (req, res) => {
    res.render('links/add_categoria');
});




///// post agregar tipo usuario
router.post('/add_categoria', isLoggedIn, async (req, res) => {


    const { nombre_categoria } = req.body;
    console.log(nombre_categoria)


    const newlink = {

        nombre_categoria
    };
    await pool.query('INSERT INTO categoria SET ?', [newlink])
    req.flash('success', 'Categoria registrada con exito');
    console.log(newlink);
    res.redirect('/links/principal_categoria');

});


///get listar Tipo De usuario
router.get('/principal_categoria', async (req, res) => {
    const links = await pool.query('SELECT * FROM categoria;');
    console.log(links);
    res.render('links/list_categoria', { links })
});



/// get Editar Tipo usuario
router.get('/edit_categoria/:id_categoria', async (req, res) => {
    const { id_categoria } = req.params;
    const link = await pool.query('SELECT * FROM tipo_usuario WHERE id_tipo = ? ;', [id_categoria]);// el await es por que es una consulta asincrona
    // console.log(link[0]);
    res.render('links/edit_categoria', { link: link[0] });
});
//// post Editar Usuario

router.post('/edit_categoria/:id_categoria', async (req, res) => {
    const { id_categoria } = req.params;
    const { nombre_categoria } = req.body;
    const newLink = {
        id_categoria,
        nombre_categoria
    };
    await pool.query('UPDATE categoria SET ? WHERE id_categoria =?;', [newLink, id_categoria]);
    res.redirect('/links/principal_categoria');
});





module.exports = router;

