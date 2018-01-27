var db = require('../../config/db');

var Pagina = function(pagina){
	if (pagina != undefined){
		this.id = pagina.id;
		this.nome = pagina.nome;
		this.conteudo = pagina.conteudo;
	}
	else
	{
		this.id = 0;
		this.nome = '';
		this.conteudo = '';
	}
	

	this.salvar = function(callback){
		if(this.nome == ''){
				console.log('[Modelo:Pagina] Nome da pagina obrigatório');
				return;
			}
			if(this.conteudo == ''){
				console.log('[Modelo:Pagina] Conteudo da página obrigatório');
				return;
			}
			var query = '';
		if (this.id == 0 || this.id == '' || this.id == undefined){
			query = "INSERT INTO paginas (nome, conteudo) VALUES " +
			" ('"+this.nome+"', '"+this.conteudo+"')";

			db.cnn.exec(query, function(rows, err){
				if (err != undefined || err != null){
					callback({erro:true, mensagem: err});
				}
				else
				{
					callback({erro:false});
				}
			});
		}
		else{
			query = "UPDATE paginas SET nome='"+this.nome+"', conteudo='"+this.conteudo+"' WHERE id='"+this.id+"';";

			db.cnn.exec(query, function(rows, err){
				if (err != undefined || err != null){
					callback({erro:true, mensagem: err});
				}
				else
				{
					callback({erro:false});
				}
			});		
		}
	};
};

Pagina.excluirTodos = function(callback){
	query = "Delete from paginas";

	db.cnn.exec(query, function(rows, err){
		if (err != undefined || err != null){
			callback({erro:true, mensagem: err});
		}
		else
		{
			callback({erro:false});
		}
	});	
};

Pagina.truncateTable = function(callback){
	query = "TRUNCATE paginas;";

	db.cnn.exec(query, function(rows, err){
		if (err != undefined || err != null){
			callback({erro:true, mensagem: err});
		}
		else
		{
			callback({erro:false});
		}
	});	
};

Pagina.todos = function(callback){
	query = "select * from paginas";

	db.cnn.exec(query, function(rows, err){
		if (err != undefined || err != null){
			callback({
				erro:true, 
				mensagem: err, 
				paginas: []
			});
		}
		else
		{
			callback({
				erro:false, 
				paginas: rows
			});
		}
	});	
};

Pagina.buscarPorId  = function(id, callback){
	query = "select * from paginas where id='"+ id +"'";

	db.cnn.exec(query, function(rows, err){
		if (err != undefined || err != null){
			callback({
				erro:true, 
				mensagem: err, 
				pagina: {}
			});
		}
		else
		{
			if (rows.length > 0){
				callback({
					erro:false, 
					pagina: rows[0]
				});		
			}
			else
			{
				callback({
					erro:false, 
					pagina: {} 
				});		
			}
			
		}
	});	
};

Pagina.excluirPorId  = function(id, callback){
	query = "delete from paginas where id='"+ id +"'";

	db.cnn.exec(query, function(rows, err){
		if (err != undefined && err != null){
			callback({
				erro:true, 
				mensagem: err, 
			});
		}
		else
		{
			callback({
				erro:false 
			});		
			
			
		}
	});	
};

Pagina.buscarPorNome = function(nome, callback){
	query = "select * from paginas where nome like'%"+ nome +"%'";

	db.cnn.exec(query, function(rows, err){
		if (err != undefined || err != null){
			callback({
				erro:true, 
				mensagem: err, 
				paginas: []
			});
		}
		else
		{
			if (rows.length > 0){
				callback({
					erro:false, 
					paginas: rows
				});		
			}
			else
			{
				callback({
					erro:false, 
					paginas: [] 
				});		
			}			
		}
	});	
};

module.exports = Pagina;