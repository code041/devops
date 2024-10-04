# Imagens menores

## Busybox

Busybox é o menor container com utilitários linux.

* No terminal, execute o comando `docker run busybox:latest`.

```bash
docker run busybox:latest
```

```console
Unable to find image 'busybox:latest' locally
latest: Pulling from library/busybox
2fce1e0cdfc5: Download complete
Digest: sha256:c230832bd3b0be59a6c47ed64294f9ce71e91b327957920b6929a0caa8353140
Status: Downloaded newer image for busybox:latest
```

* Agora, execute o comando `docker run -it busybox`, para acessar o terminal desse container no modo iterativo.

```bash
docker run -it busybox
```

* No __bash shell__, execute o comando `ls`, para verificar o conteúdo disponível

```bash
# ls
```

```console
bin    etc    lib    proc   sys    usr
dev    home   lib64  root   tmp    var
```

* Perceba que o comando `ls` também está disponível nessa imagem, mas a quantidade de diretórios é menor do que a vista na imagem __ubuntu__.

* No __bash shell__ execute o comando `ls bin` e procure pelo executável __echo__.

```bash
ls bin
```

* Em seguida, ainda no __bash shell__ tente executar o comando `uptime`, para praticar.

* Crie um diretório, acesse-o, e crie um arquivo chamado __file.txt__.

```bash
/ # mkdir meu-diretorio
/ # cd meu-diretorio/
/meu-diretorio # touch file.txt
/meu-diretorio # ls
file.txt
```

* Por  fim, verifique o tamanho da imagem __busybox__ e compare-a com o da imagem __ubuntu__.

```bash
docker images
```

```console
REPOSITORY                                TAG
                                          IMAGE ID       CREATED         SIZE 
ubuntu                                    latest
                                          dfc10878be8d   4 weeks ago     117MB
busybox                                   latest
                                          c230832bd3b0   16 months ago   6.54M
```

## Alpine

* Embora __busybox__ seja o menor container com utilitários __linux__, ela não é a menor imagem __linux__ verdadeiramente.

* Sem criar um container baseado na imagem __alpine__, execute um comando `pull`, para obter a última versão dessa imagem.

```bash
C:\Users\Felipe Bill\git\devops>docker pull alpine
Using default tag: latest
latest: Pulling from library/alpine
43c4264eed91: Download complete
Digest: sha256:beefdbd8a1da6d2915566fde36db9db0b524eb737fc57cd1367effd16dc0d06d
Status: Downloaded newer image for alpine:latest
docker.io/library/alpine:latest

What's next:
    View a summary of image vulnerabilities and recommendations → docker scout quickview alpine
```

* Repita o comando `docker pull alpine:latest`

```bash
C:\Users\Felipe Bill\git\devops>docker pull alpine:latest
latest: Pulling from library/alpine
Digest: sha256:beefdbd8a1da6d2915566fde36db9db0b524eb737fc57cd1367effd16dc0d06d
Status: Image is up to date for alpine:latest
docker.io/library/alpine:latest
```

* Perceba que, como a imagem já havia sido obtido do __Docker Hub__, nosso host apenas comparou o _hash_ das duas imagens e não baixou ela novamente.

* Crie uma instância de um container baseado na imagem __alpine__, associe o terminal o __bash shell__ no modo iterativo, e obtenha as informações da imagem __linux__ desse container.

```bash
docker run -it alpine sh
C:\Users\Felipe Bill\git\devops>docker run -it alpine sh
/ # cat etc/os-release
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.20.3  
PRETTY_NAME="Alpine Linux v3.20"
HOME_URL="https://alpinelinux.org/"
BUG_REPORT_URL="https://gitlab.alpinelinux.org/alpine/aports/-/issues"
exit
```

* Repita o procedimento com uma image __busybox__.

```bash
C:\Users\Felipe Bill\git\devops>docker run -it busybox sh
/ # cat /etc/os-release
cat: can't open '/etc/os-release': No such file or directory
```

* Conforme mencionado, __busybox__ é apenas um conjunto de utilitários, mas não é uma imagem __linux__ efetivamente, como o __alpine__.

* Adicionalmente, você também pode comparar o conteúdo dos diretórios __bin__ de cada imagem, por meio do comando `ls`.

```bash 
ls bin
```

* Agora, execute o comando `ls -la bin`, no __bash__ do container da imagem __alpine__. 

```bash
/ # ls -la bin
total 800
drwxr-xr-x    2 root     root          4096 Sep  6 11:34 .
drwxr-xr-x    1 root     root          4096 Sep 27 19:12 ..
lrwxrwxrwx    1 root     root            12 Sep  6 11:34 arch -> /bin/busybox
lrwxrwxrwx    1 root     root            12 Sep  6 11:34 ash -> /bin/busybox
lrwxrwxrwx    1 root     root            12 Sep  6 11:34 base64 -> /bin/busybox
lrwxrwxrwx    1 root     root            12 Sep  6 11:34 bbconfig -> /bin/busybox
-rwxr-xr-x    1 root     root        808712 Jun 10 07:11 busybox
...
``` 

* Perceba que os comandos estão mapeados para o executável __busybox__. Isso acontece, porque a imagem __alpine__ é baseada na imagem __busybox__ e os utilitários foram compilados e distrubuídos por meio de um único executável, cujos comandos foram mapeados. Dessa forma, você pode executar esses comandos diretamente, sem ter que executar o utilitário __busybox__.

* No __bash__ em cada um dos containers, execute o comando `ifconfig --help`

```bash
/ # ifconfig --help
BusyBox v1.36.1 (2024-06-10 07:11:47 UTC) multi-call binary.
```

```bash
/ # ifconfig --help
BusyBox v1.36.1 (2023-05-18 22:34:17 UTC) multi-call binary.
```

* Perceba que a versão do utilitário __busybox__ é a mesma, tanto na imagem __busybox__, quanto na imagem __alpine__.

