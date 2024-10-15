# Introdução

* Kubernetes or K8S é um sistema de orquestração de containers
* Docker permite criar um container em uma máquina, mas não consegue gerenciar múltiplos containers em _hosts_ diferentes
* K8s também permite gerenciar réplicas de um mermo serviço
* K8S realiza o balanço de carga entre essas réplicas
* Se houver aumento ou diminuição da carga, K8s se encarrega de aumentar e diminuir  automaticamente a quantidade de réplicas
* K82 realiza o health check dos containers e susbtitui containers que falharam
* Kubernetes suporta multiplas tecnolgocias de containers, como docker, cri-o e contanerd

## POD

* K8s não gerencia diretamente um container, mas um encapsulamento sobre ele, chamado POD
* Um POD pode conter múltiplos containers (que frase horrível), volumes e IPs compartilhados
* Apesar disso, o caso de uso mais comum é o de um container por POD
* Um POD deve estar implantado em um _host_. Não é possível distribuir um único POD em vários servidores, ainda que ele tenha diferentes containers dentro dele.

## Cluster

* PODs podem ser agrupados em conjuntos: nós
* Um Cluster é um conjunto de nós _hosts_ reais ou virtuais, que podem estar distribuídos em diferentes data centers
* Nós podem ser master ou workers. Os nós masters rodam pods de sistema, como load balancer
* Os pods das aplicações rodam nos workers nodes

====================

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
