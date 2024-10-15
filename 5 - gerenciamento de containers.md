# Gerenciamento de containers

* Ao tentar executar containers baseados nas imagens __busybox__ ou __alpine__, ambos terminam, pois nenhum container mantém um processo executando.

* Execute o comando `docker history alpine`.

```bash
docker history alpine
IMAGE          CREATED       CREATED BY                                      SIZE  
    COMMENT
beefdbd8a1da   3 weeks ago   /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B  
```

* Perceba que o terminal mostra a instrução `CMD ["/bin/sh"] `. Isso demonstra que o processo __sh__ foi iniciado, mas como nenhuma entrada foi associada a esse processo, ele terminou, assim como a própria execução do container.
* Para associar esse processo ao terminal de nossa máquina local, podemos adicionar um parâmetro à instrução `docker run`, como já fizemos anteriormente.

```bash
docker run -i alpine sh
```

* Ao executar um container com a imagem __nginx__, a saída do console do servidor será associada ao nossa terminal, bloqueando-o. Para evitar isso, podemos usar o modo _detached_, fornecendo o parâmetro `-d`.

```bash
docker run -p 8080:80 -d nginx
c78d18771df5685f6398f126a337028779adb7859d98fc2e649717bf9b92f0d8
```



# Criando múltiplos containers a partir da mesma imagem

* Crie um container baseado na imagem __ubuntu__.
* Liste os diretórios, com o comando `ls`.

```bash
docker run -it ubuntu
root@57c069c0d89b:/# ls
bin   dev  home  lib64  mnt  proc  run   srv  tmp  var
boot  etc  lib   media  opt  root  sbin  sys  usr
```

* Crie um diretório de um arquivo dentro dele.
* Altere o conteúdo do arquivo.
* Imprima o conteúdo do arquivo, para verificar se as alterações persistiram.

```bash
mkdir teste
cd teste
touch arquivo.txt
echo "conteudo" > arquivo.txt
cat arquivo.txt
conteudo
```

* Em um novo terminal, crie outro container com a mesma imagem.

```bash
docker run -it ubuntu
```

* Em seguida, execute o comando `ls`, para verificar o conteúdo do sistema de arquivos no diretório raiz desse novo container.


```bash
root@57c069c0d89b:/# ls
bin   dev  home  lib64  mnt  proc  run   srv  tmp  var
boot  etc  lib   media  opt  root  sbin  sys  usr
```

* Perceba que não há nenhum arquivo chamado __arquivo.txt__. Isso significa que os sistemas de arquivos de cada container são separados, ainda que ambos sejam baseados na mesma imagem e estejam executando no mesmo __Docker Host__.
* É importante salientar que containers compartilham recursos de CPU e RAM, assim como o mesmo kernel, pois executam como processos dentro de uma máquina virtual única. Contudo, o sistema de arquivos é tratado de forma independente e isolada.




## Prática 3

1. Crie um container baseado na imagem `busybox`.
1. Crie um arquivo chamado `teste.txt`. Dentro dele escreva uma mensagem qualquer.
1. Execute o comando `ls`, para verificar se o arquivo foi criado com sucesso.
1. Abra outro terminal e crie um novo container com a imagem `busybox`.
1. Execute o comando `ls` e verifique se o arquivo `teste.txt` pode ser encontrado.
1. Por fim, abra um terceiro terminal e execute o comando `docker ps`, para verificar a quantidade de instâncias do container em execução

```bash
#terminal 1

docker run -it busybox
echo "mensagem" > texte.txt
/ # echo "teste" > teste.txt
/ # ls
bin        dev        etc        home       lib        lib64      proc       root       sys        teste.txt  tmp        usr        var
```

```bash
#terminal 2

docker run -it busybox
/ # ls
bin        dev        etc        home       lib        lib64      proc       root       sys        tmp        usr        var
```

```bash
# terminal 3

docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED         STATUS         PORTS     NAMES
568a13d71c76   busybox   "sh"      5 seconds ago   Up 4 seconds             kind_elgamal       
61e7c2d2ebb1   busybox   "sh"      4 minutes ago   Up 4 minutes             infallible_franklin
```



