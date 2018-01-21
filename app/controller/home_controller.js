var Usuario = require('../models/usuario');

var HomeController = {
	index: function(req, res, next){
  		res.render('index', { title: 'Express' });
	},
	usuario: function(req, res, next){
		var usuario = new Usuario();

		usuario.nome = "Fernando";
		usuario.login = "fernando";
		usuario.senha = "fernando";
		usuario.email = "fernando@email.com";

		console.log(usuario);
		usuario.salvar(); 

		res.send('ola usuario');
	}	
}

module.exports = HomeController;