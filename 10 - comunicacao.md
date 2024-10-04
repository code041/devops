# Comunicacao entre containers

## Comunicação pela rede Bridge

* Crie dois containers com a imagem __busybox__, utilizandos dois terminais separados.

```bash
docker run -it --name busybox1 busybox
docker run -it --name busybox2 busybox
```

* Em cada um deles, execute o comando `hostname -i`, para obter o endereço de IP que o _host_ atribuiu a cada um deles.

```bash
/# hostname -i
```

* De posse do IP, execute o comando `ping`, para fazer uma requisição de rede entre os containers.

```bash
/# ping 172.17.0.3
PING 172.17.0.4 (172.17.0.4): 56 data bytes
64 bytes from 172.17.0.4: seq=0 ttl=64 time=0.105 ms
64 bytes from 172.17.0.4: seq=1 ttl=64 time=0.074 ms
```

```bash
/# ping 172.17.0.3
PING 172.17.0.3 (172.17.0.3): 56 data bytes
64 bytes from 172.17.0.3: seq=0 ttl=64 time=0.101 ms
64 bytes from 172.17.0.3: seq=1 ttl=64 time=0.092 ms
^C
--- 172.17.0.3 ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 0.092/0.096/0.101 ms
```

* Para obter mais informações sobre as configurações de rede de cada container, saia do __bash shell__, ou abra um novo terminal e execute o comando `docker inspect`.

```bash
docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED       
   STATUS          PORTS                  NAMES
8d32944937ef   busybox     "sh"                     20 minutes ago   Up 20 minutes                          busybox1
e07ec6f09646   wordpress   "docker-entrypoint.s…"   25 minutes ago   Up 25 minutes   0.0.0.0:8080->80/tcp   serene_hodgkin

docker inspect 8d32
```

```console
...
"NetworkSettings": {
            "Bridge": "",
            "SandboxID": "779dbeea9d54986fed5aaa365d6c68164dc00103144a217c6e45eae79f64a95b",
            "SandboxKey": "/var/run/docker/netns/779dbeea9d54",   
            "Ports": {},
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "6066472434e743f763a9c2c1588ca8d142ec600e815e4d008bde0a1a48f551d7",
            "Gateway": "172.17.0.1",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "172.17.0.3",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "MacAddress": "02:42:ac:11:00:03",
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "MacAddress": "02:42:ac:11:00:03",
                    "NetworkID": "6b1f3489a58d171472a6c29de2b5f5857b614412a7561ace8653aeffff56f0ff",
                    "EndpointID": "6066472434e743f763a9c2c1588ca8d142ec600e815e4d008bde0a1a48f551d7",
                    "Gateway": "172.17.0.1",
                    "IPAddress": "172.17.0.3",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "DriverOpts": null,
                    "DNSNames": null
                }
            }
        }
...
```

## Variáveis de ambiente

* No terminal de um dos containers __busybox__, execute o comando `env`. A execução dele retornará os valores das variáveis de ambiente _default_ dessa imagem.

```bash
HOSTNAME=8d32944937ef
SHLVL=1
HOME=/root
TERM=xterm
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin      
PWD=/
```

* Para iniciar um container com uma variável de ambiente, basta adicionar o parâmetro `-e` ao comando `docker run`.

```bash
docker run -it -e USUARIO=admin -e SENHA=admin1234  --name busybox3 busybox
```

* No terminal desse container, execute o comando `env`

```bash
/ # env
USUARIO=admin
HOSTNAME=013e6451a991
SHLVL=1
HOME=/root
TERM=xterm
SENHA=admin1234
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin        
PWD=/
```

## Configurando a conexão com um banco de dados

* Antes de começar, pare a execução de todos os containers e remova-os.

```bash
docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED             STATUS             PORTS                  NAMES
8d32944937ef   busybox     "sh"                     About an hour ago   Up About an hour                          busybox1

docker stop 8d32
8d32

docker prune
```

* Execute o comando `docker pull`, para obter a imagem do container __phpmyadmin__.
* Em seguida, execute o comando `docker run `, para criar um container com tal imagem.

```bash
docker pull phpmyadmin/phpmyadmin
docker run -p 8080:80 phpmyadmin/phpmyadmin
```

* Você pode verificar o correto funcionamento do novo container, acessando o endereço `localhost:8080`.

* __phpmyadmin__ é uma aplicação web, que permite acessar o banco de dados __mysql__, por meio de uma interface gráfica. Contudo, ainda não configuramos esse banco de dados, nem configuramos o container do __phpmyadmin__.

* Acesse o __Docker Hub__ e procure por `phpmyadmin`, para encontrar informações sobre como configurá-lo.

* Termine a execução dos containers atuais e remova-os.
* Em seguida, crie uma nova instância de __mysql__.
* Execute o comando `docker inspect`, para obter o endereço de IP desse container.

