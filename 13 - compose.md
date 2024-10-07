# Docker compose

```yml
version: '3'
services:
  api:
    image: python-app:0.2
    ports:
      - '5000:5000'
    networks:
      - angular-python
  frontend:
    image: frontend:0.6
    ports:
      - '4200:4200'
    networks:
      - angular-python
networks:
  angular-python:
    driver: bridge

```

```bash
docker-compose up`-d
```

```bash
docker ps
```

* Assim com o comando `docker-compose up`, o comando `docker-compose down` também deve ser executado no diretório no qual se encontrado o arquivo `compose.yml`.

```bash
docker-compose down
```

## Mapeando volumes

* Para tornar o processo de desenvolvimento mais rápido, podemos fazer um mapeamento de volumes, entre o diretório que contém a API python e o diretório correspondente no container. Para isso, adicione as seguintes linhas ao arquivo de descriçõa `compose.yml`.

```yml
    volumes:
      -  ./containers/python:/app
```

* Dessa forma, nosso arquivo final deve ficar assim:

```yml
version: '3'
services:
  api:
    image: python-app:0.2
    ports:
      - '5000:5000'
    volumes:
      -  ./containers/python:/app
    networks:
      - angular-python
  frontend:
    image: frontend:0.6
    ports:
      - '4200:4200'
    networks:
      - angular-python
networks:
  angular-python:
    driver: bridge
```

* Utilize o comando `docker-compose up`, para substituir a última configuração; em seguida, altere o valor da mensagem retornada pela API e verifique o resultado no console do navegador web.

## Habilitando o modo _auto-restart_.

* Em um terminal separado, ainda com os serviços rodando, execute o comando `docker ps`, para obter a identificação dos containers

```bash
docker ps   
CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                    NAMES
62a3d423c331   python-app:0.2   "python main.py"         9 minutes ago   Up 9 minutes   0.0.0.0:5000->5000/tcp   devops-api-1
f1f17ef0d919   frontend:0.6     "docker-entrypoint.s…"   9 minutes ago   Up 9 minutes   0.0.0.0:4200->4200/tcp   devops-frontend-1
```

* Acesse o terminal do container da API python, obtenha os processos em execução e termine o processo `python main.py`.

```bash
docker exec -it 62a3 sh
# ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  1.6  0.7  34472 29828 ?        Ss   17:41   0:00 python main.py
root         7  1.2  0.7 107172 28772 ?        Sl   17:41   0:00 /usr/local/bin/python /app/root         9  0.0  0.0   2576  1408 pts/0    Ss   17:41   0:00 sh
root        15  0.0  0.1   8536  4352 pts/0    R+   17:42   0:00 ps aux
# kill 1
#
What's next:
    Try Docker Debug for seamless, persistent debugging tools in any container or image → docker debug 8644
    Learn more at https://docs.docker.com/go/debug-cli/
```

* Em seu navegador web, veja o comportamento da aplicação.

```console
net::ERR_CONNECTION_REFUSED
```

* Repita o comando `docker ps`, para ver os containers em execução.

```bash
docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                    NAMES
f1f17ef0d919   frontend:0.6   "docker-entrypoint.s…"   13 minutes ago   Up 13 minutes   0.0.0.0:4200->4200/tcp   devops-frontend-1
```

* Se um container for derrubado, gostaríamos que o _host_ tentasse iniciar uma nova instância. Para isso, precisamos habilitar o modo _auto-restart_.

* No arquivo `compose.yml`, adicione o parâmetro `restart` a cada declaração de serviço, conforme o exemplo abaixo:

```yml
version: '3'
services:
  api:
    image: python-app:0.2
    ports:
      - '5000:5000'
    volumes:
      -  ./containers/python:/app
    networks:
      - angular-python
  frontend:
    image: frontend:0.6
    ports:
      - '4200:4200'
    networks:
      - angular-python
networks:
  angular-python:
    driver: bridge
```

* Agora, execute o comando `docker-compose up`, para substituir a configuração prévia.
* Em seguida, repita os passos anteriores, para causar uma falha no container da API python.

```bash
```bash
docker ps   
CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                    NAMES
62a3d423c331   python-app:0.2   "python main.py"         9 minutes ago   Up 9 minutes   0.0.0.0:5000->5000/tcp   devops-api-1
f1f17ef0d919   frontend:0.6     "docker-entrypoint.s…"   9 minutes ago   Up 9 minutes   0.0.0.0:4200->4200/tcp   devops-frontend-1

docker exec -it 62a3 sh
# ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  1.6  0.7  34472 29828 ?        Ss   17:41   0:00 python main.py
root         7  1.2  0.7 107172 28772 ?        Sl   17:41   0:00 /usr/local/bin/python /app/root         9  0.0  0.0   2576  1408 pts/0    Ss   17:41   0:00 sh
root        15  0.0  0.1   8536  4352 pts/0    R+   17:42   0:00 ps aux
# kill 1
#
What's next:
    Try Docker Debug for seamless, persistent debugging tools in any container or image → docker debug 8644
    Learn more at https://docs.docker.com/go/debug-cli/
```

* Por fim, verifique o comportamento do _host_ no terminal em que o comando `docker-compose up` foi executado.

```bash
...
frontend-1  |   ➜  Local:   http://localhost:4200/
frontend-1  |   ➜  Network: http://192.168.0.3:4200/
api-1 exited with code 0
api-1       |  * Serving Flask app 'main'
api-1       |  * Debug mode: on
...
```

* Perceba que a aplicação foi terminada, mas o __Docker__ se encarregou de criar um novo container, para substituir o antigo.

## Adicionando um banco de dados

* Obtenha a imagem do banco de dados __mongo__ e o utilitário __mongo-express__.

```bash
docker pull mongo
docker pull mongo-express
```

* Adicione a descrição de dois novos serviços ao arquivo `compose.yml`, conforme o exemplo abaixo:

```yml
  mongo:
    image: mongo
    restart: always
    networks:
      - angular-python
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - 8081:8081
    environment:
      environment:
      ME_CONFIG_MONGODB_SERVER: mongo
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: example
      ME_CONFIG_BASICAUTH: false
    networks:
      - angular-python
    depends_on:
      - mongo   
```

* Não é necessário fazer o mapeamento de portas para o container com o banco de dados, pois ele será acessado somente por meio dos serviços internos. Externamente, ele será acessado por meio do serviço __mongo-express__, ou por meio do _frontendo_ de nossa aplicação.

* O parâmetro `ME_CONFIG_MONGODB_SERVER` aponta para o endereço DNS do serviço __mongo__, que é criado e resolvido pelo próprio __Docker__.

* O parâmetro `depends_on`, serve para orientar o __Docker__ a criar determinado serviço somente depois que outro foi instanciado. Nesse caso, o serviço __mongo-express__ será criado somente após o serviço __mongo__ ser levantado.

* Utilize o comando `docker-compose up -d`, para substituir a configuração anterior e acesse a interface gráfica do __mongo-express__, por meio do endereço `localhost:8081`.
* Agora, crie um banco de dados chamado `tmp`.
* Em seguida, execute o comando `docker-compose down`.
* Por fim, execute o comando `docker-compose up -d`, e verifique se o banco de dados `tmp` foi persistido.

## Adicionando volumes

* Para criar um volume, basta adicionar sua descrição no arquivo `compose.yml`.

```yml
volumes:
  mongo_data:
```

* Em seguida, adicione a referência ao novo volume, na descrição do serviço `mongo`.

```yml
...
services:
  mongo:
    image: mongo
    restart: always
    networks:
      - angular-python
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    volumes:
      - mongo_data:/data/db
...
```






