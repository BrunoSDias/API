var Pagina = require('../../../app/models/pagina');

describe("O modelo de página", function() {
	describe("com o atributo", function() {

//--Teste: verifica se atributo id é válido
    it("id precisa ser válido", function() {
    	var pagina = new Pagina();
      expect(pagina.id).toBe(0);
    });

//--Teste: verifica se atributo nome é válido
    it("nome precisa ser válido", function() {
    	var pagina = new Pagina();
      expect(pagina.nome).toBe('');
    });

//--Teste: verifica se atributo conteudo é válido
    it("conteudo precisa ser válido", function() {
    	var pagina = new Pagina();
      expect(pagina.conteudo).toBe('');
    });
  });

  describe('com o método',function(){

//---Teste: salvar
    it('salvar precisa salvar o registro do página na base de dados',function(done){
      var pagina = new Pagina();

      pagina.nome = 'Página de teste';
      pagina.conteudo =  'Algum conteudo';

      pagina.salvar(function(retorno){
        expect(retorno.erro).toBe(false);
        done();
      });      
    });

//---Teste: método excluirTodos
    it('excluirTodos precisa apagar todos os registros da tabela',function(done){
      Pagina.excluirTodos(function(retorno){
        expect(retorno.erro).toBe(false);
        done();
      });      
    });

//---Teste: método buscaPorId
    it('buscarPorId precisa retornar o registro da tabela paginas pelo seu id',function(done){
       Pagina.truncateTable(function(retorno1){
        var pagina = new Pagina();

        pagina.nome = 'Criando página nova';
        pagina.conteudo =  'teste conteudo';

        pagina.salvar(function(retorno2){
          Pagina.buscarPorId(1, function(retorno3){
            expect(retorno3.erro).toBe(false);            
            expect(retorno3.pagina.id).toBe(1);
            done();
          });
        });
      });      
    });

//---Teste: método excluirPorId
    it('excluirPorId deve excluir seu página por id',function(done){
       Pagina.truncateTable(function(retorno1){
        var pagina = new Pagina();

        pagina.nome = 'Criando página nova';
        pagina.conteudo =  'teste conteudo';

        pagina.salvar(function(retorno2){
          Pagina.excluirPorId(1, function(retorno3){
            expect(retorno3.erro).toBe(false);            
            done();
          });
        });
      });      
    });

//---Teste: método todos
    it('todos precisa retornar todos os registros da tabela',function(done){
       Pagina.excluirTodos(function(retorno1){
        var pagina = new Pagina();

        pagina.nome = 'Criando página nova';
        pagina.conteudo =  'teste conteudo';

        pagina.salvar(function(retorno2){
          Pagina.todos(function(retorno3){
            expect(retorno3.erro).toBe(false);
            expect(retorno3.paginas.length).toBe(1);
            done();
          });
        });
      });      
    });

//---Teste: método salvar (Atualizar)
    it('salvar precisa atualizar o respectivo página',function(done){
       Pagina.excluirTodos(function(retorno1){
        var pagina = new Pagina();

        pagina.nome = 'Criando página nova';
        pagina.conteudo =  'teste conteudo'; 

        pagina.salvar(function(retorno2){
          Pagina.todos(function(retorno3){
            var user = retorno3.paginas[0];
            var uUpdate = new Pagina(user);

            uUpdate.nome = "Nome atualizado";
            uUpdate.salvar(function(retorno4){
              expect(retorno4.erro).toBe(false);
              done();
            });
          });
        });
      });      
    });

//---Teste: método buscaPorNome
    it('buscarPorNome precisa retornar o  registros da tabela',function(done){
       Pagina.excluirTodos(function(retorno1){
        var nome = "pagina de busca original";
        var pagina = new Pagina({nome: nome, conteudo:'uma pagina de busca'});
        pagina.salvar(function(retorno2){
          var pagina2 = new Pagina({nome:'página de busca 2', conteudo:'blabla'});
          pagina2.salvar(function(retorno3){
            Pagina.buscarPorNome('original', function(retorno4){              
              expect(retorno4.erro).toBe(false);
              expect(retorno4.paginas.length).toBe(1);
              expect(retorno4.paginas[0].nome).toBe(nome);
              done();
            });
          });
        });      
      });
    });
    //-- Termina describe
  });  
});
