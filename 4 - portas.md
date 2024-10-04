# Portas

* __nginx__ é um popular webserver, que também pode ser usado como um _load balancer_, permitindo que outros _webservers_ possam ser usados em conjunto.

* Execute o comando `docker pull nginx`, para obter a imagem mais recente do __nginx__.

```bash
C:\Users\Felipe Bill\git\devops>docker pull nginx
Using default tag: latest
latest: Pulling from library/nginx
67b9310357e1: Download complete
af17adb1bdcc: Download complete
97182578e5ec: Download complete
d1875670ac8a: Download complete
cd986b3703ae: Download complete
34a52cbc3961: Download complete
302e3ee49805: Download complete
Digest: sha256:b5d3f3e104699f0768e5ca8626914c16e52647943c65274d8a9e63072bd015bb
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
```

* Execute o comando `docker images`, para verificar o tamanho da imagem de __nginx__.

```bash
C:\Users\Felipe Bill\git\devops>docker images
REPOSITORY                                TAG
                         IMAGE ID       CREATED         SIZE
nginx                                     latest
                         b5d3f3e10469   6 weeks ago     273MB

```

* Perceba que a execução desse container bloqueou o uso do terminal. Abra outro terminal e execute o comando `docker container ps`

```bash
C:\Users\Felipe Bill\git\devops>docker container ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS     NAMES
20dbd987ad7f   nginx     "/docker-entrypoint.…"   28 seconds ago   Up 27 
seconds   80/tcp    frosty_feistel
```

* Embora o container esteja em execução, não é possível acessar o servidor web, pois as portas do container não foram mapeadas para as do _host_. Você pode tentar acessar o endereço `localhost:80` por meio do navegador web, para verificar isso. 

* Para terminar a execução desse container, execute o comando `docker stop {CONTAINER ID}`. 
* Em seguida, verifique se a execução terminou efetivamente, por meio do comando `docker container ps`

```bash
C:\Users\Felipe Bill\git\devops>docker stop 20dbd987ad7f
20dbd987ad7f

C:\Users\Felipe Bill\git\devops>docker container ps      
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

```

* Agora, execute o comando `docker run -p 8080:80 nginx`.
* Em seguida, acesse o endereço `localhost:8080` em seu navegador web.
* O parâmetro `-p` determina que a porta 8080 do _host_ (nossa máquina física) deve ser associado à porta 80 do container criado. Como o servidor __nginx__ escuta a porta 80 por padrão, isso nos permite acessar o servidor por meio de nossa máquina física.

* O terminal no qual o comando acima foi executado agora está mostrando o log do servidor __nginx__.

```bash
192.168.65.1 - - [29/Sep/2024:15:57:44 +0000] "GET / HTTP/1.1" 200 615 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36" "-"
192.168.65.1 - - [29/Sep/2024:15:57:44 +0000] "GET /favicon.ico HTTP/1.1" 404 555 "http://localhost:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36" "-"
2024/09/29 15:57:44 [error] 29#29: *1 open() "/usr/share/nginx/html/favicon.ico" failed (2: No such file or directory), client: 192.168.65.1, server: localhost, request: "GET /favicon.ico HTTP/1.1", host: "localhost:8080", referrer: "http://localhost:8080/"
192.168.65.1 - - [29/Sep/2024:15:57:54 +0000] "GET / HTTP/1.1" 200 615 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0" "-"
192.168.65.1 - - [29/Sep/2024:15:57:54 +0000] "GET /favicon.ico HTTP/1.1" 404 555 "http://localhost:8080/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0" "-"2024/09/29 15:57:54 [error] 30#30: *2 open() "/usr/share/nginx/html/favicon.ico" failed (2: No such file or directory), client: 192.168.65.1, server: localhost, request: "GET /favicon.ico HTTP/1.1", host: "localhost:8080", referrer: "http://localhost:8080/"
```

* Para terminar a execução do servidor, e consequentemente do container, basta executar `CTRL+X+ENTER` no terminal.

* Crie um arquivo __HTML__, conforme o exemplo abaixo:

```html
<h1>Hello world</h1>
```

## Mapeando um volume

* Em seguida, execute o comando `docker run`, conforme o exemplo abaixo.
* Vamos utilizar o parâmetro `-v`, para associar o conteúdo do diretório de nossa máquina ao de um diretório dentro do container.

```bash
docker run -p 8081:80 -v C:\containers:/usr/share/nginx/html nginx
```

* Assim como para o parâmetro `-p`, o argumento é composto por duas partes. A primeira se refere à máquina local; a segunda, ao container. 
* Acesse a aplicação por meio do navegador web, no endereço `localhost:8081`, para verificar se a execução está correta.

## Adicionando um _favicon_ na aplicação

* Acesse o site `https://favicon.io/favicon-generator/` e crie um ícone para  a sua aplicação.
* Baixe os ícones e adicione os arquivos no mesmo diretório em que a aplicação se encontra em sua máquina local.
* Copie o conteúdo da seção `Installation` e cole no arquivo `index.html`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha aplicação</title>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
</head>
<body>
    <h1>Hello W@rld</h1>
</body>
</html>
```

* Acesse a aplicação e verifique se as alterações surtiram efeito. Não é necessário reiniciar o container.

## Utilizando uma variável para o _bind mount_

* Termine a execução do container.
* Acesse o diretório no qual estão localizados os arquivos de sua aplicação.
* Execute o comando `docker run`, conforme o exemplo abaixo

```bash
C:\containers>docker run -p 8081:80 -v %CD%:/usr/share/nginx/html nginx
```

* No Windows, a variável `%CD` pode ser usada para se referir ao diretório atual.
* No Linux, pode-se usar a variável `$PWD`. É possível utilizá-la no Windows, por meio do PowerShell.





