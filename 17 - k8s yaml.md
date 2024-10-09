# Yaml

## Criando uma especificação de _deploy_ 

```bash
kubectl delete all --all
```

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8s-frontend
spec:
  selector:
    matchLabels:
      app: k8s-frontend
  template:
    metadata:
      labels:
        app: k8s-frontend
    spec:
      containers:
      - name: k8s-frontend
        image: frontend:2.0
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 4200
```

* No diretório no qual se encontra o arquivo `deploy.yml`, execute o comando `apply`, conforme o exemplo:

```bash
kubectl apply -f deploy.yml
deployment.apps/k8s-frontend created
```

* Para aumentar a quantidade de réplicas, altere o arquivo `deploy.yml`, e adicione uma chave logo abaixo de `spec`.

```yml
spec:
  replicas: 5
  selector:
    matchLabels:
      app: k8s-frontend
```

* Salve as alterações e repita o comando `apply`.

```bash
kubectl apply -f deploy.yml
deployment.apps/k8s-frontend configured

kubectl get pods
NAME                            READY   STATUS      RESTARTS      AGE
k8s-frontend-86b5bfc5d4-bknsz   1/1     Running     2 (22s ago)   39s
k8s-frontend-86b5bfc5d4-fn4v4   1/1     Running     2 (21s ago)   39s
k8s-frontend-86b5bfc5d4-nh67j   0/1     OOMKilled   2 (22s ago)   39s
k8s-frontend-86b5bfc5d4-pwhl9   1/1     Running     2 (21s ago)   39s
k8s-frontend-86b5bfc5d4-qnbcv   0/1     OOMKilled   5 (93s ago)   3m28s
```

## Criando uma especificação de serviço

```yml
apiVersion: v1
kind: Service
metadata:
  name: k8s-frontend
spec:
  type: LoadBalancer
  selector:
    app: k8s-frontend
  ports:
  - port: 30000
    targetPort: 4200

```

```bash
kubectl apply -f service.yml
service/k8s-frontend created
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