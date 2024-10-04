# Servidores Node.js

* Obtenha a imagem mais recente do servidor __node__.
* Crie um container a partir dessa imagem.
* Acesse o terminal dentro desse container e execute alguns comandos __JavaScript__.

```bash
docker pull node
docker run -it node
> console.log("Hello")
```

## Criando uma pequena aplicação com o servidor web express

* Assim como fizemos com o servidor __nginx__, vamos expor o acesso a uma aplicação __JavaScript__, usando o __Express__.
* Para isso, precisamos baixar e configurar tal servidor, utilizando o gerenciador de dependências __NPM__.
* Crie o arquivo `index.js`, conforme o exemplo abaixo, sob o diretório `containers/node/express`.

```javascript
const express = require('express')
const app = express()

app.get('/', function (req, res){
    res.send('Express app')
})

app.listen(3000)
```

* No terminal, sob o mesmo diretório no qual o arquivo acima foi criado, execute o seguinte comando:

```bash
docker run -it -v "%CD%:/app" -w /app node npm init
```

```console
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (app)
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC)
About to write to /app/package.json:

{
  "name": "app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": ""
}


Is this OK? (yes)
```

* Esse comando determina que a execução do processo ocorra em modo iterativo, dado o parâmetro `-it`.
* O parâmetro `-v` diz ao __Docker__ como fazer o _bind mounting_, associando o diretório __app__ sob o diretório atual, ao diretório __app__ do container.
* O parâmetro `-w`diz ao __Docker__ para mudar o diretório de trabalho para __app__ dentro do container. Dessa forma, o comando `npm init` é executado a partir desse diretório.
* Perceba que no diretório `node/express` de nossa máquina local, agora há um arquivo chamado `package.json`.

* Agora, execute o comando abaixo no terminal:

```bash
docker run -it -v "%CD%:/app" -w /app node npm install express
```

* Percebe que no diretório ao qual foi feito o _bind mounting_ em nossa máquina local, agora há um novo diretório chamado __node_modules__ contendo as dependências de nossa aplicação.

* Por fim, execute o comando abaixo:

```bash
docker run -p 3000:3000 -v "%CD%:/app" -w /app node node index.js
```

* Acesse o endereço `localhost:3000` em seu navegador web, para verificar se a aplicação está funcionando.
* Você também pode executar o comando `docker ps`, para verificar os containers em execução.

## Recebendo SIGINT e SIGTERM pela linha de comando

* Ao executar o último comando, você pode ter percebido que o terminal ficou bloqueado.
* Uma solução para esse problema é abrir outro terminal; outra solução consiste em executar a instrução acima junto do parâmetro `-d`.
* Outra solução mais interessante é permitir que o terminal possa ser finalizado, a partir do terminal do container. Para isso, precisamos alterar nossa aplicação.

```javascript
const express = require('express')
const process = require('process')
const app = express()

process.on('SIGINT', () => {
  console.log('App interrompida')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('App finalizada')
  process.exit(0)
})

app.get('/', function (req, res){
    res.send('Express app')
})

app.listen(3000)
```

* No terminal, execute o comando `docker ps`.

```bash
docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS
 NAMES
c074d9f689da   node      "docker-entrypoint.s…"   15 minutes ago   Up 15 minutes   0.0.0.0:3000->3000/tcp  
 charming_ritchie
```

* Em seguida, execute o comando `docker kill {ID DO CONTAINER}`.
* Feito isso, crie um novo container, com a aplicação atualizada.

```bash
docker kill c07
c07

docker run -p 3000:3000 -v "%CD%:/app" -w /app -it node node index.js
f3ad704d789b03076a05c49b100449a84257be8159a711a8d68632d702916acc
```

* Por fim, no terminal, digite `CTRL + C`.
* Perceba que a aplicação demora alguns segundos para terminar.
* Crie um novo container e, em outro terminal, execute o comando `docker stop {ID DO CONTAINER}`.
* Perceba que, agora, o sinal SIGTERM finaliza a execução do container mais rapidamente.

## Manipulando arquivos por meio do container

* Crie o arquivo `index.js` no diretório `containers/node/files`.

```javascript
const fs = require('fs')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question('Nome do arquivo: ' , filename => {
    readline.question('Conteúdo do arquivo: ' , text =>{
        fs.writeFile(`${filename}.txt` , text, err =>{
            if(err) throw err
            console.log("arquivo criado com sucesso")
            readline.close()
        })
    })
})
```