```bash
docker pull mysql
docker run -e MYSQL_ROOT_PASSWORD=my-password mysql
docker ps

CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                 NAMES
f78aa8bdd94f   mysql     "docker-entrypoint.s…"   13 seconds ago   Up 12 
seconds   3306/tcp, 33060/tcp   zealous_ramanujan

docker inspect f78a
```

* Por fim, crie um container com a imagem __phpmyadmin__, fornecendo o endereço IP identificado na etapa anterior.

```bash
docker run -p 8080:80 -e PMA_HOST=172.17.0.2 phpmyadmin/phpmyadmin
```

* Embora somente a senha do usuário padrão tenha sido definida, o valor _default_ do nome do usuário padrão é `root`.
* Em seu navegador web, acesse o endereço `localhost:8080` e acesse o __phpmyadmin__ usando as credenciais configuradas.

* Ainda que essa configuração tenha resolvido nosso problema, existe uma potencial falha em nossa arquitetura: o endereço IP pode mudar, exigindo que os containers sejam terminados e configurados novamente.

## Usando _hostnames_ ao invés de endereços IP

* Para entender como configurar a comunicação entre containers usando _hostnames_, vamos usar a imagem __busybox__ novamente, pois ela é mais simples.

* Crie dois containers com a imagem __busybox__, utilizandos dois terminais separados.

```bash
docker run -it --name busybox1 busybox
docker run -it --name busybox2 busybox
```

* Em cada um deles, execute o comando `hostname -i`, para obter o endereço de IP que o _host_ atribuiu a cada um deles.

```bash
/# hostname -i
```

* Tente executar o comando `ping`, mas ao invés de usar o endereço IP, utilize o nome do container.

```bash
/ # ping 172.17.0.5
PING 172.17.0.5 (172.17.0.5): 56 data bytes
64 bytes from 172.17.0.5: seq=0 ttl=64 time=0.105 ms
64 bytes from 172.17.0.5: seq=1 ttl=64 time=0.056 ms
64 bytes from 172.17.0.5: seq=2 ttl=64 time=0.114 ms
64 bytes from 172.17.0.5: seq=3 ttl=64 time=0.073 ms
64 bytes from 172.17.0.5: seq=4 ttl=64 time=0.071 ms
^C
--- 172.17.0.5 ping statistics ---
5 packets transmitted, 5 packets received, 0% packet loss
round-trip min/avg/max = 0.056/0.083/0.114 ms
/ # ping busybox2
ping: bad address 'busybox2'
```

* Apesar de ter criado um container usando o parâmetro `--name`, isso não é suficiente para utilizá-lo como `hostname` para nossa rede.

* Agora, finalize a execução desses containers e crie novos, usando o parâmetro `-h`

```bash
/ # exit
docker stop busybox1
docker rm busybox1
docker run -it --name busybox1 -h busybox1 busybox 
```

```bash
/ # exit
docker stop busybox2
docker rm busybox2
docker run -it --name busybox2 -h busybox2 busybox 
```

* Repita o procedimento para executar o comando `ping` entre os containers, usando o _hostname_ configurado.

```bash
# hostname -i
172.17.0.5

ping busybox2
```

* Perceba que ainda não foi possível estabelecer a comunicação entre os containers.
* Execute o comando `docker inspect` em um dos containers.

```bash
docker inspect busybox1
...
"Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
...                    
```

* Perceba que o _hostname_ ainda não teve efeito sobre a configuração `Aliases`.
* Isso acontece, porque não é possível conectar containers usando _hostnames_ se a rede for do tipo __Bridge padrão__.
* Para corrigir esse problema, precisamos criar uma nova rede __Bridge customizada__.

## Criando uma nova rede

* Para verificar as redes disponíveis no _host_, execute o comando `docker network ls`

```bash
docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
6b1f3489a58d   bridge    bridge    local
cddb9880d765   host      host      local
54ee20f32b35   none      null      local
```

* Para obter os detalhes da configuração de uma rede, basta executar o comando `docker inspect {ID DA REDE}`

```bash
docker inspect bridge
```

* Além das configurações da própria rede, é possível identificar quais containers estão associados a ela.

```bash
...
Containers": {
            "057f68043e2862b70ab387ed2060f68a1c7c6a613fc3356964088afa694589d7": {
                "Name": "busybox2",
                "EndpointID": "1d277faec9583efd6df9acdb464368d20cb41d6515e07c6abdc5d245a82098de",     
                "MacAddress": "02:42:ac:11:00:04",
                "IPv4Address": "172.17.0.4/16",
                "IPv6Address": ""
            },
...
```

* Para criar uma nova rede, execute o comando `docker network create`

```bash
docker network create custom
```

