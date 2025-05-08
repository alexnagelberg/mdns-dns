#!/bin/sh

docker build -t localhost/dnsproxy:latest .
docker save localhost/dnsproxy:latest | sudo k3s ctr images import -
kubectl apply -f dnsproxy.yaml
