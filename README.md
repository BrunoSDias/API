Como iniciar aplicação  
	npm start  


Antes de validar a aplicação, recomendável instalar o jshint como uma variável de ambiente  
	npm install -g jshint  
Caso va a utilzar dessa forma alterar a key "scripts" do arquivo package.json para utilizá-lo. Exemplo:  
	"scripts": {  
		"jshint": "jshint caminhoDoArquivo/nomeDoArquivo.js"  
	}  
  
Ou pode simplesmente instala-lá como uma dependencia do projeto:  
	npm install --save-dev jshint  
Caso va a utilzar dessa forma alterar a key "scripts" do arquivo package.json para utilizá-lo (verifique se o executável ainda se encontra no mesmo diretório). Exemplo:  
	"scripts": {  
		"jshint": "./node_modules/jshint/bin/jshint caminhoDoArquivo/nomeDoArquivo.js"  
	}  
  
Para executá-lo no CMD basta digitar:  
	npm run-script jshint  

O framework Jasmine foi utilizado para realizar os testes unitários  
Instalação do Jasmine:  
Como dependência do projeto:  
npm install jasmine --save  

Como variavel global:  
npm install -g jasmine  

Caso o jasmine esteja como depêndencia, adicionar sua execução junto à key "scripts" no arquivo package.json  
Para executar os testes unitários (TDD - Test Driven Development)  
	npm run-script test  

REQUIRE  
A lib 'require' foi utilizada para gerar as requisições aos controllers através dos testes.    
