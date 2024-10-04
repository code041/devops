---
marp: true

---
# Modelos de arquitetura: Monolito
## Monolito
* Executável instalado na máquina do cliente
* Interfaces gráficas
* Segurança
  * Autenticação
  * Autorização
* Funcionalidades
    * Regras de negócio
    * Validação de dados
* Persistência
---
# Modelos de arquitetura: Monolito
## Problemas
* Sincronização de dados
* Controle de concorrência
* Transações
* Atualização de versões
## Solução
* Separar a camada de persistência
---
# Modelos de arquitetura: Cliente gordo
* Interfaces gráficas
* Segurança
* Funcionalidades
## Sistema gerenciados de bancos de dados
* Persistência
---
# Modelos de arquitetura: Cliente gordo
## Problemas
* Atualização de versões
## Solução
* Superset para o SQL 
* Functions, packages, triggers, domains...
* Funcionalidades, regras de negócio, validação de dados, e segurança no lado do servidor
---
# Modelos de arquitetura: Cliente gordo
## Cliente magro
* Interfaces gráficas
## Sistema gerenciados de bancos de dados
* Persistência
* Funcionalidades
* Segurança
---
# Modelos de arquitetura: Cliente gordo
## Problemas
* Desempenho
## Solução
* Replicar o SGBD
---
# Modelos de arquitetura: Bancos de dados distribuídos
## Cliente magro
* Interfaces gráficas
## Bancos de dados distribuídos
* Persistência
* Funcionalidades
* Segurança
* Sincronização de dados, controle de concorrência e transações
---
# Modelos de arquitetura: Bancos de dados distribuídos
## Problemas
* Interfaces gráficas
## Bancos de dados distribuídos
* Persistência
* Funcionalidades
* Segurança
* Sincronização de dados, controle de concorrência e transações
---
# Modelos de arquitetura: Bancos de dados distribuídos
## Problemas
* Interfaces gráficas
## Bancos de dados distribuídos
* Persistência
* Funcionalidades
* Segurança
* Sincronização de dados, controle de concorrência e transações
---


