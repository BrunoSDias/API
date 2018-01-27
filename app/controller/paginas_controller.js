var Pagina = require('../models/pagina');
var Token = require('../models/token');

var PaginasController = {
    head: function(req, res, next){
        new Token().criar(function(retorno){
            res.header('auth_token', retorno.token);
            res.status(204).send('');
      }); 
    },
	todos: function(req, res, next){
        if(req.query.nome != undefined){
            Pagina.buscarPorNome(req.query.nome, function(retorno){                
                if(retorno.erro){
                    res.status(500).send({erro: 'erro ao buscar paginas por nome ('+ req.query.nome +') - ('+retorno.mensagem+'}'});
                }
                else
                {
                    res.status(200).send(retorno.paginas);
                }
            });
        }
        else
        {
            Pagina.todos(function(retorno){
                if(retorno.erro){
                    res.status(500).send({erro: 'erro ao buscar paginas ('+retorno.mensagem+'}'});
                }
                else
                {
                    res.status(200).send(retorno.paginas);
                }
            });
        }       
	},
    porId: function(req, res, next){
        Pagina.buscarPorId(req.params.id, function(retorno){
            if(retorno.erro){
                res.status(500).send({erro: 'erro ao buscar pagina por id('+retorno.mensagem+')'});
            }
            else
            {
                if(retorno.pagina.nome != undefined){
                    res.status(200).send(retorno.pagina);
                }
                else
                {
                    res.status(404).send({mensagem: "pagina não encontrado"});                    
                }
            }
        });
    },
    criar: function(req, res, next){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        
        var token = req.headers.auth_token;
        Token.verificaToken(token, function(retorno){
            if(retorno.tokenValidado){

                Token.apagarToken(token);
                var erroAnswer = '';
                var campoVazio = false;

                if(req.body.nome == undefined){
                    erroAnswer+= 'Erro ao cadastrar página, campo nome precisa estar preenchido - ';
                    campoVazio = true;
                }
                if(req.body.conteudo == undefined){
                    erroAnswer+='Erro ao cadastrar página, campo conteudo precisa estar preenchido - ';                    
                    campoVazio = true;
                }

                if(campoVazio){
                    res.status(400).send({erro: erroAnswer});
                    return;
                }

                var pagina = new Pagina();

                pagina.nome = req.body.nome;
                pagina.conteudo =  req.body.conteudo;

                pagina.salvar(function(retorno){            
                    if(retorno.erro){
                        res.status(500).send({erro: 'erro ao cadastrar o pagina('+retorno.mensagem+')'});
                    }
                    else
                    {
                        res.status(201).send({mensagem: 'Página criado com sucesso'});
                    }
                });
            }
            else
            {
                res.status(401).send({erro: 'Token inválido, você não tem autorização para acessar essa API'});
            }
        });
    },
    atualizar: function(req, res, next){
        var token = req.headers.auth_token;
        Token.verificaToken(token, function(retorno){

            console.log(retorno.tokenValidado);

            if(retorno.tokenValidado){
                Token.apagarToken(token);
                Pagina.buscarPorId(req.body.id, function(retorno){
                    if(retorno.pagina.id == undefined){                        
                        res.status(400).send({
                            erro: 'Erro ao atualizar, id de página não encontrado'
                        });
                    }
                    else
                    {
                        var pagina = new Pagina();

                        pagina.id = req.body.id;
                        pagina.nome = req.body.nome;
                        pagina.conteudo =  req.body.conteudo;

                        pagina.salvar(function(retorno){            
                            if(retorno.erro){
                                res.status(500).send({erro: 'erro ao atualizar o pagina('+retorno.mensagem+')'});
                            }
                            else
                            {
                                res.status(200).send({mensagem: 'Página atualizado com sucesso'});
                            }
                        });
                    }
                });     
                
            }
            else
            {
                res.status(401).send({erro: 'Token inválido, você não tem autorização para acessar essa API'});
            }
        });           
    },
    atualizarPorPatch: function(req, res, next){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        var token = req.headers.auth_token;
        Token.verificaToken(token, function(retorno){
            if(retorno.tokenValidado){ 
                Token.apagarToken(token);                
                Pagina.buscarPorId(req.params.id, function(retorno){
                    if(retorno.pagina.id == undefined){
                        res.status(400).send({
                            erro: 'Erro ao atualizar, id de página não encontrado'
                        });
                    }
                    else
                    {

                        var pagina = new Pagina(retorno.pagina);

                        if(req.body.nome !== undefined && req.body.nome !== ''){
                            pagina.nome = req.body.nome;
                        }                

                        if(req.body.conteudo !== undefined && req.body.conteudo !== ''){
                            pagina.conteudo = req.body.conteudo;
                        }             

                        pagina.salvar(function(retorno){            
                            if(retorno.erro){
                                res.status(500).send({erro: 'erro ao atualizar o pagina('+retorno.mensagem+')'});
                            }
                            else
                            {
                                res.status(200).send({mensagem: 'Página atualizado com sucesso'});
                            }
                        });
                    }
                });
            }
            else
            {
                res.status(401).send({erro: 'Token inválido, você não tem autorização para acessar essa API'});
            }
        });         
    },
    excluirPagina: function(req, res, next){     
        var token = req.headers.auth_token;
        Token.verificaToken(token, function(retorno){
            if(retorno.tokenValidado){              
                Token.apagarToken(token);   
                Pagina.excluirPorId(req.params.id, function(retorno){
                    if(retorno.erro){
                        res.status(500).send({erro: 'erro ao excluir o pagina('+retorno.mensagem+')'});
                    }
                    else
                    {
                        res.status(204).send('');
                    }
                });     
            }
            else
            {
                res.status(401).send({erro: 'Token inválido, você não tem autorização para acessar essa API'});
            }
        });
    },
    options: function(req, res, next){   
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type');     
        res.status(204).send('');                   
    }    
};

module.exports = PaginasController;