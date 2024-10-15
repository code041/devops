# Redes

* Quando o K8s é iniciado, ele cria uma rede privada interna. Conforme os pods são criados, ele associa um endereço IP dentro dessa rede.
* Execute o comando `kubectl get pods` e verifique o endereço IP associado a cada Pod

```bash
kubectl apply -f deploy.yml
kubectl scale --replicas=6 -f deploy.yml 

kubectl get pods -o wide
NAME                                READY   STATUS    RESTARTS      AGE     IP          NODE             NOMINATED NODE   READINESS GATES
myapp-deploy-99c54f6fb-2cvrf   1/1     Running             0          7s    10.1.1.55   docker-desktop   <none>           <none>
myapp-deploy-99c54f6fb-9vnwc   1/1     Running             0          7s    10.1.1.53   docker-desktop   <none>           <none>
myapp-deploy-99c54f6fb-btmkq   0/1     ContainerCreating   0          7s    <none>      docker-desktop   <none>           <none>
myapp-deploy-99c54f6fb-rpgvp   0/1     ContainerCreating   0          7s    <none>      docker-desktop   <none>           <none>
myapp-deploy-99c54f6fb-vfccx   1/1     Running             0          7s    10.1.1.54   docker-desktop   <none>           <none>
myapp-deploy-99c54f6fb-zcs5l   1/1     Running             0          48s   10.1.1.52   docker-desktop   <none>           <none>
          
```

* Cada Pod executa uma réplica de nossa aplicação, contudo o protocolo DNS não será capaz de mapear um endereço aos múltiplos endereços IP que foram criados para cada uma dessas réplicas. Portanto, será necessário criar uma abstração capaz de distribuir as requisições entre tais réplicas.


## Cluster IP

* Um sistema possui serviços em diferentes camadas, como o _frontend_, _backend_ e o banco de dados. 
* Ao criar réplicas, cada uma delas ganha um endereço de IP diferente. 
* Além disso, sempre que uma réplica falha, o K8s cria uma nova instância e atribui a ela um novo endereço de IP aleatório. 
* Como não existe a possibilidade de fixar um endereço de IP a um serviço, é necessário criar um serviço que permita acessar pods de diferentes camadas sem a necessidade de conhecer o endereço de rede de cada réplica.
* O nome desse serviço é __Cluster IP__.

###  Prática

* Para este exercício, vamos criar dois _deploys_, o `frontend-deploy.yml` e o `backend-deploy.yml`, conforme os exemplos abaixo:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-frontend-deploy
spec:
  selector:
    matchLabels:
      name: myapp
      tier: frontend
  template:
    metadata:
      labels:
        name: myapp
        tier: frontend
    spec:
      containers:
      - name: nginx
        image: nginx
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```

* No terminal, execute o comando `apply`.

```bash
kubectl apply -f frontend-deploy.yml
```

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-backend-deploy
spec:
  selector:
    matchLabels:
      name: myapp
      tier: backend
  template:
    metadata:
      labels:
        name: myapp
        tier: backend
    spec:
      containers:
      - name: nginx
        image: nginx
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```

* No terminal, execute o comando `apply`.

```bash
kubectl apply -f backend-deploy.yml
```

* Ainda no terminal, execute o comando `docker ps`, para identificar os containers criados.

```bash
docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED              STATUS              PORTS     NAMES
73ef7e162cd0   d2eb56950b84   "/docker-entrypoint.…"   About a minute ago   Up About a minute             k8s_nginx_myapp-backend-deploy-58b6b87796-smsns_default_9f3e8bd3-1672-4a36-9f95-700130eba15f_0
038e0f0da684   d2eb56950b84   "/docker-entrypoint.…"   About a minute ago   Up About a minute             k8s_nginx_myapp-frontend-deploy-654dcc8fc4-vq2b8_default_db37590d-a2ee-43a2-a6e2-c1775eaea3be_0
```

* Abra dois terminais separados e em cada um deles use o comando `exec`, para acessar o _bash shell_.
* Do container do _frontend_, execute um comando `curl` para o container do `backend`, usando seu endereço de ip

```bash
docker exec -it 73ef sh   
# hostname -i
# 10.1.1.63
```

```bash
docker exec -it 038e sh   
# curl 10.1.1.63
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

* Os dois containers podem acessar um ao outro, pois pertencem à mesma rede, mas ainda não podem ser acessados de fora do cluster.
* Por isso, estamos acessando um deles e executando um comando do tipo `curl` para o outro.
* O que acontece se criarmos uma réplica do _backend_ ? Como a aplicação _frontend_ sabe para qual endereço ela deve enviar suas requisições?
* Para resolver esse problema, vamos criar um serviço do tipo __Cluster IP__. 
* Crie o arquivo `cluster-ip.yml`, conforme o exemplo abaixo.

```yml
apiVersion: v1
kind: Service
metadata:
  name: myapp-cluster-ip
spec:
  type: ClusterIP
  selector:
    name: myapp
    tier: backend
  ports:
  - port: 80
    targetPort: 80
```

* No terminal, execute o comando `apply`; e em seguida, `get svc`.

```bash
kubectl apply -f cluster-ip.yml

