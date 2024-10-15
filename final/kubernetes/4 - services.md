# Redes

* O nó do kubernetes possui um endereço de rede. Se você não estiver usando linux, a máquina virtual terá um IP, e o nó do K8s terá outro. 
* Quando o K8s é iniciado, ele cria uma rede privada interna. Conforme os pods são criados, ele associa um endereço IP dentro dessa rede.

* Dois pods, rodando em nós diferentes de um cluster, usando a mesma imagem, com o mesmo container, podem ter o mesmo endereço IP associado.


## NodePort

* Crie o arquivo `service.yml`

```yml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: NodePort
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30004
```

* No terminal, execute o comando `create`.

```bash
kubectl create -f service.yml
```

* Para verificar se o serviço está funcionando corretamente, execute o comando `get svc`

```bash
kubectl get svc
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP        2m58s
myapp-service   NodePort    10.100.32.174   <none>        80:30004/TCP   87s
```

## Cluster IP

* Um sistema possui serviços em diferentes camadas, como o _frontend_, _backend_ e o banco de dados. Ao criar réplicas, cada uma delas ganha um endereço de IP diferente. Além disso, sempre que uma réplica falha, o K8s cria uma nova instância e atribui a ela um endereço de IP aleatório. Isso exige que a comunicação entre esses serviços não seja feita pelo IP, mas por uma interface, que permita acessar os diferentes pods, sem a necessidade de conhecer o endereço de rede de cada um deles. O nome dessa interface é o ClusterIP. 

![alt text](image-1.png)

```yml
apiVersion: v1
kind: Service
metadata:
  name: myapp-cluster-ip
spec:
  type: ClusterIP
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 80
```

## Load balancer

* Para permitir que um serviço esteja acessível na rede externa, criamos um serviço do tipo NodePort. Contudo, se nossos pods estiverem distribuídos entre nós diferentes em um cluster, cada nó exigirá um NodePort. Sem falar que, diferentes serviços do tipo _edge_ também vão exigir diferentes NodePorts, ainda que estejam executando no mesmo nó.
* LoadBalancer é uma interface que centraliza e distribui as requisiçoes entre NodePorts, assim como o IpCluster distrubui as requisições entre diferentes réplicas dentro de um mesmo nó do cluster.

```yml
apiVersion: v1
kind: Service
metadata:
  name: myapp-load-balancer
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30008
```

* Como estamos como um único nó em nosso cluster (uma única instalação do K8s), ao criar o serviço acima, ele se comportará como um NodePort. Contudo, a implantação desse serviço em um provedor de computação em nuvem, terá o efeito de um balanceamento de carga, uma vez que esses provedores costumam distribuir as réplicas de serviços entre nós diferentes.



============services


* Execute o comando `kubectl get pods` e verifique o endereço IP associado a cada Pod

```bash
kubectl get pods -o wide
NAME                                READY   STATUS    RESTARTS      AGE     IP          NODE             NOMINATED NODE   READINESS GATES
nginx-deployment-6d6565499c-5zp45   1/1     Running   0             9m3s    10.1.0.54   docker-desktop   <none> 
          <none>
nginx-deployment-6d6565499c-7fctc   1/1     Running   1 (94s ago)   2m46s   10.1.0.57   docker-desktop   <none> 
          <none>
nginx-deployment-6d6565499c-qd7f5   1/1     Running   0             2m46s   10.1.0.56   docker-desktop   <none> 
          <none>
nginx-deployment-6d6565499c-wkb57   1/1     Running   0             2m46s   10.1.0.58   docker-desktop   <none> 
          <none>
nginx-deployment-6d6565499c-zm4cd   1/1     Running   0             2m46s   10.1.0.55   docker-desktop   <none> 
          <none>
```

* Cada Pod executa uma réplica de nossa aplicação, contudo o protocolo DNS não será capaz de mapear um endereço aos múltiplos endereços IP que foram criados para cada uma dessas réplicas. Portanto, será necessário criar uma abstração capaz de distribuir as requisições entre tais réplicas.

## Updates




# Services

```bash
kubectl expose deployment nginx-deployment --port=8080 --target-port=80
service/nginx-deployment exposed
```

```bash
kubectl get services
NAME               TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
kubernetes         ClusterIP   10.96.0.1     <none>        443/TCP    23d
nginx-deployment   ClusterIP   10.96.30.72   <none>        8080/TCP   37s
```

* Ainda não é possível acessar os containers a partir do _host_, mas é possível acessá-los a partir de um dos Pods

