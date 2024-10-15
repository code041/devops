# Criando um Pod

* No terminal, execute o comando `kubectl run`, conforme o exemplo abaixo:

```bash
kubectl run nginx --image=nginx
```

* Em seguida execute o comando `kubectl get pods`, para obter informações sobre os pods criados.

```bash
C:\Users\Felipe Bill\git\devops>kubectl get pods
NAME    READY   STATUS              RESTARTS   AGE
nginx   0/1     ContainerCreating   0          6s
```

* Para obter informações sobre um pod específico, use o comando `kubectl decribe`

```bash
kubectl describe pod nginx
```

```console
Name:             nginx
Namespace:        default
Priority:         0
Service Account:  default
Node:             docker-desktop/192.168.65.3
Start Time:       Mon, 07 Oct 2024 17:36:43 -0300
Labels:           run=nginx
Annotations:      <none>
Status:           Running
IP:               10.1.0.53
IPs:
  IP:  10.1.0.53
Containers:
  nginx:
    Container ID:   docker://2aec4f4cf1dba0fdd7d84a7b302c63c88bfafb868c62ceef1e2afa3af65f282e
    Image:          nginx
    Image ID:       docker-pullable://nginx@sha256:d2eb56950b84efe34f966a2b92efb1a1a2ea53e7e93b94cdf45a27cf3cd47fc0
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Mon, 07 Oct 2024 17:36:50 -0300
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-nt5zs (ro)
Conditions:
  Type                        Status
  PodReadyToStartContainers   True
  Initialized                 True
  Ready                       True
  ContainersReady             True
  PodScheduled                True
Volumes:
  kube-api-access-nt5zs:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   BestEffort
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age    From               Message
  ----    ------     ----   ----               -------
  Normal  Scheduled  2m47s  default-scheduler  Successfully assigned default/nginx to docker-desktop
  Normal  Pulling    2m46s  kubelet            Pulling image "nginx"
  Normal  Pulled     2m41s  kubelet            Successfully pulled image "nginx" in 5.83s (5.83s including waiting)
  Normal  Created    2m40s  kubelet            Created container nginx
  Normal  Started    2m40s  kubelet            Started container nginx
```

* Não é possível acessar o Pod, mas podemos acessar o container, como fizemos nos exercícios anteriores.

```bash
docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS     NAMES
2aec4f4cf1db   d2eb56950b84   "/docker-entrypoint.…"   6 minutes ago   Up 6 minutes             k8s_nginx_nginx_default_40935f35-a4ec-4bc3-a87b-df365519a9f8_0

docker exec -it 2aec sh
# 
```

* Dentro do terminal, execute os comandos abaixo:

```bash
# hostname -i
10.1.0.53
# curl 10.1.0.53
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

* Outra maneira de obter informações sobre os Pods em execução é por meio do comando abaixo:

```bash
kubectl get pods -o wide
NAME    READY   STATUS    RESTARTS   AGE     IP          NODE             NOMINATED NODE   READINESS GATES
nginx   1/1     Running   0          9m51s   10.1.0.53   docker-desktop   <none>           <none>
```

* Para remover um Pod, utilize o comando `kubectl delete pod`. Todavia, antes de remover o Pod, experimente remover o container e veja o que acontece.

```bash
kubectl get pods
NAME    READY   STATUS    RESTARTS     AGE
nginx   1/1     Running   1 (5s ago)   12m

docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS     NAMES
2aec4f4cf1db   d2eb56950b84   "/docker-entrypoint.…"   12 minutes ago   Up 12 minutes             k8s_nginx_nginx_default_40935f35-a4ec-4bc3-a87b-df365519a9f8_0

docker kill 2aec
2aec

docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS     NAMES
317707f6ca5c   d2eb56950b84   "/docker-entrypoint.…"   7 seconds ago   Up 6 seconds             k8s_nginx_nginx_default_40935f35-a4ec-4bc3-a87b-df365519a9f8_1
```

* Como o Pod ainda existe, a tentativa de encerrar o container resultará no K8S criando uma nova instância desse container, sempre que o container falhar.

* Para encerrá-lo, deve-se terminar a execução do Pod.

```bash
C:\Users\Felipe Bill\git\devops>kubectl get pods
NAME    READY   STATUS    RESTARTS        AGE
nginx   1/1     Running   1 (2m16s ago)   14m

C:\Users\Felipe Bill\git\devops>kubectl delete pod nginx
pod "nginx" deleted

C:\Users\Felipe Bill\git\devops>kubectl get pods
No resources found in default namespace.

C:\Users\Felipe Bill\git\devops>docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

```

