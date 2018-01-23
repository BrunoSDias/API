var express = require('express');
var router = express.Router();
var HomeController = require('../controller/home_controller');
var UsuariosController = require('../controller/usuarios_controller');

/* GET home page. */
router.get('/', HomeController.index);
router.get('/usuario', HomeController.usuario);
router.get('/usuarios.json', UsuariosController.todos);

module.exports = router;