```bash
docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS     NAMES
cac4977cc308   d2eb56950b84   "/docker-entrypoint.…"   11 minutes ago   Up 11 minutes             k8s_nginx_nginx-deployment-6d6565499c-7fctc_default_318e4d39-5516-4c09-9a36-13f8c2dcefc2_1
8c3702ffee41   d2eb56950b84   "/docker-entrypoint.…"   12 minutes ago   Up 12 minutes             k8s_nginx_nginx-deployment-6d6565499c-qd7f5_default_588935d3-66d1-4e38-ad40-4f7740b63a78_0
8cde8c8b01ec   d2eb56950b84   "/docker-entrypoint.…"   12 minutes ago   Up 12 minutes             k8s_nginx_nginx-deployment-6d6565499c-wkb57_default_c1eceaab-da13-48c4-b9ef-61f7a72eb048_0
65ee16a5865d   d2eb56950b84   "/docker-entrypoint.…"   12 minutes ago   Up 12 minutes             k8s_nginx_nginx-deployment-6d6565499c-zm4cd_default_f18a5e53-599d-4e81-9319-f9e85370ecac_0
1840d8c8af68   d2eb56950b84   "/docker-entrypoint.…"   18 minutes ago   Up 18 minutes             k8s_nginx_nginx-deployment-6d6565499c-5zp45_default_66baf27c-532b-45c7-a6e2-28fa878c54f6_0

docker exec -it cac49 sh

# curl 10.96.30.72:8080
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

* Perceba que o comando `curl` foi executado de modo que uma requisição foi feita ao ClusterIP `10.96.30.72:8080`. Dessa forma, um dos nós foi o responsável por responder a essa requisição, sem a necessidade de determinar qual.

## Removendo um deploymnet

```bash
kubectl delete deploy nginx-deployment
```

```bash
kubectl get svc
NAME               TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
kubernetes         ClusterIP   10.96.0.1     <none>        443/TCP    23d
nginx-deployment   ClusterIP   10.96.30.72   <none>        8080/TCP   9m26s
```

```bash
kubectl delete svc nginx-deployment
service "nginx-deployment" deleted
```

## Criando um _deplyment_ com base na imagem __frontend__

```bash
kubectl create deployment k8s-frontend --image=frontend:0.6
kubectl expose deployment k8s-frontend --type=NodePort --port=4200
```

```bash
kubectl get svc
NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
k8s-frontend   ClusterIP   10.100.130.52   <none>        4200/TCP   5s
kubernetes     ClusterIP   10.96.0.1       <none>        443/TCP    23d
```

```bash
kubectl scale deployment k8s-frontend --replicas=4
```

## _load balancer_

| **Aspecto**              | **NodePort**                               | **LoadBalancer**                          |
|--------------------------|--------------------------------------------|-------------------------------------------|
| **Exposição**             | Porta fixa em cada nó                      | IP público provisionado pelo balanceador  |
| **Acesso**               | Via IP do nó e porta alta (30000-32767)     | Via IP público (EXTERNAL-IP)              |
| **Balanceamento de Carga**| Não é automático entre nós                 | Balanceamento automático                  |
| **Cenário Ideal**         | Clusters locais ou sem suporte a nuvem     | Ambientes de nuvem (AWS, GCP, Azure)      |
| **Complexidade**          | Simples, mas com menos recursos            | Mais completo e com recursos avançados    |
| **Custos**                | Sem custo adicional                        | Pode ter custos adicionais (nuvem)        |


```bash
kubectl expose deployment k8s-frontend --type=LoadBalancer --port=4200
```

`http://localhost:4200`

## Updates

```bash
docker build -t frontend:2.0 .
```

```bash
kubectl set image deployment k8s-frontend frontend=frontend:2.0
kubectl rollout status deploy k8s-frontend
```

* Experimente remover um dos pods 

```bash
kubectl delete pod {ID DO POD}
```



## Múltiplos _deploys_ 

* Copie o conteúdo do arquivo `service.yml` e cole em um novo arquivo.
* Em seguida, inclua uma declaração de separação `---`.
* Por fim, copie o conteúdo do arquivo `deploy.yml` para esse novo arquivo.

```yml
apiVersion: v1
kind: Service
metadata:
  name: ngnix
spec:
  selector:
    app: nginx
  ports:
  - port: 80
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 5
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 4200
```

```bash
kubectl apply -f nginx.yml
```