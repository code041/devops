# _Sidecar services_ 

* Antes de começar, termine a execução e remova todos os containers.

* Obtenha a imagem `appropriate/curl` do __Docker Hub__.

```bash
docker pull appropriate/curl
```

* Crie um container com essa imagem, sobrescrevendo o comando _default_ `curl`, pelo comando `sh`.
* A partir do _shell_ do container, execute o comando `curl google.com`.

```bash
docker run -it appropriate/curl sh
# curl google.com

<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="http://www.google.com/">here</A>.
</BODY></HTML>
```

* Obtenha a imagem `elasticsearch:7.6.2`

```bash
docker pull elasticsearch:7.6.2
``` 

* Crie uma nova rede, chamada `elasticsearch`.

```bash
docker network create elasticsearch
```

* Crie um container baseado na imagem `elasticsearch:7.6.2`; e outro, na imagem `appropriate/curl`.

```bash
docker run --network elasticsearch --name elasticsearch 
  -p 9200:9200  -e "discovery.type=single-node" -d elasticsearch:7.6.2

docker run -it --network elasticsearch --name curl appropriate/curl sh
```

* Em seu navegador web, acesse o endereço `localhost:9200`

```json
{
  "name" : "f4e868ddf49a",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "ru7fCZtnRFirtlZSrMyMPg",
  "version" : {
    "number" : "7.6.2",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "ef48eb35cf30adf4db14086e8aabd07ef6fb113f",
    "build_date" : "2020-03-26T06:34:37.794943Z",
    "build_snapshot" : false,
    "lucene_version" : "8.4.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

* A partir do _bash shell_ do container __curl__, execute o comando `ping` para o container __elasticsearh__.

```bash
/ # ping elasticsearch
PING elasticsearch (172.22.0.3): 56 data bytes
64 bytes from 172.22.0.3: seq=0 ttl=64 time=0.079 ms
64 bytes from 172.22.0.3: seq=1 ttl=64 time=0.093 ms
^C
```

* No terminal do container __curl__, execute os comandos abaixo, para inserir um novo _index_ e obter os índices atualmente registrados.

```bash
curl -XPUT http://elasticsearch:9200/my-index
curl -XGET http://elasticsearch:9200/_cat/indices?v
```

* Adicione os seguintes documentos:

```bash
curl -POST http://elasticsearch:9200/my-index/cities/1 -H 'Content-Type: application/json' -d '{"city":"New York"}'
curl -POST http://elasticsearch:9200/my-index/cities/2 -H 'Content-Type: application/json' -d '{"city":"Paris"}'
curl -POST http://elasticsearch:9200/my-index/cities/3 -H 'Content-Type: application/json' -d '{"city":"Tokyo"}'
```

```bash
# curl -XGET http://elasticsearch:9200/my-index/_mapping?pretty
{
  "my-index" : {
    "mappings" : {
      "properties" : {
        "city" : {
          "type" : "text",        
          "fields" : {
            "keyword" : {
              "type" : "keyword", 
              "ignore_above" : 256
            }
          }
        }
      }
    }
  }
}
```

* Para obter um documento pelo ID

```bash
curl -XGET http://elasticsearch:9200/my-index/cities/1?pretty
```

* Para obter todos os documentos do índice

```bash
curl -XGET http://elasticsearch:9200/my-index/_search?pretty
```

* Para pesquisar um documento pelo seu conteúdo

```bash
# curl -XGET http://elasticsearch:9200/my-index/_search?q=city:new
{"took":3,"timed_out":false,"_shards":{"total":1,"successful":1,"skipped":0,"failed":0},"hits":{"total":{"value":1,"relation":"eq"},"max_score":0.81427324,"hits":[{"_index":"my-index","_type":"cities","_id":"1","_score":0.81427324,"_source":{"city":"New York"}}]}}/ #
```

## Criando um container __Redis__

* __MongoDB__ e __ElasticSearch__ são alternativas aos bancos de dados relacionais, utilizados para persistir dados em grandes volumes. __Redis__ é um banco de dados em memória, usado para aplicações que exigem alta performance e dados em tempo real.

* Para obter a imagem mais recente e criar um container __Redis__, execute o comando `docker run`.
* Para criar um terminal e acessá-lo dentro desse container, no modo iterativo, execute o comanto `docker exec`.

```bash
docker run --name redis redis
docker exec -it redis redis-cli
127.0.0.1:6379> 
```

* Para inserir um registro, use o comando `SET`; para recuperar um registro, `GET`

```bash
SET key1 "Ola mundo"
OK

GET key1
"Ola mundo"
```

* Agora, remova os containers em execução; crie uma rede chamada `redis`; instancie um container com a imagem `redis` e outro com a imagem `redis-commander`.

```bash
docker network create redis

docker run --name redis --network redis -d redis

docker run --name redis-commander --network redis -p 8081:8081 -e REDIS_HOST=redis -d rediscommander/redis-commander
```

* Por fim, em seu navegador web, acesse o endereço `localhost:8081` e insira valores no banco de dados, por meio da interface gráfica.



