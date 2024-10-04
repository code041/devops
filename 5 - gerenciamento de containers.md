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

* Ao executar esse comando, o __Docker__ deve mostrar na saída do console a identificação do container criado.
* Agora, para obter os _logs_ do servidor web, podemo usar o comando `docker logs {ID DO CONTAINER}`.
* Não é necesário fornecer o __ID__ completo. Basta os primeiros identificadores.

```bash
docker logs c78d18
```

* Para terminar a execução desse container, basta executar o comando `docker stop {ID DO CONTAINER}`

```bash
docker stop c78d18
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





