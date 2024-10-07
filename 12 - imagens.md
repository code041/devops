# Imagens

* Imagens são camadas de sistemas de arquivos
* A organização em camdads de sistemas de arquivos permite reutilizar as camadas da uma imagem para contruir outra
* Uma imagem não pode ser alterada, mas é possível criar uma nova imagem baseada em uma existente
* Uma imagem pode ter n camadas
* Cada imagem pode ser armazenada em repositórios privados ou públicos

## Criando um `Dockerfile`

* Crie um novo diretório `containers/python`.
* Nesse diretório crie um arquivo chamado `main.py`, com o seguinte conteúdo.

```python
from flask import Flask, jsonify
from flask_cors import CORS

# Cria uma instância da aplicação Flask
app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"])

# Define uma rota para a URL raiz
@app.route('/')
def hello_world():
    return jsonify(message='Hello, World!')  # Retorna um JSON

# Executa o servidor quando o script for executado diretamente
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
```

* Se você tiver o ambiente python instalado em sua máquina, poderá executar a aplicação acima, por meio do comando `python main.py`.
* Se você não tiver o ambiente configurado, não se preocupe, vamos executá-lo em breve a partir de um container __Docker__.
* A aplicação acima simplesmente retorna `Hello world`, quando uma requisição do tipo `GET` é feita para o servidor `Flask`. Por padrão, essa aplicação será associada à porta `5000`.

* No diretório raiz de sua aplicação, crie um arquivo chamado `Dockerfile`.
* Utilize a imagem `python:3.9` como referência.

```Dockerfile
FROM python:3.9
```

* Altere o diretório de trabalho para `/app`. Dessa forma, todos os comandos executados dentro do container terão efeitos sobre esse diretório.

```Dockerfile
WORKDIR /app
```

* Exponha a porta `5000`, a mesma porta padrão da aplicação __Flask__.

```Dockerfile
EXPOSE 5000
```

* Em seguida, copie os arquivos do diretório `containers/python` para o diretório de trabalho do container.

```Dockerfile
COPY . .
```

* Perceba que cada comando dentro do `Dockerfile` cria uma nova camada em nossa imagem.

* Por fim, execute o comando `python main.py`, para associar esse processo à execução do container.

```Dockerfile
CMD ["python", "main.py"]
```

* O `Dockerfile` resultante contém as seguintes instruções:

```Dockerfile
FROM python:3.9

WORKDIR /app

EXPOSE 5000

COPY . .

CMD ["python", "main.py"]
```

## Criando uma imagem a partir de um `Dockerfile`

* No terminal do _host_, no diretório `containers/python`, execute o comando `docker build`.

```bash
docker build -t python-app:0.1 .
```

```console
[+] Building 1.9s (9/9) FINISHED                                                        docker:desktop-linux
 => [internal] load build definition from Dockerfile                                                    0.0s
 => => transferring dockerfile: 181B                                                                    0.0s 
 => [internal] load metadata for docker.io/library/python:3.9                                           1.4s 
 => [auth] library/python:pull token for registry-1.docker.io                                           0.0s
 => [internal] load .dockerignore                                                                       0.0s
 => => transferring context: 2B                                                                         0.0s 
 => [1/3] FROM docker.io/library/python:3.9@sha256:a23efa04a7f7a881151fe5d473770588ef639c08fd5f0dcc698  0.0s 
 => => resolve docker.io/library/python:3.9@sha256:a23efa04a7f7a881151fe5d473770588ef639c08fd5f0dcc698  0.0s 
 => [internal] load build context                                                                       0.0s 
 => => transferring context: 243B                                                                       0.0s 
 => CACHED [2/3] WORKDIR /app                                                                           0.0s 
 => [3/3] COPY . .                                                                                      0.0s 
 => exporting to image                                                                                  0.2s 
 => => exporting layers                                                                                 0.1s 
 => => exporting manifest sha256:8d32b0588a7e612769c1656224e01e5c7495edb84565b621f609df942fe87da5       0.0s
 => => exporting config sha256:e6bf604ca1ed911ef7814ec6c8d4871f399da4c05cd486b160df3a848b43e027         0.0s 
 => => exporting attestation manifest sha256:db723d98248eec99fc579832eecc353c16f1127b3c1221d44ec02cd5e  0.0s 
 => => exporting manifest list sha256:fc4e1c3a0359743a2d5e3c34ee1dcd65d17ff12b3ba9135f872a3f5eab25f677  0.0s 
 => => naming to docker.io/library/python-app:0.1                                                       0.0s 
 => => unpacking to docker.io/library/python-app:0.1                                                    0.0s 
```

