var Usuario = require('../../../app/models/usuario');

describe("O modelo de usuário", function() {
	describe("com o atributo", function() {

//--Teste: verifica se atributo id é válido
    it("id precisa ser válido", function() {
    	var usuario = new Usuario();
      expect(usuario.id).toBe(0);
    });

//--Teste: verifica se atributo nome é válido
    it("nome precisa ser válido", function() {
    	var usuario = new Usuario();
      expect(usuario.nome).toBe('');
    });

//--Teste: verifica se atributo login é válido
    it("login precisa ser válido", function() {
    	var usuario = new Usuario();
      expect(usuario.login).toBe('');
    });

//--Teste: verifica se atributo senha é válido
    it("senha precisa ser válido", function() {
    	var usuario = new Usuario();
      expect(usuario.senha).toBe('');
    });

//--Teste: verifica se atributo email é válido
    it("email precisa ser válido", function() {
    	var usuario = new Usuario();
      expect(usuario.email).toBe('');
    });  
  });


  describe('com o método',function(){

//---Teste: salvar
    it('salvar precisa salvar o registro do usuário na base de dados',function(done){
      var usuario = new Usuario();

      usuario.nome = 'BrunoTest';
      usuario.login =  'BrunoLogin';
      usuario.senha = 'BrunoSenha';
      usuario.email = 'BrunoEmail@email.com';

      usuario.salvar(function(retorno){
        expect(retorno.erro).toBe(false);
        done();
      });      
    });

//---Teste: método excluirTodos
    it('excluirTodos precisa apagar todos os registros da tabela',function(done){
      Usuario.excluirTodos(function(retorno){
        expect(retorno.erro).toBe(false);
        done();
      });      
    });

//---Teste: método buscaPorId
    it('buscarPorId precisa retornar o registro da tabela usuarios pelo seu id',function(done){
       Usuario.truncateTable(function(retorno1){
        var usuario = new Usuario();

        usuario.nome = 'BrunoTest';
        usuario.login =  'BrunoLogin';
        usuario.senha = 'BrunoSenha';
        usuario.email = 'BrunoEmail@email.com';

        usuario.salvar(function(retorno2){
          Usuario.buscarPorId(1, function(retorno3){
            expect(retorno3.erro).toBe(false);            
            expect(retorno3.usuario.id).toBe(1);
            done();
          });
        });
      });      
    });

//---Teste: método todos
    it('todos precisa retornar todos os registros da tabela',function(done){
       Usuario.excluirTodos(function(retorno1){
        var usuario = new Usuario();

        usuario.nome = 'BrunoTest';
        usuario.login =  'BrunoLogin';
        usuario.senha = 'BrunoSenha';
        usuario.email = 'BrunoEmail@email.com';

        usuario.salvar(function(retorno2){
          Usuario.todos(function(retorno3){
            expect(retorno3.erro).toBe(false);
            expect(retorno3.usuarios.length).toBe(1);
            done();
          });
        });
      });      
    });

//---Teste: método salvar
    it('salvar precisa atualizar o respectivo usuário',function(done){
       Usuario.excluirTodos(function(retorno1){
        var usuario = new Usuario();

        usuario.nome = 'BrunoTest';
        usuario.login =  'BrunoLogin';
        usuario.senha = 'BrunoSenha';
        usuario.email = 'BrunoEmail@email.com';

        usuario.salvar(function(retorno2){
          Usuario.todos(function(retorno3){
            var user = retorno3.usuarios[0];
            var uUpdate = new Usuario(user);

            uUpdate.nome = "Bruno atualizado pelo teste";
            uUpdate.salvar(function(retorno4){
              expect(retorno4.erro).toBe(false);
              done();
            });
          });
        });
      });      
    });
  });  
});