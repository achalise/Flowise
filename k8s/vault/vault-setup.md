### Install the Vault
[Install Vault using Helm](https://developer.hashicorp.com/vault/tutorials/kubernetes/vault-secrets-operator)

```
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
helm install vault hashicorp/vault -n vault --create-namespace --values chart/vault-values.yaml
```

### Configure Vault with policies
Run shell on the vault pod, cd /tmp and execute the following: (`k exec -it vault-0 -n vault -- sh`)

```
vault auth enable -path pg-auth-mount kubernetes
vault write auth/pg-auth-mount/config \
   kubernetes_host="https://$KUBERNETES_PORT_443_TCP_ADDR:443"
vault secrets enable -path=kvv2 kv-v2
```

```
tee webapp.json <<EOF
path "kvv2/data/webapp/config" {
   capabilities = ["read", "list"]
}
EOF
```
```
vault policy write webapp webapp.json

vault write auth/pg-auth-mount/role/role1 \
   bound_service_account_names=flowise-app \
   bound_service_account_namespaces=app \
   policies=webapp \
   audience=vault \
   ttl=24h
```
### Create the Secret entry in Vault
```
vault kv put kvv2/webapp/config username="postgres" password="postgres" awskey="aws_key_for_rds_user" awssecret="aws_secret_for_rds_user"
```

### Install Vault Operator

```
helm install vault-secrets-operator hashicorp/vault-secrets-operator -n vault-secrets-operator-system --create-namespace --values chart/vault-operator-values.yaml
```


