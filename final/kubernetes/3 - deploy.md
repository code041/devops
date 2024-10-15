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

* Ao criar um _deployment_, o K8S automaticamente encapsula tanto um _replica set_, quanto um Pod.

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
  name: myapp-deploy
spec:
  selector:
    matchLabels:
      name: myapp
  template:
    metadata:
      labels:
        name: myapp
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
kubectl describe deploy myapp-deploy
```

```console
Name:                   myapp-deploy
Namespace:              default
CreationTimestamp:      Tue, 15 Oct 2024 15:04:08 -0300
Labels:                 <none>
Annotations:            deployment.kubernetes.io/revision: 1
Selector:               name=myapp
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  name=myapp
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
NewReplicaSet:   myapp-deploy-99c54f6fb (1/1 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  41s   deployment-controller  Scaled up replica set myapp-deploy-99c54f6fb to 1
```

## _Scale up_ 

* Para escalar um deployment que já está em execução, também é possível utilizar o comando `scale`

```bash
kubectl scale deployment myapp-deploy --replicas=5    
kubectl get pods

NAME                               READY   STATUS              RESTARTS   AGE 
pod/myapp-deploy-99c54f6fb-cm6jc   0/1     ContainerCreating   0          4s  
pod/myapp-deploy-99c54f6fb-fhm5c   1/1     Running             0          4s  
pod/myapp-deploy-99c54f6fb-j78wg   0/1     ContainerCreating   0          4s  
pod/myapp-deploy-99c54f6fb-w58ds   1/1     Running             0          119s
pod/myapp-deploy-99c54f6fb-x4bdq   0/1     ContainerCreating   0          4s  
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

* Por fim, remova todos os objetos K8S, antes de seguir adiante.

```bash
kubectl delete all --all
```

# Update

* Quando um deployment é criado, k8s cria uma primeira revisão e aplica um _rollout_.
* Quando a aplicação é atualizada, k8s também cria uma nova revisão, mas é necessário executar o _rollout_ em outra etapa.
* Utilize o comando `history` para obter o histórico de revisões de um _deploy_.

```bash
kubectl apply -f deploy.yml

kubectl rollout history deployment/myapp-deployment
deployment.apps/myapp-deployment 
REVISION  CHANGE-CAUSE
1         <none>
```

> Você também pode usar o comando `kubectl rollout history deploy myapp-deploy` 

## Estratégias de implantação

* Existem duas estratégias de _deploy_: substituir uma instância por vez; ou substituir um conjunto de instâncias por vez.

* No arquivo `deploy.yml`, altere o a versão da imagem do servidor __nginx__.

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deploy
spec:
  selector:
    matchLabels:
      name: myapp
  template:
    metadata:
      labels:
        name: myapp
    spec:
      containers:
      - name: nginx
        image: nginx:1.27.2 ##ALTERE A VERSÃO AQUI
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"

```

* Em seguida, no terminal do _host_, execute o comando `apply`.

```bash
kubectl apply -f deploy.yml
deployment.apps/myapp-deployment configured
```

* Por fim, execute o comando `status`.

```bash
kubectl rollout status deployment.apps/myapp-deployment 
deployment "myapp-deploy" successfully rolled out
```

* Para verificar se uma nova revisão foi criada adequadamente, execute o comando `history`

```bash
kubectl rollout history deployment/myapp-deployment         
deployment.apps/myapp-deployment 
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

* Para verificar como a atualização de versão foi executada, use o comando `describe`.

```bash
kubectl describe deployment myapp-deployment        

Name:                   myapp-deploy
Namespace:              default
CreationTimestamp:      Tue, 15 Oct 2024 15:18:15 -0300
Labels:                 <none>
Annotations:            deployment.kubernetes.io/revision: 3
Selector:               name=myapp
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  name=myapp
  Containers:
   nginx:
    Image:      nginx:1.27.2
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
OldReplicaSets:  myapp-deploy-58c9dd6fbb (0/0 replicas created), myapp-deploy-78b864956b (0/0 replicas created)
NewReplicaSet:   myapp-deploy-55569b67cd (1/1 replicas created)
Events:
  Type    Reason             Age    From                   Message
  ----    ------             ----   ----                   -------
  Normal  ScalingReplicaSet  2m59s  deployment-controller  Scaled up replica set myapp-deploy-58c9dd6fbb to 1
  Normal  ScalingReplicaSet  2m45s  deployment-controller  Scaled up replica set myapp-deploy-78b864956b to 1
  Normal  ScalingReplicaSet  2m43s  deployment-controller  Scaled down replica set myapp-deploy-58c9dd6fbb to 0 from 1
  Normal  ScalingReplicaSet  114s   deployment-controller  Scaled up replica set myapp-deploy-55569b67cd to 1
  Normal  ScalingReplicaSet  111s   deployment-controller  Scaled down replica set myapp-deploy-78b864956b to 0 from 1
```

* Repita o procedimento, alterando a versão do servidor __nginx__, mas antes aumente a quantidade de réplicas.

```bash
containers/k8s> kubectl scale --replicas=6 -f deploy.yml
deployment.apps/myapp-deployment scaled
```

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deploy
spec:
  selector:
    matchLabels:
      name: myapp
  template:
    metadata:
      labels:
        name: myapp
    spec:
      containers:
      - name: nginx
        image: nginx:1.27.9 ##ALTERE AQUI
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"

```

```bash
kubectl apply -f deploy.yml
deployment.apps/myapp-deployment configured
kubectl rollout status deployment.apps/myapp-deployment
Waiting for deployment "myapp-deploy" rollout to finish: 3 out of 6 new replicas have been updated...

kubectl describe deployment myapp-deployment

```

```console
Bill\git\devops\final\kubernetes>kubectl describe deploy myapp-deploy      
Name:                   myapp-deploy
Namespace:              default
CreationTimestamp:      Tue, 15 Oct 2024 15:18:15 -0300
Labels:                 <none>
Annotations:            deployment.kubernetes.io/revision: 4
Selector:               name=myapp
Replicas:               6 desired | 3 updated | 8 total | 5 available | 3 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  name=myapp
  Containers:
   nginx:
    Image:      nginx:1.27.9
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
  Progressing    True    ReplicaSetUpdated
OldReplicaSets:  myapp-deploy-58c9dd6fbb (0/0 replicas created), myapp-deploy-78b864956b (0/0 replicas created), myapp-deploy-55569b67cd (5/5 replicas created)
NewReplicaSet:   myapp-deploy-5668574dd9 (3/3 replicas created)
Events:
  Type    Reason             Age    From                   Message
  ----    ------             ----   ----                   -------
  Normal  ScalingReplicaSet  5m50s  deployment-controller  Scaled up replica set myapp-deploy-58c9dd6fbb to 1
  Normal  ScalingReplicaSet  5m36s  deployment-controller  Scaled up replica set myapp-deploy-78b864956b to 1
  Normal  ScalingReplicaSet  5m50s  deployment-controller  Scaled up replica set myapp-deploy-58c9dd6fbb to 1
  Normal  ScalingReplicaSet  5m36s  deployment-controller  Scaled up replica set myapp-deploy-78b864956b to 1
  Normal  ScalingReplicaSet  5m34s  deployment-controller  Scaled down replica set myapp-deploy-58c9dd6fbb to 0 from 1
  Normal  ScalingReplicaSet  4m45s  deployment-controller  Scaled up replica set myapp-deploy-55569b67cd to 1
  Normal  ScalingReplicaSet  4m42s  deployment-controller  Scaled down replica set myapp-deploy-78b864956b to 0 from 1
  Normal  ScalingReplicaSet  82s    deployment-controller  Scaled up replica set myapp-deploy-55569b67cd to 6 from 1
  Normal  ScalingReplicaSet  52s    deployment-controller  Scaled up replica set myapp-deploy-5668574dd9 to 2
  Normal  ScalingReplicaSet  52s    deployment-controller  Scaled down replica set myapp-deploy-55569b67cd to 5 from 6
  Normal  ScalingReplicaSet  52s    deployment-controller  Scaled up replica set myapp-deploy-5668574dd9 to 3 from 2
```

* Como essa imagem não existe, e a estratégia de _deploy_ é o __Rolling Update__, o K8S aplicou a atualização em apenas metade dos Pods.
* Se a estratégia fosse o __Recreate__, todos os pods seriam terminados e recriados ao mesmo tempo. 

## _Rollout undo_

* Para reverter o erro causado no último exercício, podemos usar o comando `rollout undo`.

```bash
\containers\k8s>kubectl rollout undo -f deploy.yml   
deployment.apps/myapp-deployment rolled back

kubectl describe deploy myapp-deploy
Name:                   myapp-deploy
Namespace:              default
CreationTimestamp:      Tue, 15 Oct 2024 15:18:15 -0300     
Labels:                 <none>
Annotations:            deployment.kubernetes.io/revision: 5
Selector:               name=myapp
Replicas:               6 desired | 6 updated | 6 total | 6 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  name=myapp
  Containers:
   nginx:
    Image:      nginx:1.27.2
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
OldReplicaSets:  myapp-deploy-58c9dd6fbb (0/0 replicas created), myapp-deploy-78b864956b (0/0 replicas created), myapp-deploy-5668574dd9 (0/0 replicas created)
NewReplicaSet:   myapp-deploy-55569b67cd (6/6 replicas created)
Events:
  Type    Reason             Age                From                   Message
  ----    ------             ----               ----                   -------
  Normal  ScalingReplicaSet  8m54s              deployment-controller  Scaled up replica set myapp-deploy-58c9dd6fbb to 1
  Normal  ScalingReplicaSet  8m40s              deployment-controller  Scaled up replica set myapp-deploy-78b864956b to 1
  Normal  ScalingReplicaSet  8m38s              deployment-controller  Scaled down replica set myapp-deploy-58c9dd6fbb to 0 from 1
  Normal  ScalingReplicaSet  7m49s              deployment-controller  Scaled up replica set myapp-deploy-55569b67cd to 1
  Normal  ScalingReplicaSet  7m46s              deployment-controller  Scaled down replica set myapp-deploy-78b864956b to 0 from 1
  Normal  ScalingReplicaSet  4m26s              deployment-controller  Scaled up replica set myapp-deploy-55569b67cd to 6 from 1
  Normal  ScalingReplicaSet  3m56s              deployment-controller  Scaled up replica set myapp-deploy-5668574dd9 to 2
  Normal  ScalingReplicaSet  3m56s              deployment-controller  Scaled down replica set myapp-deploy-55569b67cd to 5 from 6
  Normal  ScalingReplicaSet  3m56s              deployment-controller  Scaled up replica set myapp-deploy-5668574dd9 to 3 from 2
  Normal  ScalingReplicaSet  10s (x2 over 10s)  deployment-controller  (combined from similar events): Scaled up replica set myapp-deploy-55569b67cd to 6 from 5
```

## __Rolling update__ 

* Para configurar a quantidade de pods que podem ser criados adicionalmente, para substituir os antigos e em quantos o _update_ pode ser efetuado -possivelmente causando indisponibilidade- devemos usar os parâmetros `maxSurge` e `maxUnavailable` , respectivamente.
* Altere o arquivo `deploy.yml`, conforme o exemplo abaixo:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deploy
spec:
  strategy: #ADD
    type: RollingUpdate #ADD
    rollingUpdate: #ADD
      maxUnavailable: 1 #ADD
      maxSurge: 1 #ADD
  selector:
    matchLabels:
      name: myapp
  template:
    metadata:
      labels:
        name: myapp
    spec:
      containers:
      - name: nginx
        image: nginx:1.9 #REVERTA PARA UM VERSÃO INEXISTENTE
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```

* Em seguida, execute o comando `apply`.

```bash
kubectl apply -f deploy.yml
deployment.apps/myapp-deploy configured

kubectl rollout status deploy myapp-deploy
Waiting for deployment "myapp-deploy" rollout to finish: 2 out of 6 new replicas have been updated...

Name:                   myapp-deploy
Namespace:              default
CreationTimestamp:      Tue, 15 Oct 2024 15:18:15 -0300
Labels:                 <none>
Annotations:            deployment.kubernetes.io/revision: 6
Selector:               name=myapp
Replicas:               6 desired | 2 updated | 7 total | 5 available | 2 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  1 max unavailable, 1 max surge
Pod Template:
  Labels:  name=myapp
  Containers:
   nginx:
    Image:      nginx:1.9
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
  Progressing    True    ReplicaSetUpdated
OldReplicaSets:  myapp-deploy-58c9dd6fbb (0/0 replicas created), myapp-deploy-78b864956b (0/0 replicas created), myapp-deploy-55569b67cd (5/5 replicas created), myapp-deploy-5668574dd9 (0/0 replicas created)
NewReplicaSet:   myapp-deploy-6d5fc6c5fd (2/2 replicas created)
Events:
  Type    Reason             Age                  From                   Message
  ----    ------             ----                 ----                   -------
  Normal  ScalingReplicaSet  17m                  deployment-controller  Scaled up replica set myapp-deploy-58c9dd6fbb to 1
  Normal  ScalingReplicaSet  17m                  deployment-controller  Scaled up replica set myapp-deploy-78b864956b to 1
  Normal  ScalingReplicaSet  17m                  deployment-controller  Scaled down replica set myapp-deploy-58c9dd6fbb to 0 from 1
  Normal  ScalingReplicaSet  16m                  deployment-controller  Scaled up replica set myapp-deploy-55569b67cd to 1
  Normal  ScalingReplicaSet  16m                  deployment-controller  Scaled down replica set myapp-deploy-78b864956b to 0 from 1
  Normal  ScalingReplicaSet  13m                  deployment-controller  Scaled up replica set myapp-deploy-55569b67cd to 6 from 1
  Normal  ScalingReplicaSet  12m                  deployment-controller  Scaled up replica set myapp-deploy-5668574dd9 to 2
  Normal  ScalingReplicaSet  12m                  deployment-controller  Scaled up replica set myapp-deploy-5668574dd9 to 3 from 2
  Normal  ScalingReplicaSet  11s (x2 over 12m)    deployment-controller  Scaled down replica set myapp-deploy-55569b67cd to 5 from 6
  Normal  ScalingReplicaSet  11s (x4 over 8m45s)  deployment-controller  (combined from similar events): Scaled up replica set myapp-deploy-6d5fc6c5fd to 2 from 1

myapp-deploy-55569b67cd-2lncm   1/1     Running            0          15m
myapp-deploy-55569b67cd-7ggx4   1/1     Running            0          19m
myapp-deploy-55569b67cd-f5ghw   1/1     Running            0          15m
myapp-deploy-55569b67cd-lctms   1/1     Running            0          15m
myapp-deploy-55569b67cd-pr4mf   1/1     Running            0          15m
myapp-deploy-6d5fc6c5fd-gb8pc   0/1     ErrImagePull       0          3m7s
myapp-deploy-6d5fc6c5fd-hqdqt   0/1     ImagePullBackOff   0          3m7s
```

* Desta vez, um único Pod teve sua versão atualizada; um pod foi criado adicionalmente; contudo, os demais permaneceram em execução, com a versão antiga.

* Agora, reverta as alterações com o `rollout undo`

```bash
kubectl rollout undo deploy myapp-deploy 
deployment.apps/myapp-deploy rolled back
```

## _Recreate_

* Vamos testar uma outra estratégia de implantação. Para isso, no arquivo `deploy.yml`, substitua a estratégia antiga pela nova, conforme  o exemplo abaixo:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deploy
spec:
  spec:
  strategy:   ## SUBSTITUA AQUI
    type: Recreate # SUBSTITUA AQUI
  selector:
    matchLabels:
      name: myapp
  template:
    metadata:
      labels:
        name: myapp
    spec:
      containers:
      - name: nginx
        image: nginx:1.9
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"

```

* Em seguida, execute os comandos `apply` e `get pods`.

```bash
kubectl apply -f deploy.yml

kubectl get pods
NAME                            READY   STATUS         RESTARTS   AGE
myapp-deploy-6d5fc6c5fd-2pcql   0/1     ErrImagePull   0          9s
myapp-deploy-6d5fc6c5fd-cf575   0/1     ErrImagePull   0          9s
myapp-deploy-6d5fc6c5fd-chpzn   0/1     ErrImagePull   0          9s
myapp-deploy-6d5fc6c5fd-jrz84   0/1     ErrImagePull   0          9s
myapp-deploy-6d5fc6c5fd-vhb94   0/1     ErrImagePull   0          9s
myapp-deploy-6d5fc6c5fd-w9bsg   0/1     ErrImagePull   0          9s
```

* Ainda que a implantação tenha falhado em todos os pods, o uso de um _deploy_ nos permite reverter as alterações sem maiores problemas.

```bash
kubectl rollout undo deploy myapp-deploy
deployment.apps/myapp-deploy rolled back

kubectl get pods
NAME                            READY   STATUS    RESTARTS   AGE
myapp-deploy-55569b67cd-cbw52   1/1     Running   0          3s
myapp-deploy-55569b67cd-hpfc9   1/1     Running   0          3s
myapp-deploy-55569b67cd-ks5dt   1/1     Running   0          3s
myapp-deploy-55569b67cd-mcqcx   1/1     Running   0          3s
myapp-deploy-55569b67cd-qxm89   1/1     Running   0          3s
myapp-deploy-55569b67cd-wg4gg   1/1     Running   0          3s
```