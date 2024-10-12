# Replicas

* Se a aplicação possui apenas uma instância em operação, se ela falhar, o usuário fica impedido de acessá-la.
* Para resolver esse problema, K8S provê o replicaSet como uma solução
* Criar várias réplicas também permite distribuir a carga entre as instancias

* Crie o arquivo `rc-definition.yml`.

```yml
apiVersion: v1
kind: ReplicationController
metadata:
  name: myapp-rc
  labels:
    name: myapp
    tier: frontend
spec:
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
replicas: 3
```

```bash
kubectl create -f rc-definition.yml
```

```bash
kubectl get replicationcontroller
```

## ReplicaSet

* O replicaset exige que se informe um seletor em seu arquivo de configuração. Isso permite ao ReplicaSet considerar pods existentes para o calcula da quantidade de replicas que devem estar em execução
* è pra isso que as labels são usadas
* A parte do template é necessária para que o K8s saiba como criar um novo pod, caso necessário

* Exercício: Criar um replication controler com pods existentes. Aumentar a quantidad ede pods na mao. Diminuir a quanbtidade de pods na mao
* Criar um replica set, com pods existentes, aumentar e diminuir

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

* Se um pod for criado fora do replicaset, com a mesma label do seletor do RS, o RS vai encerrar o novo pod

## Scale

* Para aumentar ou diminuir a quantidade de réplicas, é possível alterar o arquivo de definição e executar o comando `replace`. 

```bash
kubectl replace -f replicaset-definitin.yml
```

* Outra maneira é por meio do comando `scale`. Isso, contudo, não altera o conteúdo do arquivo de definição.

```bash
kubectl scale --replicas=6 -f replicaset myapp-replicaset
```




