# Bancos de dados

* Obtenha a última versão da imagem do banco de dados __mongodb__, por meio do comando `docker pull mongo`.

```bash
docker pull mongo

Using default tag: latest
latest: Pulling from library/mongo
e5e3b551bf11: Download complete
07ed7efc9402: Download complete
876eec4ef49d: Download complete
0b39c673fa12: Download complete
2ffb4886d703: Download complete
f36248f814ef: Download complete
a6208dee2c0e: Download complete
Digest: sha256:a3d0dec40b95df592c7e7eef603019ba03b164998c3b394739e0dd4cd45d490d
Status: Downloaded newer image for mongo:latest
docker.io/library/mongo:latest
```

* Para criar um container com essa imagem, execute o comando `docker run mongo`.
* No console, identifique a porta na qual o banco de dados está ouvindo.
* O container está associado ao nosso terminal, contudo além do processo atual, essa imagem possui outros utilitários como o __mongo shell__. A questão é: como iniciar outro processo dentro de um container que está em execução?
* Em outro terminal, execute a instrução `docker exec -it {ID DO CONTAINER} bash` 
* Para obter os arquivos no diretório raiz, execute `ls` no terminal do container; para obter os processos em execução, `ps -e`

```bash
docker exec -it  c79 bash

root@c79e0417520b:/# ls
bin   dev                         home        lib64  opt   run   sys  var
boot  docker-entrypoint-initdb.d  js-yaml.js  media  proc  sbin  tmp
data  etc                         lib         mnt    root  srv   usr

root@c79e0417520b:/# ps -e
  PID TTY          TIME CMD
    1 ?        00:00:03 mongod
   73 pts/0    00:00:00 bash
   81 pts/0    00:00:00 ps
```

## O que é um _entrypoint_ ?

* Abra um novo terminal na máquina local e execute o comando `docker inspect {ID DO CONTAINER}`
* Nas primeiras linhas da saída do console, você deve identificar duas chaves: __Created__ e __Args__.

```bash
docker inspect c79        
[
    {
        "Id": "c79e0417520b256f96c1484285955d055dac02bc1178918bc211e0932436907d",    
        "Created": "2024-10-01T13:59:55.7735872Z",
        "Path": "docker-entrypoint.sh",
        "Args": [
            "mongod"
        ],
        ...
```

* Essas duas informações indicam que o container foi iniciado com a execução do _script_ `docker-entrypoint.sh` e com o argumento `mongod`.

* Agora, dentro do terminal do container (_mongo shell_), acesse o diretório `/usr/local/bin` e execute os comandos `ls` e `cat`.

```bash
cd usr/local/bin
ls
docker-entrypoint.sh  gosu   

cat docker-entrypoint.sh
```

* Usando o _mongo shell_, você pode verificar os executáveis instalados, no diretório `usr/bin`.

# Criando um banco de dados com _Mongo Shell_

* No terminal da máquina local, execute o comando `docker exec -it {ID DO CONTAINER}`
* No __Mongo Shell__, execute o comando `db.version()`

```bash
docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS       
   PORTS       NAMES
8703fa557236   mongo     "docker-entrypoint.s…"   27 seconds ago   Up 26 seconds   27017/tcp   frosty_payne

docker exec -it 8703 bash

root@8703fa557236:/# mongosh

test> db.version()
8.0.0
```

* Para verificar quais bancos de dados estão disponíveis, execute o comando `show dbs`

```bash
test> show dbs
admin   40.00 KiB
config  12.00 KiB
local   40.00 KiB
```

* Certifique-se de que está no banco `test`, por meio do comando `use test`.
* Para inserir um novo valor, execute o comando `insert`

```bash
use test
test> db.animals.insertOne({"animal":"cat"})
test> db.animals.insertOne({"animal":"dog"})
test> db.animals.insertOne({"animal":"monkey"})
```

* Para obter os registros de um banco, utilize o comando `find`

```bash
test> db.animals.find()
[
  { _id: ObjectId('66fc3975f32b8db9da964034'), animal: 'cat' },
  { _id: ObjectId('66fc3a0ff32b8db9da964035'), animal: 'dog' },
  { _id: ObjectId('66fc3a13f32b8db9da964036'), animal: 'monkey' }
]
```


* Termine a execução desse container e crie um novo container a partir da mesma imagem.

```bash
docker run mongo
docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS        
 PORTS       NAMES
02c76bea17e6   mongo     "docker-entrypoint.s…"   7 seconds ago   Up 6 seconds  
 27017/tcp   practical_benz

docker exec -it 02c7 bash 
root@02c76bea17e6:/# mongosh

> use test
test> db.animals.find()

```

* Perceba que a consulta não retornou nenhum resultado. Isso aconteceu, porque, embora os dois containers tenham sido criados a partir da mesma imagem, a camada que permite reescrita de cada um deles é isolada e funciona de forma independente.
* Finalize a execução desse container.
* Obtenha a identificação do container que foi criado previamente, por meio do comando `docker ps -a`, e reinicie-o.

```bash
docker ps -a
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS       
                 PORTS       NAMES
02c76bea17e6   mongo     "docker-entrypoint.s…"   2 minutes ago    Up 2 minutes 
                 27017/tcp   practical_benz
8703fa557236   mongo     "docker-entrypoint.s…"   17 minutes ago   Exited (0) 3 
minutes ago                  frosty_payne
31b755c81bef   mongo     "docker-entrypoint.s…"   31 minutes ago   Exited (255) 
17 minutes ago   27017/tcp   kind_wing
c79e0417520b   mongo     "docker-entrypoint.s…"   4 hours ago      Exited (255) 
31 minutes ago   27017/tcp   flamboyant_wu

docker start 8703
```

* Agora, acesse o __Mongo Sheel__ novamente e faça uma consulta aos registros do banco de dados.

```bash
docker exec -it 02c7 mongosh

```