* O comando acima cria uma imagem a partir `Dockerfile` que criamos. O parâmetro `-t` serve para dar um nome e uma tag à imagem.
* Para criar um container com base nessa imagem, execute o comando `docker run`.

```bash
docker run -p 5000:5000 python-app
```

```console
Traceback (most recent call last):
  File "/app/main.py", line 1, in <module>
    from flask import Flask
ModuleNotFoundError: No module named 'flask'
```

* Apesar de ter declarado a dependência do servidor __Flask__ no escopo do programa `main.py`, não instalamos essa dependência em nosso container. Para isso, vamos usar o gerenciador de dependências __pip__.
* Do `Dockerfile`, adicione uma instrução para instalar todas as dependências do arquivo `requirements.txt`.

```Dockerfile
FROM python:3.9

WORKDIR /app

EXPOSE 5000

COPY . .

# Instalar as dependências
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "main.py"]
```

* No diretório `containers/python` do _host_, crie o arquivo `requirements.txt`, conforme o exemplo abaixo:

```txt
Flask==2.3.3
flask-cors==3.0.10
gunicorn==20.1.0
requests==2.31.0
```

* Esse arquivo será copiado para dentro do container e será usado na instrução que acabamos de adicionar ao nosso `Dockerfile`, de modo que -ao executar a instrução `pip install`, ela utilizará o conteúdo do arquivo `requirements.txt`, para instalar as dependências necessárias.
* No terminal, execute mais uma vez a instrução `docker build`, fornecendo o valor de uma nova versão para a imagem.

```bash
docker build -t python-app:0.2 .
```

```console
[+] Building 7.7s (9/9) FINISHED                                                        docker:desktop-linux 
 => [internal] load build definition from Dockerfile                                                    0.0s 
 => => transferring dockerfile: 180B                                                                    0.0s 
 => [internal] load metadata for docker.io/library/python:3.9                                           0.6s 
 => [internal] load .dockerignore                                                                       0.0s 
 => => transferring context: 2B                                                                         0.0s 
 => [1/4] FROM docker.io/library/python:3.9@sha256:a23efa04a7f7a881151fe5d473770588ef639c08fd5f0dcc698  0.0s 
 => => resolve docker.io/library/python:3.9@sha256:a23efa04a7f7a881151fe5d473770588ef639c08fd5f0dcc698  0.0s 
 => [internal] load build context                                                                       0.0s 
 => => transferring context: 242B                                                                       0.0s 
 => CACHED [2/4] WORKDIR /app                                                                           0.0s 
 => [3/4] COPY . .                                                                                      0.0s 
 => [4/4] RUN pip install --no-cache-dir -r requirements.txt                                            5.5s 
 => exporting to image                                                                                  1.3s
 => => exporting layers                                                                                 0.8s
 => => exporting manifest sha256:83f3fb8163cfd68a7e7efbb0b554c51cc669e715a1133af273e4cc072d8bdbe3       0.0s
 => => exporting config sha256:169157b9f5ffb72a068b4de50caba802d8a91e295bbc6d1db640340f22d04264         0.0s
 => => exporting attestation manifest sha256:088058ca4c5c4762d21a6e0feb45b9903893b7700af7522c060cbab9d  0.0s
 => => exporting manifest list sha256:6d3f403546ee0292a8a3e0ce2eaead0842854de891aae2d8bf43794979f876df  0.0s
 => => naming to docker.io/library/python-app:0.2                                                       0.0s
 => => unpacking to docker.io/library/python-app:0.2                                                    0.3s 
```

