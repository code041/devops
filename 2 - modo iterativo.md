# Modo iterativo

* No terminal, execute o comando `docker run ubuntu`.

```bash
docker run ubuntu
```

* Como a imagem não está disponível localmente, o __Docker Host__ vai obtê-la no __Docker Hub__.

```console
Unable to find image 'ubuntu:latest' locally
latest: Pulling from library/ubuntu
dafa2b0c44d2: Download complete
Digest: sha256:dfc10878be8d8fc9c61cbff33166cb1d1fe44391539243703c72766894fa834a
Status: Downloaded newer image for ubuntu:latest
```

* Em seguida, execute o comando `docker ps -a`, para verificar os containers, inclusive aqueles que terminaram de executar.

```bash
docker ps -a
```

```console
CONTAINER ID   IMAGE     COMMAND       CREATED         STATUS                     PORTS     NAMES
6348c66c0df7   ubuntu    "/bin/bash"   3 seconds ago   Exited (0) 2 seconds ago             condescending_mclaren
```

* Em seguida, execute o comando `docker run -it ubuntu bash`.

```bash
docker run -it ubuntu bash
```

```console
C:\Users\Felipe Bill\git\devops>docker run -it ubuntu bash
root@10afaa457875:/# 
```

* Esse comando instancia um container com a imagem __ubuntu__. O parâmetro `-it` associa nosso terminal ao processo `bash`. Dessa forma, a execução não terminal, até que o comando `exit` seja executado no __bash shell__.

* Abra um outro terminal e execute o comando `docker ps`

```bash
docker ps
```

```console
CONTAINER ID   IMAGE     COMMAND   CREATED              STATUS
   PORTS     NAMES
10afaa457875   ubuntu    "bash"    About a minute ago   Up About a minute             optimistic_ptolemy
```

* Perceba que agora o __STATUS__ do container está com o estado __Up__.

* No __bash shell__ do container, execute o comando `ls`, para obter os arquivos e diretórios do diretório atual.

```bash
root@cf58e1e8582f:/# ls
```

```console
bin   dev  home  lib64  mnt  proc  run   srv  tmp  var
boot  etc  lib   media  opt  root  sbin  sys  usr
```

* Para obter o conteúdo de um dos diretórios listados acima, como o __bin__ por exemplo, no __bash shell__, execute o comando `ls bin`

```bash
root@cf58e1e8582f:/# ls bin
```

```console
'[                        hostid             savelog
addpart                   hostname           script
apt                       i386               scriptlive
apt-cache                 iconv              scriptreplay
apt-cdrom                 id                 sdiff
apt-config                infocmp            sed
apt-get                   infotocap          select-editor
apt-key                   install            sensible-browser
apt-mark                  ionice             sensible-editor
...
```

* Execute o comando `echo 'hello-world'`

```bash
root@cf58e1e8582f:/# echo 'hello-world'
```

```console
hello-world
```

* Como __echo__ é um executável disponível na imagem __ubuntu__, é possível executá-lo por meio do __bash shell__ dentro desse container.

* Execute também os comandos `hostname` e `hostname -i` no __bash shell__ do container.

```bash
root@cf58e1e8582f:/# hostname
```

```console
cf58e1e8582f
```

```bash
root@cf58e1e8582f:/# hostname -i
```

```console
172.17.0.2
```

* O primeiro comando mostra a identificação do container; o segundo, o endereço de IP.

* No __bash shell__ do container, execute o comando `exit`.

```bash
root@10afaa457875:/# exit
```

```console
exit
```

* Agora, execute novamente o comando `docker ps -a`.

```bash
docker ps -a
```

```console
CONTAINER ID   IMAGE     COMMAND       CREATED              STATUS
              PORTS     NAMES
6bc81af08914   ubuntu    "bash"        6 seconds ago        Exited (0) 4 seconds ago                  unruffled_hypatia
e1ea0794c5d2   ubuntu    "/bin/bash"   About a minute ago   Exited (0) About a minute ago             priceless_chebyshev
```

> O comando `docker container ls` tem o mesmo efeito que o comando `docker ps`

