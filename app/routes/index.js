var express = require('express');
var router = express.Router();
var HomeController = require('../controller/home_controller');
var UsuariosController = require('../controller/usuarios_controller');

/* GET home page. */
router.get('/', HomeController.index);
router.get('/usuario', HomeController.usuario);
router.get('/usuarios.json', UsuariosController.todos);
router.post('/usuarios.json', UsuariosController.criar);
router.put('/usuarios.json', UsuariosController.atualizar);
router.get('/usuarios/:id.json', UsuariosController.porId);
router.patch('/usuarios/:id.json', UsuariosController.atualizarPorPatch);
router.delete('/usuarios/:id.json', UsuariosController.excluirUsuario);

module.exports = router;
