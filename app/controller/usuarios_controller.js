var Usuario = require('../models/usuario');

var UsuariosController = {
	todos: function(req, res, next){
		Usuario.todos(function(retorno){
        	if(retorno.erro){
        		res.status(500).send({erro: 'erro ao buscar usuarios ('+retorno.mensagem+'}'});
        	}
        	else
        	{
        		res.status(200).send(retorno.usuarios);
        	}
      	});
	}
};

module.exports = UsuariosController;