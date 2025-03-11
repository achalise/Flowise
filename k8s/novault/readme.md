Secrets not stored in vault.
To run

k create -f db-embedded.yml
k create -f secrets.yml
k create -f deployment-embedded.yml

pg-client is only for debugging.
configMap is not used yet.