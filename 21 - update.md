# Update

* Quando um deployment é criado, k8s cria um rollout e uma revisão
* Quando a aplicação é atualizada, k82 cria uma nova revisão
* Para obter o status de um rollout, utilize o comando `history`

```bash
kubectl rollout history deployment/myapp-deployment
deployment.apps/myapp-deployment 
REVISION  CHANGE-CAUSE
1         <none>
```

## Estratégias de implantação

* Existem duas estratégias de _deploy_: substituir uma instância por vez; ou substituir um conjunto de instâncias por vez.

* No arquivo `deploy.yml`, altere o a versão da imagem do servidor __nginx__.

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
        image: nginx:1.7.1 #<<<<<<ALTERE AQUI>>>>>>
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

Name:                   myapp-deployment
Namespace:              default
CreationTimestamp:      Thu, 10 Oct 2024 10:27:35 -0300
Labels:                 app=nginx
                        tier=frontend
Annotations:            deployment.kubernetes.io/revision: 2
Selector:               app=myapp-deployment
Replicas:               1 desired | 1 updated | 2 total | 1 available | 1 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=myapp-deployment
  Containers:
   nginx:
    Image:      nginx:1.7.1
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
OldReplicaSets:  myapp-deployment-568b4d69b4 (1/1 replicas created)
NewReplicaSet:   myapp-deployment-68bfc5c689 (1/1 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  14m   deployment-controller  Scaled up replica set myapp-deployment-568b4d69b4 to 1
  Normal  ScalingReplicaSet  5m6s  deployment-controller  Scaled up replica set myapp-deployment-68bfc5c689 to 1
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
        image: nginx:1.7.0 #<<<ALTERE AQUI>>>
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"

```

```bash
kubectl apply -f deploy.yml
deployment.apps/myapp-deployment configured
kubectl rollout status deployment.apps/myapp-deployment
kubectl describe deployment myapp-deployment
```

```console
Name:                   myapp-deployment
Namespace:              default
CreationTimestamp:      Thu, 10 Oct 2024 10:27:35 -0300
Labels:                 app=nginx
                        tier=frontend
Annotations:            deployment.kubernetes.io/revision: 3
Selector:               app=myapp-deployment
Replicas:               6 desired | 3 updated | 8 total | 4 available | 4 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=myapp-deployment
  Containers:
   nginx:
    Image:      nginx:1.7.0
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
  Available      False   MinimumReplicasUnavailable
  Progressing    True    ReplicaSetUpdated
OldReplicaSets:  myapp-deployment-568b4d69b4 (4/4 replicas created), myapp-deployment-68bfc5c689 (1/1 replicas created)
NewReplicaSet:   myapp-deployment-786db665b4 (3/3 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  23m   deployment-controller  Scaled up replica set myapp-deployment-568b4d69b4 to 1
  Normal  ScalingReplicaSet  14m   deployment-controller  Scaled up replica set myapp-deployment-68bfc5c689 to 1
  Normal  ScalingReplicaSet  90s   deployment-controller  Scaled up replica set myapp-deployment-68bfc5c689 to 4 from 1
  Normal  ScalingReplicaSet  90s   deployment-controller  Scaled up replica set myapp-deployment-568b4d69b4 to 4 from 1
  Normal  ScalingReplicaSet  35s   deployment-controller  Scaled down replica set myapp-deployment-68bfc5c689 to 1 from 4
  Normal  ScalingReplicaSet  35s   deployment-controller  Scaled up replica set myapp-deployment-786db665b4 to 3 from 0
```





