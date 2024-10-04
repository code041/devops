# Múltiplos containers

* Copie o conteúdo do diretório da aplicação criada na aula anterior.
* Renomeie os diretórios para `nginx1` e `nginx2`.
* Altere o contéudo do corpo do documento, conforme o exemplo abaixo:

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
    <h1>Container 1</h1>
</body>
</html>
```

* A partir de cada um desses diretórios, em dois terminais separados, execute os comandos abaixo:

```bash
docker run -p 5555:80 -v %CD%:/usr/share/nginx/html --name nginx1 nginx 
```

```bash
docker run -p 7777:80 -v %CD%:/usr/share/nginx/html --name nginx2 nginx 
```

* Se estiver usando __Linux__, troque a variável `%CD%` por `$PWD`.

# Gerenciando containers criados

* Termine a execução dos containers __nginx__.
* Em seguida, execute o comando `docker ps -a`, para listar os containers ativos e inativos.
* Compare com as imagens disponíveis em nosso __Docker Host__, utilizando o comando `docker images`.
* Existem múltiplos containers que foram criados a partir das mesmas imagens. Alguns deles são idênticos; outros, não. Ao invés de criar um novo container, toda vez que queremos instanciar um deles, podemos reiniciá-los. Para isso, utilize o comando `docker start {ID DO CONTAINER}`.

```bash
docker start nginx1
```

* Para parar a execução de um container, basta usar o comando `docker stop {ID}`.
* Para removê-lo permanentemente, use o comando `docker rm {ID}`. 



* Para remover todos os cointainers, use o comando `docker container prune`. Antes disso, contudo, reinicie o container __nginx2__.

```bash
docker start nginx2
```

* Verifique os containers em execução, e os inativos.

```bash
docker ps -a

CONTAINER ID   IMAGE            COMMAND                  CREATED          STATUS
   PORTS                  NAMES
1ea44ce03d23   nginx            "/docker-entrypoint.…"   36 minutes ago   Up 31 seconds
   0.0.0.0:7777->80/tcp   nginx2
b30619c1488c   nginx            "/docker-entrypoint.…"   43 minutes ago   Exited (0) 41 minutes ago                          gifted_cray
c78d18771df5   nginx            "/docker-entrypoint.…"   4 hours ago      Exited (0) 4 hours ago   
                          hardcore_kapitsa
39397995f404   alpine           "sh"                     4 hours ago      Exited (127) 4 hours ago 
                          admiring_ptolemy
5a3f2c54641f   alpine           "sh"                     4 hours ago      Exited (130) 4 hours ago 
                          mystifying_panini
445bb75680b6   alpine           "sh"                     4 hours ago      Exited (0) 4 hours ago   
                          crazy_bassi
43607c957183   busybox          "sh"                     4 hours ago      Exited (0) 4 hours ago   
                          youthful_johnson
91984067dc3e   nginx            "/docker-entrypoint.…"   4 hours ago      Exited (0) 4 hours ago   
                          affectionate_einstein
82241322fc67   nginx            "/docker-entrypoint.…"   5 hours ago      Exited (0) 4 hours ago   
                          elegant_kirch
f57c0b3d92b1   nginx            "/docker-entrypoint.…"   5 hours ago      Exited (0) 5 hours ago   
                          fervent_mcnulty
e7e909f54fd0   nginx            "/docker-entrypoint.…"   5 hours ago      Exited (0) 5 hours ago   
                          happy_chandrasekhar
11a17f955a4f   nginx            "/docker-entrypoint.…"   5 hours ago      Exited (0) 5 hours ago   
                          funny_davinci
4facf18cf9bc   nginx            "/docker-entrypoint.…"   5 hours ago      Exited (0) 5 hours ago   
                          sharp_cray
58c1f3ca706c   nginx            "/docker-entrypoint.…"   26 hours ago     Exited (0) 26 hours ago  
                          keen_shirley
238c205040e0   nginx            "/docker-entrypoint.…"   26 hours ago     Exited (0) 26 hours ago  
                          cool_torvalds
b2c3e5099dc2   nginx            "/docker-entrypoint.…"   26 hours ago     Exited (0) 26 hours ago  
                          admiring_hodgkin
