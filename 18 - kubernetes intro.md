# Introdução ao kubernetes

* K8s é uma ferramenta de código aberto, criada pelo Google, para orquestrar containers.
* Outras alternativas para a orquestração de containers são: Docker Swarm e MESOS.
* A orquetração de containers inclui:
  * Substituição automática de containers que falharam;
  * Manutenção de uma quantidade específica de containers em operação;
  * Aumento/diminuição da quantidade de containers automaticamente conforme demanada;
  * Substituição de versões implantadas e reversão de _deploy_; e 
  * Balanceamento de carga

## Arquitetura

* Um nó é uma máquina física ou virtual.
* Um cluster é um conjunto de nós. Se um nó falha, ele é substituído.
* Nós podem ser _masters_ ou _workers_. Nós _workers_ hospedam as aplicações; _masters_ guardam as informações sobre as réplicas, _deployments_ e serviços.
* _Workers_ hospedam o componente __kubelet agent__ os containers da aplicação (independentemente da tecnologia, como Docker, rkt ou cri-o).
* _Masters_ hospedam o __API Server__. As informações sobre a aplicação são mantidas em um repositório do tipo chave-valor, o __etcd__. Além disso, o _master_ hospeda o __controller__ e o __scheduler__.
* __Kubectl__ é uma ferramenta de linha de comando utilizada para gerenciar os nós do __kubernetes__.


* O API Server interagem com o cluster e com o kubectl
* etcd é o banco de dados
* Scheduler é responsável por executar ações no tempo
* Controller é responsável por monitorar os nós _workers_ e responder caso algum evento aconteça.
* O container runtime é a tecnologia de container por trás dos pods

# Pods

* K8s não gerencia containers diretamente, mas por meio de um encapsulamento chamado Pod
* Um pod é uma instância de uma aplicação
* Se as requisições aumentam, deve-se criar um novo pod, sendo um para cada container
* Se a quantidade de requisições continuar aumentando, é possível criar um novo node, para abrigar mais pods, criando um cluster
* Pods resolvem dependencias de rede e recursos compartilhados, como volumes persistentes, sem a necessidade de mapeá-los manualmente

* Por padrão, o kubernetes cria um pod, com a imagem que foi fornecida como parâmetro, obtendo-a do Docker Hub, se ela não estiver disponível no _host_.

```bash
kubectl run nginx --image=nginx
```

* Para obter informações sobre um pod em execução, utilize o comando `describe pod`.

```bash
kubectl describe pod nginx
```

```console
Name:             nginx
Namespace:        default
Priority:         0
Service Account:  default
Node:             docker-desktop/192.168.65.3
Start Time:       Wed, 09 Oct 2024 10:38:17 -0300
Labels:           run=nginx
Annotations:      <none>
Status:           Running
IP:               10.1.0.96
IPs:
  IP:  10.1.0.96
Containers:
  nginx:
    Container ID:   docker://ecb47135a08ec1995b996c491f9572d07c1c063170ba328c03e4eb4ce852b1f8
    Image:          nginx
    Image ID:       docker-pullable://nginx@sha256:d2eb56950b84efe34f966a2b92efb1a1a2ea53e7e93b94cdf45a27cf3cd47fc0
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Wed, 09 Oct 2024 10:38:19 -0300
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-b258r (ro)
Conditions:
  Type                        Status
  PodReadyToStartContainers   True
  Initialized                 True
  Ready                       True
  ContainersReady             True
  PodScheduled                True
Volumes:
  kube-api-access-b258r:
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
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  12s   default-scheduler  Successfully assigned default/nginx to docker-desktop
  Normal  Pulling    12s   kubelet            Pulling image "nginx"
  Normal  Pulled     10s   kubelet            Successfully pulled image "nginx" in 1.345s (1.345s including waiting)
  Normal  Created    10s   kubelet            Created container nginx
  Normal  Started    10s   kubelet            Started container nginx
```

## Criando um pod com yml

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