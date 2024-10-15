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