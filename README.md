# mDNS DNS Proxy Service

This is everything needed for a container/pod to run a DNS server and resolve .lan addresses to .local. It includes a container that will run dnsmasq to forward all DNS requests to the default server EXCEPT *.lan, which get redirected to a DNS server written in node that resolves it with avahi.

The stuff included can be built and shipped to a k3s cluster using the k3s.sh script. My basic MetalLB setup can also be paired with it to expose an external address for the DNS server on the cluster. Just run the k3s.sh script in metallb directory as well.