kubectl get svc
NAME                       TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
service/kubernetes         ClusterIP   10.96.0.1        <none>        443/TCP          26m
service/myapp-cluster-ip   ClusterIP   10.111.245.202   <none>        80/TCP           4s
```

* Em tempo, use o comando `scale`, para criar réplicas do _backend_.

```bash
kubectl scale deploy myapp-backend-deploy --replicas=5
deployment.apps/myapp-backend-deploy scaled   
```

* Acesse novamente o terminal do container do _frontend_, por meio do comando `exec`.

```bash
docker exec -it 038e sh
```

* Dentro do terminal do container do _frontend_, execute o comando `curl` para o IP do _Cluster IP_ criado.

```bash
# curl 10.98.66.236
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

* Como o K8S provê um serviço DNS para sua rede privada interna, não é necessário associar o _frontend_ ao _backend_ usando o IP do _ClusterIP_ de forma _hard coded_.
* Ao invés disso, podemos usar o nome do _ClusterIP_. Repita o comando `curl`, usando o nome do _ClusterIP_.

```bash
# curl myapp-cluster-ip
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

## NodePort

* Até aqui, em todos os nossos exercícios, não foi possível acessar o container dentro dos pods criados.
* Um NodePort associa uma porta livre do _host_ a um endereço de rede do K8S, ao qual um pod foi associado pelo K8S.
* Para criar um NodePort, execute o comando `expose`.
* _targetPort_ é a porta do container; _port_ é a porta do pod dentro do _cluster; e _nodePort_ é a porta do _host_.

```bash
kubectl expose deploy myapp-frontend-deploy --port=8080 --target-port=80 --type=NodePort
service/nginx-deployment exposed
```

* Para obter os serviços criados, execute o comando `get all` ou `get svc`.

```bash
kubectl get svc
NAME                    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes              ClusterIP   10.96.0.1       <none>        443/TCP          22m
myapp-cluster-ip        ClusterIP   10.98.66.236    <none>        80/TCP           12m
myapp-frontend-deploy   NodePort    10.101.143.55   <none>        8080:30459/TCP   3s
```

* No exemplo acima, criamos um serviço que abstrai o acesso a qualquer um dos nós do _deploy_, associando a porta 80 do servidor __nginx__ dentro do container (_target-port_) à porta 8080 do nó do cluster (_port_).
* Como não definimos nenhum valor para _targetPort_, o K8S atribui-lhe aleatóriamente a porta 31403.
* Em seu navegador web, acesse o endereço `localhost:30459`.

### Prática

* Neste exercício, vamos usar um único arquivo para criar dois objetos: um _pod_ e um _NodePort_ .
* Antes de mais nada, remova todos os objetos do K8S

```bash
kubectl delete all --all
```

* Crie o arquivo `service.yml`, conforme o exemplo abaixo.

```yml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: NodePort
  selector:
    name: myapp
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30004
---
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    name: myapp
spec:
  containers:
  - name: nginx
    image: nginx
```

* No terminal, execute o comando `create`.

```bash
kubectl create -f service.yml
```

* Para verificar se o serviço está funcionando corretamente, execute o comando `get svc`

```bash
kubectl get svc
NAME            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
kubernetes      ClusterIP   10.96.0.1        <none>        443/TCP        2s
nginx-service   NodePort    10.104.164.247   <none>        80:30004/TCP   5s
```

* Em seu navegador web, acesse o endereço `localhost:30004`.

## Load balancer

* Para permitir que um serviço esteja acessível na rede externa, criamos um serviço do tipo NodePort. Contudo, se nossos pods estiverem distribuídos entre nós diferentes em um cluster, cada nó exigirá um NodePort. 
* LoadBalancer é uma interface que centraliza e distribui as requisiçoes entre NodePorts, assim como o IpCluster distrubui as requisições entre diferentes réplicas dentro de um mesmo nó do cluster.
* Crie o arquivo `load-balancer.yml`.

```yml
apiVersion: v1
kind: Service
metadata:
  name: myapp-load-balancer
spec:
  type: LoadBalancer
  selector:
    name: myapp
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30008
---
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    name: myapp
spec:
  containers:
  - name: nginx
    image: nginx
```

* No terminal do _host_, execute o comando `delete svc`, para remover o serviço _Node Port_ criado no exercício anterior.
* Em seguida, execute o comando `apply`, assim como o comando `get svc`

```bash
kubectl delele svc nginx-service

kubectl apply -f load-balancer.yml
kubectl get svc
NAME                  TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
kubernetes            ClusterIP      10.96.0.1        <none>        443/TCP        6m45s
myapp-load-balancer   LoadBalancer   10.108.171.196   localhost     80:30008/TCP   3m24s
```

* Em seu navegador web, acesse o endereço `localhost30008`.

* Como estamos com um único nó em nosso cluster (uma única instalação do K8s), ao criar o serviço acima, ele se comportará como um NodePort. 
* Contudo, a implantação desse serviço em um provedor de computação em nuvem, terá o efeito de um balanceador de carga, uma vez que esses provedores costumam distribuir as réplicas de serviços entre nós diferentes.



