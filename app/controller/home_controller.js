var Usuario = require('../models/usuario');

var HomeController = {
	index: function(req, res, next){
  		res.render('index', { title: 'Express' });
	},
	usuario: function(req, res, next){
		var usuario = new Usuario();

		usuario.id = "3";
		usuario.nome = "Fernando2";
		usuario.login = "fernando2";
		usuario.senha = "fernando2";
		usuario.email = "fernando@email.com2";

		console.log(usuario);
		usuario.salvar(); 

		res.send('ola usuario');
	}	
};

module.exports = HomeController;