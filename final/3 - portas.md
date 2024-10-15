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

* Execute o comando `docker run`, para criar uma instância a partir dessa nova imagem.

```bash
docker run nginx
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

* Crie um novo container a partir da mesma imagem, usando o modo _detached_.

```bash
docker run -d -p 8080:80 nginx
```

* Ao executar esse comando, o __Docker__ deve mostrar na saída do console a identificação do container criado.
* Agora, para obter os _logs_ do servidor web, podemos usar o comando `docker logs {ID DO CONTAINER}`.
* Não é necesário fornecer o __ID__ completo. Basta os primeiros identificadores.

```bash
docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                  NAMES
4ae9f7426147   nginx     "/docker-entrypoint.…"   4 seconds ago   Up 3 seconds   0.0.0.0:8080->80/tcp   elated_mayer

docker logs 4ae9
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
/docker-entrypoint.sh: Sourcing /docker-entrypoint.d/15-local-resolvers.envsh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
/docker-entrypoint.sh: Configuration complete; ready for start up
2024/10/14 19:34:36 [notice] 1#1: using the "epoll" event method
2024/10/14 19:34:36 [notice] 1#1: nginx/1.27.2
2024/10/14 19:34:36 [notice] 1#1: built by gcc 12.2.0 (Debian 12.2.0-14)
2024/10/14 19:34:36 [notice] 1#1: OS: Linux 6.6.31-linuxkit
2024/10/14 19:34:36 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2024/10/14 19:34:36 [notice] 1#1: start worker processes
2024/10/14 19:34:36 [notice] 1#1: start worker process 29
2024/10/14 19:34:36 [notice] 1#1: start worker process 30
2024/10/14 19:34:36 [notice] 1#1: start worker process 31
2024/10/14 19:34:36 [notice] 1#1: start worker process 32
2024/10/14 19:34:36 [notice] 1#1: start worker process 33
2024/10/14 19:34:36 [notice] 1#1: start worker process 34
2024/10/14 19:34:36 [notice] 1#1: start worker process 35
2024/10/14 19:34:36 [notice] 1#1: start worker process 36
2024/10/14 19:34:36 [notice] 1#1: start worker process 37
2024/10/14 19:34:36 [notice] 1#1: start worker process 38
2024/10/14 19:34:36 [notice] 1#1: start worker process 39
2024/10/14 19:34:36 [notice] 1#1: start worker process 40
```

* Você pode associar várias instâncias da mesma imagem a portas diferentes.

```bash
docker run -d -p 8080:80 nginx
docker run -d -p 8081:80 nginx
docker run -d -p 8082:80 nginx
```

* Contudo, não é possível associar duas instâncias à mesma porta do _host_.

```bash
docker run -d -p 8080:80 nginx
docker run -d -p 8080:80 nginx
5961225d54990bef5cbc54b5fba2633389c9bf9ad41abb9b0283fb2d08a07111
docker: Error response from daemon: driver failed programming external connectivity on endpoint quizzical_lumiere (4cd497488c54e3c329e86fed8d6fc208a78ea5bb50ff9676e155f0046e575d61): Bind for 0.0.0.0:8080 failed: port is already allocated.
```

