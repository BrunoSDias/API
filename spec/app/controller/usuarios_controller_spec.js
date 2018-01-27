var request = require('request');
var Usuario = require('../../../app/models/usuario');
var host = 'http://localhost:3000';

describe('o controller de usuário', function(){

//--Teste: GET/ usuarios.json - serviço todos - usuarios_controller
	describe('GET/ usuarios.json - deve retornar no serviço todos os usuários cadastrados', function(){
		it('deve retornar o status code de 200', function(done){
			request.get( host + '/usuarios.json', function(error, res, body){
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

//--Teste: GET/ usuarios.json?nome=x - serviço buscarPorNome - usuarios_controller
	describe('GET/ usuarios.json?nome=bruno - deve retornar no serviço os usuários que tenham o nome de bruno', function(){
		it('deve retornar o status code de 200 e retornar os dados de bruno no serviço', function(done){
			request.get( host + '/usuarios.json?nome=bruno', function(error, res, body){
				if (res === undefined || res == null){
					console.log('Não conseguiu localizar o servidor');
					expect(503).toBe(200);
				}
				else
				{
					expect(res.statusCode).toBe(200);
					var json = JSON.parse(res.body);
					expect(json.length).toBe(1);
					expect(json[0].nome).toBe('BrunoTest');
				}
				done();
			});
		});
	});

//--Teste: GET/ usuarios/:id.json - serviço buscaPorId - usuarios_controller
	describe('GET/ usuarios/1.json - deve retornar no serviço somente 1 usuário', function(){
		it('deve retornar o status code de 200 e retornar somente 1 usuário', function(done){
			Usuario.truncateTable(function(retorno1){
		        var usuario = new Usuario();

		        usuario.nome = 'BrunoTest';
		        usuario.login =  'BrunoLogin';
		        usuario.senha = 'BrunoSenha';
		        usuario.email = 'BrunoEmail@email.com';

		        usuario.salvar(function(retorno2){
		          	request.get( host + '/usuarios/1.json', function(error, res, body){
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
		it('deve retornar o status code de 404 para usuario nao cadastrado', function(done){
			Usuario.truncateTable(function(retorno1){
		          	request.get( host + '/usuarios/9999.json', function(error, res, body){
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

//--Teste: POST/ usuarios.json - serviço salvar - usuarios_controller
	describe('POST/ usuarios.json - deve criar um usuario', function(){
		var token;

		beforeEach(function(done){

			request.head(host + '/usuarios.json', function(){
				token = this.response.headers.auth_token;
				done();
			});			
		});

		it('deve retornar o status code de 201 e retornar a mensagem de usuario criado com sucesso', function(done){
			request.post(
			{
				url: host + '/usuarios.json',
			 	headers: {'auth_token': token},
			 	form: {nome:'Joao', login:'joao', senha:'123', email:'joao@email.com'}
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
					expect(json.mensagem).toBe('Usuário criado com sucesso');
				}
				done();
			});
		});
	});

//--Teste: PUT/ usuarios.json - serviço salvar com o objetivo de atualizar usuário - usuarios_controller
	describe('PUT/ usuarios.json - deve atualizar um usuario', function(){
		var usuarioCadastrado;
		var token;

		beforeEach(function(done){
			Usuario.excluirTodos(function(retorno1){
				var usuario = new Usuario();
				usuario.nome= 'nome para ser atualizado';
				usuario.login = 'bdsdias';
				usuario.senha = '123';
				usuario.email = 'BDSdias@email.com';

				usuario.salvar(function(retorno2){
					Usuario.todos(function(retorno3){
						if(!retorno3.erro){
							usuarioCadastrado = retorno3.usuarios[0];
						}
						request.head(host + '/usuarios.json', function(){
							token = this.response.headers.auth_token;
							done();
						});						
					});
				});				
			});			
		});

		it('deve retornar o status code de 200 e retornar a mensagem de usuario atualizado com sucesso', function(done){
			usuarioCadastrado.nome = 'nome de usuario ja atualizado';

			request.put({url: host + '/usuarios.json', headers:{'auth_token': token}, form: usuarioCadastrado}, function(error, res, body){
				if (res === undefined || res == null){
					console.log('Não conseguiu localizar o servidor');
					expect(503).toBe(200);
				}
				else
				{					
					expect(res.statusCode).toBe(200);
					var json = JSON.parse(res.body);
					expect(json.mensagem).toBe('Usuário atualizado com sucesso');

				 	Usuario.buscarPorId(usuarioCadastrado.id, function(retorno){
			            expect(retorno.usuario.nome).toBe('nome de usuario ja atualizado');
		          	});
				}
				done();
			});
		});

		it('deve retornar o status code de 200 e retornar a mensagem de usuario atualizado com sucesso', function(done){
			request.put({url: host + '/usuarios.json', headers:{'auth_token': token}, form: {}}, function(error, res, body){
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

//--Teste: PATCH/ usuarios/:id.json - serviço salvar com o objetivo de atualizar usuário - usuarios_controller
	describe('PATCH/ usuarios/:id.json - deve atualizar um usuario', function(){
		var usuarioCadastrado;
		var token;

		beforeEach(function(done){
			Usuario.excluirTodos(function(retorno1){
				var usuario = new Usuario();
				usuario.nome= 'usuario novo';
				usuario.login = 'bdsdias';
				usuario.senha = '123';
				usuario.email = 'BDSdias@email.com';

				usuario.salvar(function(retorno2){
					Usuario.todos(function(retorno3){
						if(!retorno3.erro){
							usuarioCadastrado = retorno3.usuarios[0];
						}
						request.head(host + '/usuarios.json', function(){
							token = this.response.headers.auth_token;
							done();
						});								
					});
				});
			});
		});
		it('deve retornar o status code de 200 e retornar a mensagem de usuario atualizado com sucesso', function(done){
			request.patch({url: host + '/usuarios/' + usuarioCadastrado.id + '.json', headers:{'auth_token': token}, form: {nome: 'Nome atualizado por PATCH'}}, function(error, res, body){
				if (res === undefined || res == null){
					console.log('Não conseguiu localizar o servidor');
					expect(503).toBe(200);
				}
				else
				{					
					expect(res.statusCode).toBe(200);
					var json = JSON.parse(res.body);
					expect(json.mensagem).toBe('Usuário atualizado com sucesso');

				 	Usuario.buscarPorId(usuarioCadastrado.id, function(retorno){
			            expect(retorno.usuario.nome).toBe('Nome atualizado por PATCH');
		          	});
				}
				done();
			});
		});
	});

//--Teste: DELETE/ usuarios/:id.json - serviço deletar com o objetivo de excluir usuário - usuarios_controller
	describe('DELETE/ usuarios/:id.json - deve excluir um usuario', function(){
		var usuarioCadastrado;
		var token;

		beforeEach(function(done){
			Usuario.excluirTodos(function(retorno1){
				var usuario = new Usuario();
				usuario.nome= 'usuario para excluir';
				usuario.login = 'bdsdias';
				usuario.senha = '123';
				usuario.email = 'BDSdias@email.com';

				usuario.salvar(function(retorno2){
					Usuario.todos(function(retorno3){
						if(!retorno3.erro){
							usuarioCadastrado = retorno3.usuarios[0];
						}
						request.head(host + '/usuarios.json', function(){
							token = this.response.headers.auth_token;
							done();
						});							
					});
				});
			});
		});
		it('deve retornar o status code de 204', function(done){
			request.delete({url: host + '/usuarios/' + usuarioCadastrado.id + '.json', headers:{'auth_token': token}}, function(error, res, body){
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