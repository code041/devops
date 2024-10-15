# Deployment

* Substituir as réplicas por novas versões da aplicação
* Reverter as alterações em caso de erro
* Parar o ambiente, executar uma alteraççao e retomar a execução
* UM pod é um objeto k8s que encapsula um container
* Uma replica é um conjunot de pods
* Um deployment é um objeto que encapsula uma replica e oferece as condições acima
* Ao criar um deployment, um replicaset é automaticamente criado

## Deploy de uma imagem padrão

1. Crie um _deployment_ com a imagem `nginx`.
1. Obtenha os _deployments_, _replication controllers_, _replica sets_ e _pods_  .

```bash
kubectl create deploy nginx-deploy --image=nginx
deployment.apps/nginx-deploy created

kubectl get deployments
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deploy   1/1     1            1           32s

kubectl get replicationcontroller
No resources found in default namespace.

kubectl get replicasets
NAME                     DESIRED   CURRENT   READY   AGE
nginx-deploy-d845cc945   1         1         1       2m25s

kubectl get pods
NAME                           READY   STATUS    RESTARTS   AGE
nginx-deploy-d845cc945-ktrj7   1/1     Running   0          6s
```

> Para obter todos os objetos do K8S, utilize o comando `get all`.

```bash
kubectl get all
NAME                               READY   STATUS    RESTARTS   AGE
pod/nginx-deploy-d845cc945-ktrj7   1/1     Running   0          2m48s

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   2d5h

NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-deploy   1/1     1            1           2m48s

NAME                                     DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-deploy-d845cc945   1         1         1       2m48s
```

## Deploy de uma imagem customizada

1. Crie um arquivo descritivo para o _deployment_, conforme o exemplo abaixo.
1. Em seguida, use o comando `create`, para criar um novo _deploy_.
1. Por fim, use o comando `describe`, para obter informações sobre o objeto criado.

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  labels:
    tier: frontend
    app: nginx
spec:
  selector:
    matchLabels:
      app: myapp-deployment
  template:
    metadata:
      labels:
        app: myapp-deployment
    spec:
      containers:
      - name: nginx
        image: nginx
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"

```

```bash
kubectl create -f deploy.yml
kubectl get pods
kubectl describe deploy myapp-deployment
```

```console
Name:                   myapp-deployment
Namespace:              default
CreationTimestamp:      Thu, 10 Oct 2024 10:27:35 -0300
Labels:                 app=nginx
                        tier=frontend
Annotations:            deployment.kubernetes.io/revision: 1
Selector:               app=myapp-deployment
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=myapp-deployment
  Containers:
   nginx:
    Image:      nginx
    Port:       <none>
    Host Port:  <none>
    Limits:
      cpu:        500m
      memory:     128Mi
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  <none>
NewReplicaSet:   myapp-deployment-568b4d69b4 (1/1 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  97s   deployment-controller  Scaled up replica set myapp-deployment-568b4d69b4 to 1
```

## _Scale up_ 

* Para escalar um deployment que já está em execução

```bash
kubectl scale deployment nginx-deploymnet --replicas=5
kubectl get pods

NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-6d6565499c-5zp45   1/1     Running   0          6m33s
nginx-deployment-6d6565499c-7fctc   1/1     Running   0          16s
nginx-deployment-6d6565499c-qd7f5   1/1     Running   0          16s
nginx-deployment-6d6565499c-wkb57   1/1     Running   0          16s
nginx-deployment-6d6565499c-zm4cd   1/1     Running   0          16s
```

* Da mesma forma que foi feito em um exercício anterior, identifique os containers, remova um deles e verifique o comportamento do nó.

```Bash
docker ps      
CONTAINER ID   IMAGE          COMMAND                  CREATED              STATUS              PORTS     NAMES
1c58698b2db7   d2eb56950b84   "/docker-entrypoint.…"   About a minute ago   Up About a minute             k8s_nginx_nginx-deployment-6d6565499c-7fctc_default_318e4d39-5516-4c09-9a36-13f8c2dcefc2_0
8c3702ffee41   d2eb56950b84   "/docker-entrypoint.…"   About a minute ago   Up About a minute             k8s_nginx_nginx-deployment-6d6565499c-qd7f5_default_588935d3-66d1-4e38-ad40-4f7740b63a78_0
8cde8c8b01ec   d2eb56950b84   "/docker-entrypoint.…"   About a minute ago   Up About a minute             k8s_nginx_nginx-deployment-6d6565499c-wkb57_default_c1eceaab-da13-48c4-b9ef-61f7a72eb048_0
65ee16a5865d   d2eb56950b84   "/docker-entrypoint.…"   About a minute ago   Up About a minute             k8s_nginx_nginx-deployment-6d6565499c-zm4cd_default_f18a5e53-599d-4e81-9319-f9e85370ecac_0
1840d8c8af68   d2eb56950b84   "/docker-entrypoint.…"   7 minutes ago        Up 7 minutes                  k8s_nginx_nginx-deployment-6d6565499c-5zp45_default_66baf27c-532b-45c7-a6e2-28fa878c54f6_0
```

```bash
docker kill 1c58
1c58
```

```bash
kubectl get pods
NAME                                READY   STATUS    RESTARTS     AGE
nginx-deployment-6d6565499c-5zp45   1/1     Running   0            7m36s
nginx-deployment-6d6565499c-7fctc   1/1     Running   1 (7s ago)   79s
nginx-deployment-6d6565499c-qd7f5   1/1     Running   0            79s
nginx-deployment-6d6565499c-wkb57   1/1     Running   0            79s
nginx-deployment-6d6565499c-zm4cd   1/1     Running   0            79s
```

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




