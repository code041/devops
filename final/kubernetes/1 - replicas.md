# Replicas

* Quando a aplicação possui apenas uma instância em execução, uma falha nessa instância, ou uma sobrecarga, pode impedir o acesso dos usuários.
* Para mitigar esse problema, o Kubernetes oferece o ReplicaSet, que permite manter múltiplas réplicas da aplicação em operação.
* Além de garantir alta disponibilidade, a criação de várias réplicas possibilita a distribuição da carga entre as instâncias, melhorando o desempenho e a escalabilidade.

## Criando um replication controller

* Crie o arquivo `replicationcontroller.yml`.

```yml
apiVersion: v1
kind: ReplicationController
metadata:
  name: myapp-rc
  labels:
    name: myapp
    tier: frontend
spec:
  replicas: 3
  template:
    metadata:
      name: myapp-pod
      labels:
        app: myapp
        type: front-end
    spec:
      containers:
      - name: nginx-controller
        image: nginx
```

* No mesmo diretório no qual esse arquivo foi criado, execute o comando `kubectl create`.

```bash
kubectl create -f replicationcontroller.yml
replicationcontroller/myapp-rc created
```

* Para obter todos os _replictation controllers_ criados, execute o comando `kubectl get replicationcontroller`.

```bash
kubectl get replicationcontroller
NAME       DESIRED   CURRENT   READY   AGE
myapp-rc   3         3         3       11s
```

* Para obter detalhes de um _replication controller_ específico, execute o comando `kubectl describe replicationcontroller {ID}`

```bash
kubectl describe replicationcontroller myapp-rc
Name:         myapp-rc
Namespace:    default
Selector:     app=myapp,type=front-end
Labels:       name=myapp
              tier=frontend
Annotations:  <none>
Replicas:     3 current / 3 desired
Pods Status:  3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:  app=myapp
           type=front-end
  Containers:
   nginx-controller:
    Image:        nginx
    Port:         <none>
    Host Port:    <none>
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age   From                    Message
  ----    ------            ----  ----                    -------
  Normal  SuccessfulCreate  100s  replication-controller  Created pod: myapp-rc-49jhz
  Normal  SuccessfulCreate  100s  replication-controller  Created pod: myapp-rc-r87r8
  Normal  SuccessfulCreate  100s  replication-controller  Created pod: myapp-rc-z4drr
```

* Obtenha os pods e tente remover um deles.

```bash
kubectl get pods
NAME             READY   STATUS    RESTARTS   AGE  
myapp-rc-8z5hg   1/1     Running   0          5m53s
myapp-rc-jnfts   1/1     Running   0          5m53s
myapp-rc-rwzqs   1/1     Running   0          5m53s

kubectl delete pod myapp-rc-8z5hg
pod "myapp-rc-8z5hg" deleted

kubectl get pods
NAME             READY   STATUS    RESTARTS   AGE
myapp-rc-45vft   1/1     Running   0          5s
myapp-rc-jnfts   1/1     Running   0          6m13s
myapp-rc-rwzqs   1/1     Running   0          6m13s
```

* Perceba que, ao tentar remover um dos pods, o K8S criou uma nova instância para substituí-lo.

* Agora, aumente a quantidade de réplicas, por meio do comando `scale`.

```bash
kubectl scale replicationcontroller myapp-rc --replicas=4 
replicationcontroller/myapp-rc scaled

kubectl get pods
NAME             READY   STATUS    RESTARTS   AGE
myapp-rc-45vft   1/1     Running   0          2m20s
myapp-rc-j8dz2   1/1     Running   0          6s
myapp-rc-jnfts   1/1     Running   0          8m28s
myapp-rc-rwzqs   1/1     Running   0          8m28s
```

* Tente remover um dos pods novamente

```bash
kubectl delete pod myapp-rc-45vft
pod "myapp-rc-45vft" deleted

kubectl get pods
NAME             READY   STATUS    RESTARTS   AGE
myapp-rc-j8dz2   1/1     Running   0          72s
myapp-rc-jnfts   1/1     Running   0          9m34s
myapp-rc-ks4hk   1/1     Running   0          6s
myapp-rc-rwzqs   1/1     Running   0          9m34s
```

* Depois de incrementar o número de réplicas, o K8S garante que a nova quantidade de instâncias seja mantida. Quando um pod é removido, o K8S cria um novo, para substitui-lo.

* Por fim, crie um novo pod, com o arquivo `pod.yml`.

