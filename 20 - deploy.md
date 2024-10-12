# Deployment

* Substituir as réplicas por novas versões da aplicação
* Reverter as alterações em caso de erro
* Parar o ambiente, executar uma alteraççao e retomar a execução
* UM pod é um objeto k8s que encapsula um container
* Uma replica é um conjunot de pods
* Um deployment é um objeto que encapsula uma replica e oferece as condições acima
* Ao criar um deployment, um replicaset é automaticamente criado

```bash
kubectl get all
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