* Perceba que nossa imagem tem 4 camadas, sobre a imagem `python:3.9`. Como a versão `0.1` de nossa imagem possui 2 camadas idênticas à versão `0.2`, o __Docker__ sequer irá alterá-las para montar a nova imagem. 

```console
=> [1/4] FROM docker.io/library/python:3.9@sha256:a23efa04a7f7a881151fe5d473770588ef639c08fd5f0dcc698  0.0s 
 => => resolve docker.io/library/python:3.9@sha256:a23efa04a7f7a881151fe5d473770588ef639c08fd5f0dcc698  0.0s 
```

* No trecho acima, fica evidente que o __Docker__ identificou que essa camada era idêntica em ambas as imagens, de modo que não foi necessário replicá-la. Isso foi feito comparando o _hash_ de cada camada.
* Como a segunda camada é caracteriza pela simples mudança do diretório de trabalho, ela também estava armazenada em _cache_, e -portanto- não foi necessário criá-la novamente, o que tornou o processo de _build_ muito mais rápido.

* Crie uma rede chamada `angular-python`.
* Em seguida, crie um container com a nova imagem, usando o comando `docker run`.

```bash
docker network create angular-python
docker run --network angular-python --name python-app -p 5000:5000 python-app:0.2
```

```console
 * Serving Flask app 'main'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://172.19.0.2:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 128-090-571
```

* Em seu navegador web, acesse o endereço `localhost:5000`, para verificar se as configurações estão corretas.

## Criando uma imagem (2) com um projeto JavaScript

* Crie um novo projeto angular no diretório `containers`

```bash
ng new frontend
```

* Dentro do diretório `containers/frontend`, execute o comando `ng g s servico`.
* Altere o conteúdo do arquivo `servico.service.ts`, conforme o exemplo abaixo:

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

constructor(
  private http: HttpClient
){}

get(): Observable<string> {
  const url = `http://localhost:5000/`;
  return this.http.get(url, { responseType: 'text' }); 

}

}
```

* Agora, altere o conteúdo do arquivo `app.component.ts`, conforme  o exemplo abaixo:

```typescript
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServicoService } from './servico.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'frontend';

  constructor(
    private servico: ServicoService
  ){

  }

  ngOnInit(): void {
      console.log("iniciou");
      this.servico.get().subscribe({
        next: resposta =>{
          console.log(resposta);
        }
      })
  }


}
```

* Também, adicione a instrução `provideHttpClient()` ao arquivo `app.config.ts`, conforme o exemplo:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes) , provideHttpClient(withFetch())]
};

```

* Na raiz do diretório `containers/frontend`, crie o arquivo `Dockerfile`, conforme o exemplo:

```Dockerfile
FROM node:18-alpine

WORKDIR /app

EXPOSE 4200

COPY package.json package-lock.json ./

RUN npm install 

COPY . ./

CMD ["npm", "start"]
```

* Se você tiver o ambiente configurado, poderá executar o comando `npm install` no _host_.
* Esse comando -todavia- vai criar um diretório chamado `node_modules`, contendo todas as dependências do projeto. Sua cópia para o diretório de trabalho do container é indesejada e tornará a construção da imagem mais lenta. Para evitar esse problema, adicione o arquivo `.dockerignore` ao diretório raiz do projeto.

```txt
node_modules
npm-debug.log
.env
```

* Para construir uma imagem com base no `Dockerfile` criado, execute o comando `docker build`.

```bash
docker build -t frontend:0.1
```

* Em seguida, para criar um container com essa imagem, execute o comando `docker run`.

```bash
docker run --network angular-python -p 4200:4200 --name frontend frontend:0.1
```

* Em seu navegador web, acesse o endereço `localhost:4200` e verifique o console. Se tudo foi feito corretamente, você deverá obter a seguinte mensagem.

```
iniciou
core.mjs:30063 Angular is running in development mode.
app.component.ts:25 {
  "message": "Hello, World!"
}
```


