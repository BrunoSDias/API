var request = require('request');

describe('o controller de usuário', function(){
	describe('GET/ usuarios.json - deve retornar no serviço todos os usuários cadastrados', function(){
		it('deve retornar o status code de 200', function(done){
			request.get('http://localhost:3000/usuarios.json', function(error, res, body){
				if (res === undefined){
					console.log('Não conseguiu localizar o servidor');
					expect(503).toBe(200);
				}
				else
				{
					expect(res.statusCode).toBe(200);
					console.log('Dados da rota usuarios.json\n')
					console.log(body);
				}
				done();
			});
		});
	});
});