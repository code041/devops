# Laboratório de microservicços

* O laboratório consiste em provisionar um sistema composto por 5 serviços:
  * Um app para votação
  * Um app para ver o resultado
  * Um banco de dados em memória
  * Um banco de dados tradicional
  * E um worker, que transfere os dados entre os bancos

* Deploy contianers
* Habiltiar conexao
* Acesso externo

* Criar um ClusterIP para o redis e outro para o postgres
* Criar NodePort para o voting-app e para o result-app

> https://github.com/dockersamples/example-voting-app

* Obtenha as imagens

```bash
docker pull ghcr.io/dockersamples/example-voting-app-vote:after
docker pull ghcr.io/dockersamples/example-voting-app-result:after
docker pull ghcr.io/dockersamples/example-voting-app-worker:latest
```

```yml
apiVersion: v1
kind: Pod
metadata:
  name: voting-app-pod
  labels:
    name: voting-app-pod
    app: demo-voting-app
spec:
  containers:
  - name: voting-app
    image: ghcr.io/dockersamples/example-voting-app-vote
    resources:
      limits:
        memory: "128Mi"
        cpu: "500m"
    ports:
      - containerPort: 80
```

```bash
kubectl apply -f voting-app-pod.yml 
```

```yml
apiVersion: v1
kind: Pod
metadata:
  name: result-app-pod
  labels:
    name: result-app-pod
    app: demo-voting-app
spec:
  containers:
  - name: result-app
    image: ghcr.io/dockersamples/example-voting-app-result:after
    resources:
      limits:
        memory: "128Mi"
        cpu: "500m"
    ports:
      - containerPort: 80
```

```bash
kubectl apply -f result-app-pod.yml 
```





## Deployments

