# Volumes k8s

```yml
apiVersion: v1
kind: Pod
metadata:
  name: redis-vol
spec:
  containers:
  - name: redisvol-container
    image: redis
    volumeMounts:
    - name: redis-volume
      mountPath: /data
  volumes:
  - name: redis-volume
    emptyDir: {}
```

```bash
kubectl apply -f redis-vol.yml
kubectl exec -it redis-vol /bin/bash
root-redis-vol:/data# echo "testando" > intro.txt
root@redis-vol:/data# kill 1
root@redis-vol:/data# command terminated with exit code 137

kubectl get pods
NAME        READY   STATUS    RESTARTS      AGE
redis-vol   1/1     Running   1 (11s ago)   4m35s

kubectl exec -it redis-vol /bin/bash 
root@redis-vol:/data# ls
dump.rdb  redis-intro.txt
root@redis-vol:/data# cat intro.txt
testando
root@redis-vol:/data# exit
exit
```