* Os containers criados nessa sub-rede serão capazes de se comunicar entre si, mas não entre os containers criados na rede _bridge_ padrão.

* Remova todos os containers em execução.
* Em seguida crie dois containers com a imagem __busybox__.

```bash
docker run -it --network custom  busybox
docker run -it --network custom  busybox
```

* Agora, a partir de um terminal, execute o comando `ping` para o outro container, usando o endereço IP e o ID do container do outro container.

```bash
/ # hostname -i
172.18.0.2
/ # ping 172.18.0.3
PING 172.18.0.3 (172.18.0.3): 56 data bytes
64 bytes from 172.18.0.3: seq=0 ttl=64 time=0.098 ms
64 bytes from 172.18.0.3: seq=1 ttl=64 time=0.083 ms
^C
--- 172.18.0.3 ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 0.083/0.090/0.098 ms
/ # ping busybox2
PING f9c2a81a70a8 (172.18.0.3): 56 data bytes
64 bytes from 172.18.0.3: seq=0 ttl=64 time=0.133 ms
64 bytes from 172.18.0.3: seq=1 ttl=64 time=0.070 ms
^C
```

* Crie uma terceira instância. Em seu terminal, obtenha o `hostname`

```bash
C:\Users\Felipe Bill\git\devops>docker run -it --network custom --name busybox3 busybox
/ # hostname
3a54474c3d55
/ #
```

* Em um novo terminal em sua máquina, inspecione a rede __custom__. 
* Verifique se os containers estão todos na mesma rede.

```bash
docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
1da8cbedc85f   bridge    bridge    local
e28f65b3b847   custom    bridge    local
cddb9880d765   host      host      local
54ee20f32b35   none      null      local

docker inspect e28f65b3b847
```

* A partir de um dos dois primeiros, tente acessar o terceiro, usando o IP, ID e _hostname_.

## Exercício extra

1. Crie uma nova rede
1. Crie containers nessa rede
1. Teste a conectividade entre os containers dessa rede e os da rede __custom__. 

## Configurando o _phpmyadmin_ com a rede __custom__

* Finalize a execução de todos os containers ativos; depois elimine-os, com o comando `docker prune`.
* Em seguida, remova e rede __custom__.
* Por fim, crie uma nova rede chamada __mysql__.

```bash
docker prune
docker network rm custom
docker network create mysql
```

* Agora, crie um container com a imagem __mysql__.

```bash
docker run \
  --network mysql \
  -e MYSQL_ROOT_PASSWORD=my-password \ 
  --name mysql \
  -d mysql
```

* Por fim, crie um container com a imagem __phpmyadmin__.

```bash
docker run \
  --network mysql \
  -p 8080:80 \
  -e PMA_HOST=mysql \
  -d phpmyadmin/phpmyadmin \
```

* Para verificar se as configurações estão corretas, acesse o endereço `localhost:8080` em seu navegador web.

## Configurando um container __wordpress__ com banco de dados

* Antes de começar, termine a execução de todos os containers; em seguida, remova-os.

```bash
docker ps
...
docker stop {ID_CONTAINER}
...
docker container prune
```

* Crie a rede `wordpress`

```bash
docker network create wordpress
```

* Obtenha as imagens`mysql:5.7` e `wordpress:5.4`.

```bash
docker pull mysql:5.7
docker pull wordpress:5.4
```

* Crie um container com a imagem `mysql:5.7` 

```bash
docker run --network wordpress -e MYSQL_ROOT_PASSWORD=my-password 
-e MYSQL_DATABASE=wordpress -e MYSQL_USER=wordpress -e MYSQL_PASSWORD=wordpress --name mysql -d mysql:5.7
```

* Crie um container com a imagem `wordpress:5.4` 

```bash
docker run --network wordpress --name wordpress -p 8080:80 -d wordpress:5.4
```

* Crie um container com a imagem `phpmyadmin/phpmyadmin` 

```bash
docker run --network wordpress --name phpmyadmin -p 8081:80 -e PMA_HOST=mysql -d phpmyadmin/phpmyadmin
```

* Execute o comando `docker ps`, para verificar se todos os containers estão em execução

```bash
docker ps
CONTAINER ID   IMAGE                   COMMAND                  CREATED              STATUS              PORTS                  NAMES
d4a193211909   phpmyadmin/phpmyadmin   "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8081->80/tcp   phpmyadmin
12c3335f216e   wordpress:5.4           "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:8080->80/tcp   wordpress
fbc1f659f3e6   mysql:5.7               "docker-entrypoint.s…"   4 minutes ago        Up 4 minutes        3306/tcp, 33060/tcp    mysql-d
```

* Em seu navegador web, acesse o endereço `localhost:8080`.
* Utilize os parâmetros do container `mysql` para configurar a aplicação `wordpress`. O campo `database host` deve ser preenchido com `mysql`.



