var Usuario = require('../models/usuario');
var Token = require('../models/token');

var UsuariosController = {
    head: function(req, res, next){
        new Token().criar(function(retorno){
            res.header('auth_token', retorno.token);
            res.status(204).send('');
      }); 
    },
	todos: function(req, res, next){
        if(req.query.nome != undefined){
            Usuario.buscarPorNome(req.query.nome, function(retorno){                
                if(retorno.erro){
                    res.status(500).send({erro: 'erro ao buscar usuarios por nome ('+ req.query.nome +') - ('+retorno.mensagem+'}'});
                }
                else
                {
                    res.status(200).send(retorno.usuarios);
                }
            });
        }
        else
        {
            Usuario.todos(function(retorno){
                if(retorno.erro){
                    res.status(500).send({erro: 'erro ao buscar usuarios ('+retorno.mensagem+'}'});
                }
                else
                {
                    res.status(200).send(retorno.usuarios);
                }
            });
        }       
	},
    porId: function(req, res, next){
        Usuario.buscarPorId(req.params.id, function(retorno){
            if(retorno.erro){
                res.status(500).send({erro: 'erro ao buscar usuario por id('+retorno.mensagem+')'});
            }
            else
            {
                if(retorno.usuario.nome != undefined){
                    res.status(200).send(retorno.usuario);
                }
                else
                {
                    res.status(404).send({mensagem: "usuario não encontrado"});                    
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
                    erroAnswer+= 'Erro ao cadastrar usuário, campo nome precisa estar preenchido - ';
                    campoVazio = true;
                }
                if(req.body.login == undefined){
                    erroAnswer+='Erro ao cadastrar usuário, campo login precisa estar preenchido - ';                    
                    campoVazio = true;
                }
                if(req.body.senha == undefined){
                    erroAnswer+='Erro ao cadastrar usuário, campo senha precisa estar preenchido - ';
                    campoVazio = true;
                }
                if(req.body.email == undefined){
                    erroAnswer+='Erro ao cadastrar usuário, campo email precisa estar preenchido';
                    campoVazio = true;
                }

                if(campoVazio){
                    res.status(400).send({erro: erroAnswer});
                    return;
                }

                var usuario = new Usuario();

                usuario.nome = req.body.nome;
                usuario.login =  req.body.login;
                usuario.senha = req.body.senha;
                usuario.email = req.body.email;

                usuario.salvar(function(retorno){            
                    if(retorno.erro){
                        res.status(500).send({erro: 'erro ao cadastrar o usuario('+retorno.mensagem+')'});
                    }
                    else
                    {
                        res.status(201).send({mensagem: 'Usuário criado com sucesso'});
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
                Usuario.buscarPorId(req.body.id, function(retorno){
                    if(retorno.usuario.id == undefined){                        
                        res.status(400).send({
                            erro: 'Erro ao atualizar, id de usuário não encontrado'
                        });
                    }
                    else
                    {
                        var usuario = new Usuario();

                        usuario.id = req.body.id;
                        usuario.nome = req.body.nome;
                        usuario.login =  req.body.login;
                        usuario.senha = req.body.senha;
                        usuario.email = req.body.email;

                        usuario.salvar(function(retorno){            
                            if(retorno.erro){
                                res.status(500).send({erro: 'erro ao atualizar o usuario('+retorno.mensagem+')'});
                            }
                            else
                            {
                                res.status(200).send({mensagem: 'Usuário atualizado com sucesso'});
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
                Usuario.buscarPorId(req.params.id, function(retorno){
                    if(retorno.usuario.id == undefined){
                        res.status(400).send({
                            erro: 'Erro ao atualizar, id de usuário não encontrado'
                        });
                    }
                    else
                    {

                        var usuario = new Usuario(retorno.usuario);

                        if(req.body.nome !== undefined && req.body.nome !== ''){
                            usuario.nome = req.body.nome;
                        }                

                        if(req.body.login !== undefined && req.body.login !== ''){
                            usuario.login = req.body.login;
                        }                

                        if(req.body.senha !== undefined && req.body.senha !== ''){
                            usuario.senha = req.body.senha;
                        }                

                        if(req.body.email !== undefined && req.body.email !== ''){
                            usuario.email = req.body.email;
                        }                

                        usuario.salvar(function(retorno){            
                            if(retorno.erro){
                                res.status(500).send({erro: 'erro ao atualizar o usuario('+retorno.mensagem+')'});
                            }
                            else
                            {
                                res.status(200).send({mensagem: 'Usuário atualizado com sucesso'});
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
    excluirUsuario: function(req, res, next){     
        var token = req.headers.auth_token;
        Token.verificaToken(token, function(retorno){
            if(retorno.tokenValidado){              
                Token.apagarToken(token);   
                Usuario.excluirPorId(req.params.id, function(retorno){
                    if(retorno.erro){
                        res.status(500).send({erro: 'erro ao excluir o usuario('+retorno.mensagem+')'});
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

module.exports = UsuariosController;