# Criando um pod com yml

* Crie o arquivo `pod.yml` no diretório `k8s`.

```yml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  labels:
    name: myapp
    tier: frontend
spec:
  containers:
  - name: myapp
    image: nginx
    resources:
      limits:
        memory: "128Mi"
        cpu: "500m"
    ports:
      - containerPort: 3000
```

* No terminal, acesse o diretório `k8s` e execute o comando `apply`, conforme o exemplo:

```bash
kubectl apply -f pod.yml
pod/myapp created
```

* Em seguida, execute os comandos `get pods` e `describe`

```bash
kubectl get pods
NAME    READY   STATUS    RESTARTS   AGE
myapp   1/1     Running   0          38s

Name:             myapp
Namespace:        default
Priority:         0
Service Account:  default
Node:             docker-desktop/192.168.65.3
Start Time:       Wed, 09 Oct 2024 10:55:43 -0300
Labels:           name=myapp
                  tier=frontend
Annotations:      <none>
Status:           Running
IP:               10.1.0.97
IPs:
  IP:  10.1.0.97
Containers:
  myapp:
    Container ID:   docker://408ddc7d15185fd424f19c229ab4f257ca2bc552786a9c929a431e9319d43958
    Image:          nginx
    Image ID:       docker-pullable://nginx@sha256:d2eb56950b84efe34f966a2b92efb1a1a2ea53e7e93b94cdf45a27cf3cd47fc0
    Port:           3000/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Wed, 09 Oct 2024 10:55:46 -0300
    Ready:          True
    Restart Count:  0
    Limits:
      cpu:     500m
      memory:  128Mi
    Requests:
      cpu:        500m
      memory:     128Mi
    Environment:  <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-kxrfr (ro)
Conditions:
  Type                        Status
  PodReadyToStartContainers   True
  Initialized                 True
  Ready                       True
  ContainersReady             True
  PodScheduled                True
Volumes:
  kube-api-access-kxrfr:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   Guaranteed
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  73s   default-scheduler  Successfully assigned default/myapp to docker-desktop
  Normal  Pulling    73s   kubelet            Pulling image "nginx"
  Normal  Pulled     71s   kubelet            Successfully pulled image "nginx" in 1.439s (1.439s including waiting)
  Normal  Created    71s   kubelet            Created container myapp
  Normal  Started    71s   kubelet            Started container myapp
```