```bash
kubectl apply -f pod.yml 
pod/myapp created

kubectl get all
NAME                 READY   STATUS    RESTARTS   AGE
myapp            1/1     Running   0          4m36s
myapp-rc-4mbc6   1/1     Running   0          4s
myapp-rc-775z8   1/1     Running   0          65s
myapp-rc-kb48z   1/1     Running   0          65s
myapp-rc-wqcf2   1/1     Running   0          65s
```

* Agora existem 5 pods com a mesma imagem, mas só 4 pertencem ao _replication controller_.

* Por fim, tente remover o pod `myapp`.

```bash
kubectl delete pod myapp
pod "myapp" deleted

kubectl get pods
NAME             READY   STATUS    RESTARTS   AGE
myapp-rc-4mbc6   1/1     Running   0          51s
myapp-rc-775z8   1/1     Running   0          112s
myapp-rc-kb48z   1/1     Running   0          112s
myapp-rc-wqcf2   1/1     Running   0          112s
```

* Como um dos pods foi criado fora do _replication controller_, ainda que tenha as mesmas _labels_ e imagem, ele não é gerenciado pelo __RC__. Por isso, foi possível removê-lo.

## ReplicaSet

* O replicaset exige que se informe um seletor em seu arquivo de configuração. Isso permite ao ReplicaSet considerar pods existentes para o calcula da quantidade de replicas que devem estar em execução
* è pra isso que as labels são usadas
* A parte do template é necessária para que o K8s saiba como criar um novo pod, caso necessário

* Crie o arquivo `replicaset.yml`.

```yml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: myapp-replicaset
  labels:
    name: myapp
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        type: front-end
    spec:
      containers:
      - name: nginx-controller
        image: nginx
```

* Para criar um _replica set_, execute o comando `apply`

```bash
kubectl apply -f replicaset.yml
replicaset.apps/myapp-replicaset created

kubectl get all
NAME                         READY   STATUS    RESTARTS   AGE
pod/myapp-replicaset-g6hcz   1/1     Running   0          44s
pod/myapp-replicaset-lmf4n   1/1     Running   0          44s
pod/myapp-replicaset-rl9w7   1/1     Running   0          44s

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   113s

NAME                               DESIRED   CURRENT   READY   AGE
replicaset.apps/myapp-replicaset   3         3         3       44s
```

* Agora, execute o comando `scale`, para aumentar a quantidade de réplicas.

```bash
kubectl scale replicaset myapp-replicaset --replicas=4    
replicaset.apps/myapp-replicaset scaled
```

* Em seguida, remova todos os objetos K8S, por meio do comando `delete all`.

```bash
kubectl delete all --all
```

* Por fim, crie o _replica set_ novamente e verifique a quantidade de pods

```bash
kubectl apply -f replicaset.yml
replicaset.apps/myapp-replicaset created

kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
myapp-replicaset-64jjx   1/1     Running   0          18s
myapp-replicaset-lmgsk   1/1     Running   0          18s
myapp-replicaset-vs94s   1/1     Running   0          18s
```

* Perceba que, apesar da quantidade de réplicas ter sido alterada anteriormente, tal mudança não foi persistida no arquivo de definição.


### _Replace_


* A única maneira de persistir tal mudança no arquivo `replicaset.yml` é por meio de uma alteração direta em seu conteúdo.
* Para aumentar ou diminuir a quantidade de réplicas, é possível alterar o arquivo de definição e executar o comando `replace`. 

```yml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: myapp-replicaset
  labels:
    name: myapp
    tier: frontend
spec:
  replicas: 8 ## altere a quantidade de réplicas aqui
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        type: frontend
    spec:
      containers:
      - name: nginx-controller
        image: nginx
```

```bash
kubectl replace -f replicaset.yml
replicaset.apps/myapp-replicaset replaced

kubectl get pods
NAME                     READY   STATUS              RESTARTS   AGE
myapp-replicaset-64jjx   1/1     Running             0          2m40s
myapp-replicaset-82bdm   1/1     Running             0          4s
myapp-replicaset-lmgsk   1/1     Running             0          2m40s
myapp-replicaset-rjmd5   0/1     ContainerCreating   0          4s
myapp-replicaset-tjdlb   0/1     ContainerCreating   0          4s
myapp-replicaset-vs94s   1/1     Running             0          2m40s
myapp-replicaset-zpqcn   0/1     ContainerCreating   0          4s
myapp-replicaset-zwvsl   1/1     Running             0          4s
```





