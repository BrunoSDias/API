var Guid = require('guid');
var db = require('../../config/db');

var Token = function(token){
	if (token != undefined){
		this.id = token.id;
		this.token = token.token;
	}
	else
	{
		this.id = 0;
		this.token = '';
	}
	

	this.criar = function(callback){	
		var token = Guid.raw();			
		var query = "INSERT INTO token (token) VALUES " +
		" ('"+ token +"')";

		db.cnn.exec(query, function(rows, err){
			if (err != undefined || err != null){
				callback({erro:true, mensagem: err});
			}
			else
			{
				callback({erro:false, token: token});
			}
		});
	};
};

Token.verificaToken = function(token, callback){
	var query = "select * from token where token='"+ token +"'";

	db.cnn.exec(query, function(rows, err){
		if(err != undefined || err != null || rows.length <= 0){
			callback({tokenValidado: false});
		}
		else
		{
			callback({tokenValidado: true});
		}		
	});	
};

Token.apagarToken = function(token, callback){
	var query = "delete from token where token='"+ token +"'";

	db.cnn.exec(query, function(rows, err){
		if(err != undefined || err != null || rows.length <= 0){
			if(callback !== undefined){
				callback({erro:true, mensagem: err});
			}
		}
		else
		{
			if(callback !== undefined){
				callback({erro:false});				
			}
		}		
	});	
};

module.exports = Token;