20dbd987ad7f   nginx            "/docker-entrypoint.…"   27 hours ago     Exited (0) 27 hours ago  
                          frosty_feistel
773ea786906c   busybox          "sh"                     2 days ago       Exited (0) 27 hours ago  
                          festive_joliot
7ca6aa3b933d   alpine           "sh"                     2 days ago       Exited (0) 2 days ago    
                          optimistic_heyrovsky
dbdee00c995a   busybox          "sh"                     2 days ago       Exited (1) 2 days ago    
                          magical_ride
a156812f1677   busybox          "sh"                     2 days ago       Exited (0) 2 days ago    
                          fervent_hamilton
863b8a8a897b   alpine           "sh"                     2 days ago       Exited (0) 2 days ago    
                          eloquent_margulis
39405cc25f23   busybox          "sh"                     3 days ago       Exited (0) 2 days ago    
                          distracted_goldberg
5abe4b989fd8   busybox:latest   "sh"                     3 days ago       Exited (0) 3 days ago    
                          nervous_engelbart
cf58e1e8582f   ubuntu           "bash"                   3 days ago       Exited (0) 3 days ago    
                          blissful_kepler
6bc81af08914   ubuntu           "bash"                   3 days ago       Exited (0) 3 days ago    
                          unruffled_hypatia
e1ea0794c5d2   ubuntu           "/bin/bash"              3 days ago       Exited (0) 3 days ago    
                          priceless_chebyshev
```

* Por fim, execute o comando `docker container prune`.

```bash
docker prune
docker: 'prune' is not a docker command.
See 'docker --help'

C:\containers\nginx1>docker container prune
WARNING! This will remove all stopped containers.
Are you sure you want to continue? [y/N] y
Deleted Containers:
b30619c1488c91b16a7a2d6aaff6b6facc8eb8cb4601af430b2f3f2d92602c2a
c78d18771df5685f6398f126a337028779adb7859d98fc2e649717bf9b92f0d8
39397995f404b46efa0bf1e2b6afe94c27665a67cf2722bde20573fe051f3b5f
5a3f2c54641f0def241b0a4fdc17ee8614770f6759f0fe492bc9992ae1921d82
445bb75680b663f45b711c15eaf5d34cf106e966c496d93a9bcc06d99b1f7ddf
43607c9571831ed4efa5df7ffc5e41fc6cf31c797de2d90fd72ed2dd08935a6b
91984067dc3ea795d4c4241486cc022b718235394a25f640c3e364b689aa0a2e
82241322fc676726f5b54e51efc9a6cb610728da5be9a661ae830adcb5131b4d
f57c0b3d92b19e2523ec30d21b268327ec883bc41998ebabd24e5008db46f0e1
e7e909f54fd09c2e7244e969f27b8be5776dabbfd423e2fa197c7afdb32aed55
11a17f955a4fc94b6f8e2b82f0f54eda25162a88a9b07d20791e2680468097d0
4facf18cf9bc1439c65c2a350584b863d2c2264b1ee311e4ca9ad43a9698913c
58c1f3ca706ca34f895fb0570cabb81683590d2a2f0d61fe8fae8cde5b99e90c

Total reclaimed space: 1.487MB

```

* Para remover apenas alguns containers específicos, é possível informar suas identificações em uma única instrução.
* Crie 3 containers a partir da imagem __alpine__.

```bash
docker run --name alpine1 alpine
docker run --name alpine2 alpine
docker run --name alpine3 alpine
```

* Em seguida, execute o comando `docker ps -a`, para verificar os containers criados.
* Por fim, execute o comando `docker container rm alpine1 alpine3`, seguido de `docker ps -a`, para verificar se a exclusão ocorreu com sucesso.

```bash
docker container rm alpine1
alpine1

docker container rm alpine3
alpine3
```

```bash
docker ps -a
CONTAINER ID   IMAGE     COMMAND            CREATED              STATUS                          PORTS     NAMES
212cae4eb545   alpine    "/bin/sh"          About a minute ago   Exited (0) About a minute ago     
        alpine2
1fc29da96f95   alpine    "--name alpine1"   2 minutes ago        Created
        brave_cartwright
```












