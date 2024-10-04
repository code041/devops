# Introdução

* No terminal, execute o comando `docker run hello-world`.

```bash
docker run hello-world
```

```console
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5944: Download complete
Digest: sha256:91fb4b041da273d5a3273b6d587d62d518300a6ad268b28628f74997b93171b2
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

* Como a imagem __hello-world__ não pode ser encontrada, o __Docker Host__ se encarregará de buscá-la no __Docker Hub__.

* Como nenhum processo foi associado ao container, sua execução terminou.

* Para verificar quais container estão em execução, use o comando `docker ps` no terminal.

```bash
docker ps
```

```console
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

* No caso, não temos nenhum container em execução.

* Para verificar todos os containers, inclusive aqueles que terminaram de executar, use o comando `docker ps -a` no terminal.

```bash
docker ps -a
```

```console
CONTAINER ID   IMAGE         COMMAND    CREATED          STATUS                      PORTS     
NAMES
0534d10a0bb7   hello-world   "/hello"   11 minutes ago   Exited (0) 11 minutes ago
vibrant_thompson
```

* Para verificar as imagens disponíveis localmente, execute o comando `docker images`.

```bash
docker images
```

```
REPOSITORY                                TAG
                         IMAGE ID       CREATED         SIZE
docker/desktop-kubernetes                 kubernetes-v1.29.2-cni-v1.4.0-critools-v1.29.0-cri-dockerd-v0.3.11-1-debian   ee4d0cb41223   6 months ago    629MB
registry.k8s.io/kube-apiserver            v1.29.2
                         fe4196cd9fa0   7 months ago    166MB
registry.k8s.io/kube-proxy                v1.29.2
                         4a993783f8b8   7 months ago    114MB
registry.k8s.io/kube-controller-manager   v1.29.2
                         4ac9c5b9e65b   7 months ago    159MB
registry.k8s.io/kube-scheduler            v1.29.2
                         108e51c8bcd2   7 months ago    81.3MB
registry.k8s.io/etcd                      3.5.10-0
                         22f892d7672a   11 months ago   208MB
registry.k8s.io/coredns/coredns           v1.11.1
                         1eeb4c7316ba   13 months ago   82MB
docker/desktop-vpnkit-controller          dc331cb22850be0cdd97c84a9cfecaf44a1afb6e
                         7ecf567ea070   16 months ago   47MB
hello-world                               latest
                         91fb4b041da2   17 months ago   24.4kB
registry.k8s.io/pause                     3.9
                         7031c1b28338   23 months ago   1.07MB
docker/desktop-storage-provisioner        v2.0
                         115d77efe6e2   3 years ago     59.2MB
```

* __hello-world__ agora faz parte das imagens disponíveis em nosso __Docker host__. Ao instanciar um novo container com essa imagem, ela não será baixada novamente.

* Perceba que há outras imagens disponíveis, como o __docker-desktop__ e o __docker-kubernetes__.