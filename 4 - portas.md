


* Crie um arquivo __HTML__, conforme o exemplo abaixo:

```html
<h1>Hello world</h1>
```

## Mapeando um volume

* Em seguida, execute o comando `docker run`, conforme o exemplo abaixo.
* Vamos utilizar o parâmetro `-v`, para associar o conteúdo do diretório de nossa máquina ao de um diretório dentro do container.

```bash
docker run -p 8081:80 -v C:\containers:/usr/share/nginx/html nginx
```

* Assim como para o parâmetro `-p`, o argumento é composto por duas partes. A primeira se refere à máquina local; a segunda, ao container. 
* Acesse a aplicação por meio do navegador web, no endereço `localhost:8081`, para verificar se a execução está correta.

## Adicionando um _favicon_ na aplicação

* Acesse o site `https://favicon.io/favicon-generator/` e crie um ícone para  a sua aplicação.
* Baixe os ícones e adicione os arquivos no mesmo diretório em que a aplicação se encontra em sua máquina local.
* Copie o conteúdo da seção `Installation` e cole no arquivo `index.html`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha aplicação</title>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
</head>
<body>
    <h1>Hello W@rld</h1>
</body>
</html>
```

* Acesse a aplicação e verifique se as alterações surtiram efeito. Não é necessário reiniciar o container.

## Utilizando uma variável para o _bind mount_

* Termine a execução do container.
* Acesse o diretório no qual estão localizados os arquivos de sua aplicação.
* Execute o comando `docker run`, conforme o exemplo abaixo

```bash
C:\containers>docker run -p 8081:80 -v %CD%:/usr/share/nginx/html nginx
```

* No Windows, a variável `%CD` pode ser usada para se referir ao diretório atual.
* No Linux, pode-se usar a variável `$PWD`. É possível utilizá-la no Windows, por meio do PowerShell.





