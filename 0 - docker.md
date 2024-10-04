# Docker

# Máquinas virtuais vs Containers docker

## Máquinas virtuais

* Máquinas virtuais permitem executar um sistema operacional diferente do qual está em execução em uma determinada máquina
* Máquinas virtuais podem ser executadas por meio de provedores de computação em nuvem, o que possibilita hospedar aplicações remotamente
* Uma máquina virtual executa dentro de uma ferramenta do tipo Hypervisor, que -por sua vez- executa dentro de um sistema operacional, que está instalado em uma máquina física. 
* Cada VM possui um espaço de memória dedicado. O kernel de uma VM é separado das demais VMs

## Containers

* No caso de containers, um container não possui um sistema operacional próprio. Ao invés disso, ele usa os recursos da máquina física na qual o Dcoker engine está instalado
* Cada container é um processo separado, mas compartilham os recursos da máquina e o kernel do sistema operacional
* A arquitetura é a seguinte: o SO está hospedado na máquina física, ou em uma VM, e dentro do SO está instalado o Docker Engine
* Ao instalar Docker em um SO windows ou mac, Docker exigirá a execução de uma máquina virtual linux

## Componentes Docker

* Docker client: é o utilitáerio usado para executar comandos no Docker Server
* Docker Host: gerenciar containers
* Docker server: conecta o client e o host, assim como fornece uma api
* Docker images: conjunto de camadas read-only, para criar containers
* Container: uma instancia em execução de uma imagem
* Repository: conjunto de imagens e suas diferentes versões
* REgistry: hub no qual o repositório está hospedado

### Docker client

* O __client__ é um utilitário usado para executar comandos no __server__.
* Ao executar um comando `docker` no terminal, o __client__ é instanciado, conecta-se ao __server__, executa o comando, e depois finaliza o processo.
* Para verificar a versão do __client__, utilize o comando `docker version`
* Para melhor perceber a diferença entre o __client__ e o __serve__, finalize a execução do __Docker Desktop__ (__Docker Engine__ no linux), e repita o comando `docker version`.

```bash
Client:
 Version:           26.1.4
 API version:       1.45
 Go version:        go1.21.11
 Git commit:        5650f9b
 Built:             Wed Jun  5 11:29:54 2024
 OS/Arch:           windows/amd64
 Context:           desktop-linux
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.45/version": open //./pipe/dockerDesktopLinuxEngine: O sistema não pode encontrar o arquivo especificado.
```

* No exemplo acima, o __client__ foi identificado, mas o comando não retornou os dados sobre o __server__, pois ele estava indisponível.

### Docker server

* O __server__ é um conjunto de processos do __Docker__, como o _daemon_, por exemplo.
* Com o __Docker Engine/Desktop__ em execução, repita o comando `docker version`.

```bash
docker version 

Client:
 Version:           26.1.4
 API version:       1.45
 Go version:        go1.21.11
 Git commit:        5650f9b
 Built:             Wed Jun  5 11:29:54 2024
 OS/Arch:           windows/amd64
 Context:           desktop-linux

Server: Docker Desktop 4.31.1 (153621)
 Engine:
  Version:          26.1.4
  API version:      1.45 (minimum version 1.24)
  Go version:       go1.21.11
  Git commit:       de5c9cf
  Built:            Wed Jun  5 11:29:22 2024
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.33
  GitCommit:        d2d58213f83a351ca8f528a95fbd145f5654e957
 runc:
  Version:          1.1.12
  GitCommit:        v1.1.12-0-g51d5e94
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

### Docker host

* Os processos do __server__ executam no __Docker host__.
* Se o __Docker desktop__ foi instalado no Windows ou Mac, o __Docker engine__ executará dentro de uma máquina virtual linux. Pode-se dizer que essa VM é o _host_. Se foi instalado no linux, o __Docker engine__ será executado diretamente na máquina linux, sendo portanto, o próprio _host_ dos processos do __server__.

### Docker images

* Uma imagem é um conjunto de arquivos _read-only_, a partir dos quais é possível criar um container.
* Cada um desses arquivos define uma camada da imagem, que especifica como o sistema de arquivos do container deve se comportar.

### Docker container

* Um container pode ser entendido como uma instância de uma imagem, montada com base nas diferentes camadas
* A camada do container pode ser escrita em tempo de execução
* Crie dois containers baseados na imagem `busybox`. Em um deles crie um arquivo. No outro, verifique se o arquivo está contido no diretório onde foi criado. Este exercício ajuda a demonstrar como os containers possuem espaços de memória separados (desde que não tenham um volume montado para o mesmo diretório no _host_).

### Repository e registry

* Um repositório é um conjunto de diferentes imagens e versões, associadas as tags
* As imagens criadas em seu host são acessíveis somente nele. Para compartilhá-las com outros usuários, você deverá usar um _registry_, como o __Docker Hub__, por exemplo. O Google Cloud Platform e o próprio Github também possuem _registries_, que permitem o compartilhamento de imagens.
* 
