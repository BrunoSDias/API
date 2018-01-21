var db = require('../../config/db');

var Usuario = function(){
	this.id = 0;
	this.nome = '';
	this.login = '';
	this.senha = '';
	this.email = '';

	this.salvar = function(){
		if (this.id == 0 || this.id == '' || this.id == undefined){
			
			if(this.nome == ''){
				console.log('[Modelo:Usuario] Nome de usuario obrigatório');
				return;
			}
			if(this.login == ''){
				console.log('[Modelo:Usuario] Nome de login obrigatório');
				return;
			}
			if(this.senha == ''){
				console.log('[Modelo:Usuario] Nome de senha obrigatório');
				return;
			}			

			var query = "INSERT INTO `cms`.`usuarios` (`nome`, `login`, `senha`, `email`) VALUES " +
			" ('"+this.nome+"', '"+this.login+"', '"+this.senha+"', '"+this.email+"')";

			db.cnn.exec(query, function(rows, err){
				if (err != undefined){
					console.log('Erro ao incluir dados de Usuario');
				}
				else
				{
					console.log('Usuário incluido com sucesso');
				}
			});
		}
		else
			//atualizar na base de dados
		{

		}
	};
};

module.exports = Usuario;