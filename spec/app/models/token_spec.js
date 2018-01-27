var Token = require('../../../app/models/token');

describe("O modelo de token", function() {
	describe("com o atributo", function() {

//--Teste: verifica se atributo id é válido
    it("id precisa ser válido", function() {
    	var token = new Token();
      expect(token.id).toBe(0);
    });

//--Teste: verifica se atributo token é válido
    it("token precisa ser válido", function() {
    	var token = new Token();
      expect(token.token).toBe('');
    });
  });

  describe('com o método',function(){

//---Teste: salvar
    it('salvar precisa salvar o registro do usuário na base de dados',function(done){
      new Token().criar(function(retorno){
        expect(retorno.erro).toBe(false);
        expect(retorno.token).not.toBe('');
        done();
      }); 
    });

    //---Teste: verificaToken(Invalido)
    it('verificaToken deve retornar false para um token inválido',function(done){
      Token.verificaToken('tokeninvalido', function(retorno){
        expect(retorno.tokenValidado).toBe(false);
        done();
      }); 
    });

    //---Teste: apagarToken
    it('apagarToken deve apagar o token',function(done){
      new Token().criar(function(retornoCriar){
        var token = retornoCriar.token;
        Token.apagarToken(token, function(retornoApagar){
          Token.verificaToken(token, function(retornoValidar){
            expect(retornoValidar.tokenValidado).toBe(false);
            done();
          }); 
        }); 
      });      
    });

     //---Teste: verificaToken(Valido)
    it('apagarToken deve apagar o token',function(done){
      new Token().criar(function(retornoCriar){
        var token = retornoCriar.token;
          Token.verificaToken(token, function(retornoValidar){
            expect(retornoValidar.tokenValidado).toBe(true);
            done();
          }); 
        });      
    });

    //-- Termina describe
  });  
});
