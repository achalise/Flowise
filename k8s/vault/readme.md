Deployment with hashicorp vault used to store secrets for both embedded postgres as well as RDS. For RDS, IAM based authentication is used.

The vault setup instructions in the [here](./vault-setup.md)

The RDS with IAM authentication setup instructions [here](./iam-rds-setup.md)

### To deploy

For  vault and secrets:

```
kubectl create ns app
kubectl apply -f vault-auth.yaml
kubectl apply -f secrets.yml
```

For embedded db:
```
kubectl apply -f db-embedded.yml
kubectl apply -f deployment-embedded.yml
```

For rds:
```
kubectl apply -f deployment-rds.yml
```