# Volumes

## Persistindo e compartilhando dados

* Obtenha a identificação de cada um dos containers em execução.
* Em seguida, termine a execução de cada um deles, por meio do comando `docker stop {ID}`.
* Por fim, remova os containers do _host_, por meio do comando `docker container prune`.

* Os registros criados nos bancos de dados são persistidos no diretório `data/db` do container.

* Em sua máquina local, crie o diretório `containers/mongo`.
* Do terminal da máquina local, acesse esse diretório e crie uma instância do banco __mongo__.

```bash
containers/mongo> docker run -d -v "%CD%/db:/data/db" mongo
035a876affe6ffd528f9810b823d5f752eca8bc4bf5f2e68dd25aced721ae16a
```

* Acesse o diretório `containers/mongo/db` e perceba que agora há diversos arquivos nele.
* Em seguida, acesse o __Mongo Shell__ desse container.

```bash
docker exec -it 035a mongosh
```

* No __Mongo Shell__, adicione três registros ao banco de dados, conforme o exemplo abaixo:

```bash
use test
test> db.animals.insertOne({"animal":"cat"})
test> db.animals.insertOne({"animal":"dog"})
test> db.animals.insertOne({"animal":"monkey"})
```

* Em seguida, saia desse terminal, finalize a execução do container e elimine-o.

```bash
docker stop 035a
docker rm 035a
docker ps

CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

```

* Agora, crie um novo container a partir da mesma imagem.

```bash
docker run -d -v "%CD%/db:/data/db" mongo
```

* Acesse novamente o __Mongo Shell__ e execute o comando `find` para obter os registros persistidos.

```bash

```