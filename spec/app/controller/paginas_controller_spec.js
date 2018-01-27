var request = require('request');
var Pagina = require('../../../app/models/pagina');
var host = 'http://localhost:3000';

describe('o controller de página', function(){

//--Teste: GET/ paginas.json - serviço todos - paginas_controller
	describe('GET/ paginas.json - deve retornar no serviço todos os páginas cadastrados', function(){
		it('deve retornar o status code de 200', function(done){
			request.get( host + '/paginas.json', function(error, res, body){
				if (res === undefined){
					console.log('Não conseguiu localizar o servidor');
					expect(503).toBe(200);
				}
				else
				{
					expect(res.statusCode).toBe(200);
				}
				done();
			});
		});
	});

//--Teste: GET/ paginas.json?nome=x - serviço buscarPorNome - paginas_controller
	describe('GET/ paginas.json?nome=pagina - deve retornar no serviço os páginas que tenham o nome de bruno', function(){
		var paginaCadastrado;

		beforeEach(function(done){
			Pagina.excluirTodos(function(retorno1){
				var pagina = new Pagina();
				pagina.nome = 'pagina teste';
				pagina.conteudo = 'bla bla';
				pagina.salvar(function(retorno2){
					Pagina.todos(function(retorno3){
						if(!retorno3.erro){
							paginaCadastrado = retorno3.paginas[0];
						}
						done();
					});
				});
			});
		});

		it('deve retornar o status code de 200 e retornar os dados de bruno no serviço', function(done){
			request.get( host + '/paginas.json?nome=pagina', function(error, res, body){
				if (res === undefined || res == null){
					console.log('Não conseguiu localizar o servidor');
					expect(503).toBe(200);
				}
				else
				{
					expect(res.statusCode).toBe(200);
					var json = JSON.parse(res.body);
					expect(json.length).toBe(1);
					expect(json[0].nome).toBe('pagina teste');
				}
				done();
			});
		});
	});

//--Teste: GET/ paginas/:id.json - serviço buscaPorId - paginas_controller
	describe('GET/ paginas/1.json - deve retornar no serviço somente 1 página', function(){
		it('deve retornar o status code de 200 e retornar somente 1 página', function(done){
			Pagina.truncateTable(function(retorno1){
		        var pagina = new Pagina();

		        pagina.nome = 'pagina teste 2';
		        pagina.conteudo =  'bla bla';

		        pagina.salvar(function(retorno2){
		          	request.get( host + '/paginas/1.json', function(error, res, body){
						if (res === undefined || res == null){
							console.log('Não conseguiu localizar o servidor');
							expect(503).toBe(200);
						}
						else
						{
							expect(res.statusCode).toBe(200);
							var json = JSON.parse(res.body);
							expect(json.id).toBe(1);
							expect(json.nome).not.toBe(undefined);
						}
						done();
					});
		        });
	      	});  
			
		});
		it('deve retornar o status code de 404 para pagina nao cadastrado', function(done){
			Pagina.truncateTable(function(retorno1){
		          	request.get( host + '/paginas/9999.json', function(error, res, body){
						if (res === undefined || res == null){
							console.log('Não conseguiu localizar o servidor');
							expect(503).toBe(200);
						}
						else
						{
							expect(res.statusCode).toBe(404);
						}
						done();
					});
	      	});  
			
		});
	});

//--Teste: POST/ paginas.json - serviço salvar - paginas_controller
	describe('POST/ paginas.json - deve criar um pagina', function(){
		var token;

		beforeEach(function(done){

			request.head(host + '/paginas.json', function(){
				token = this.response.headers.auth_token;
				done();
			});			
		});

		it('deve retornar o status code de 201 e retornar a mensagem de pagina criado com sucesso', function(done){
			request.post(
			{
				url: host + '/paginas.json',
			 	headers: {'auth_token': token},
			 	form: {nome:'Nova pagina', conteudo:'bla bla'}
		 	},
		 	function(error, res, body){
				if (res === undefined || res == null){
					console.log('Não conseguiu localizar o servidor');
					expect(503).toBe(200);
				}
				else
				{					
					expect(res.statusCode).toBe(201);
					var json = JSON.parse(res.body);
					expect(json.mensagem).toBe('Página criado com sucesso');
				}
				done();
			});
		});
	});

//--Teste: PUT/ paginas.json - serviço salvar com o objetivo de atualizar página - paginas_controller
	describe('PUT/ paginas.json - deve atualizar um pagina', function(){
		var paginaCadastrado;
		var token;

		beforeEach(function(done){
			Pagina.excluirTodos(function(retorno1){
				var pagina = new Pagina();
				pagina.nome= 'Pagina para atualizar';
				pagina.conteudo = 'bla conteudo';

				pagina.salvar(function(retorno2){
					Pagina.todos(function(retorno3){
						if(!retorno3.erro){
							paginaCadastrado = retorno3.paginas[0];
						}
						request.head(host + '/paginas.json', function(){
							token = this.response.headers.auth_token;
							done();
						});						
					});
				});				
			});			
		});

		it('deve retornar o status code de 200 e retornar a mensagem de pagina atualizado com sucesso', function(done){
			paginaCadastrado.nome = 'nome de pagina ja atualizado';

			request.put({url: host + '/paginas.json', headers:{'auth_token': token}, form: paginaCadastrado}, function(error, res, body){
				if (res === undefined || res == null){
					console.log('Não conseguiu localizar o servidor');
					expect(503).toBe(200);
				}
				else
				{					
					expect(res.statusCode).toBe(200);
					var json = JSON.parse(res.body);
					expect(json.mensagem).toBe('Página atualizado com sucesso');

				 	Pagina.buscarPorId(paginaCadastrado.id, function(retorno){
			            expect(retorno.pagina.nome).toBe('nome de pagina ja atualizado');
		          	});
				}
				done();
			});
		});

		it('deve retornar o status code de 200 e retornar a mensagem de pagina atualizado com sucesso', function(done){
			request.put({url: host + '/paginas.json', headers:{'auth_token': token}, form: {}}, function(error, res, body){
				if (res == undefined){
					console.log('Não conseguiu localizar o servidor');
					expect(503).toBe(200);
				}
				else
				{					
					expect(res.statusCode).toBe(400);
				}
				done();
			});
		});
	});

//--Teste: PATCH/ paginas/:id.json - serviço salvar com o objetivo de atualizar página - paginas_controller
	describe('PATCH/ paginas/:id.json - deve atualizar um pagina', function(){
		var paginaCadastrado;
		var token;

		beforeEach(function(done){
			Pagina.excluirTodos(function(retorno1){
				var pagina = new Pagina();
				pagina.nome= 'pagina novo';
				pagina.conteudo = 'conteudo';

				pagina.salvar(function(retorno2){
					Pagina.todos(function(retorno3){
						if(!retorno3.erro){
							paginaCadastrado = retorno3.paginas[0];
						}
						request.head(host + '/paginas.json', function(){
							token = this.response.headers.auth_token;
							done();
						});								
					});
				});
			});
		});
		it('deve retornar o status code de 200 e retornar a mensagem de pagina atualizado com sucesso', function(done){
			request.patch({url: host + '/paginas/' + paginaCadastrado.id + '.json', headers:{'auth_token': token}, form: {nome: 'Nome atualizado por PATCH'}}, function(error, res, body){
				if (res === undefined || res == null){
					console.log('Não conseguiu localizar o servidor');
					expect(503).toBe(200);
				}
				else
				{					
					expect(res.statusCode).toBe(200);
					var json = JSON.parse(res.body);
					expect(json.mensagem).toBe('Página atualizado com sucesso');

				 	Pagina.buscarPorId(paginaCadastrado.id, function(retorno){
			            expect(retorno.pagina.nome).toBe('Nome atualizado por PATCH');
		          	});
				}
				done();
			});
		});
	});

//--Teste: DELETE/ paginas/:id.json - serviço deletar com o objetivo de excluir página - paginas_controller
	describe('DELETE/ paginas/:id.json - deve excluir um pagina', function(){
		var paginaCadastrado;
		var token;

		beforeEach(function(done){
			Pagina.excluirTodos(function(retorno1){
				var pagina = new Pagina();
				pagina.nome= 'pagina para excluir';
				pagina.conteudo = 'teste';

				pagina.salvar(function(retorno2){
					Pagina.todos(function(retorno3){
						if(!retorno3.erro){
							paginaCadastrado = retorno3.paginas[0];
						}
						request.head(host + '/paginas.json', function(){
							token = this.response.headers.auth_token;
							done();
						});							
					});
				});
			});
		});
		it('deve retornar o status code de 204', function(done){
			request.delete({url: host + '/paginas/' + paginaCadastrado.id + '.json', headers:{'auth_token': token}}, function(error, res, body){
				if (res === undefined){
					console.log('Não conseguiu localizar o servidor');
					expect(503).toBe(200);
				}
				else
				{					
					expect(res.statusCode).toBe(204);
				}
				done();
			});
		});
	});

});