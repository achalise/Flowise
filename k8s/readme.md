- configmap for the script to generate ssl keys and certificates


kubectl create secret generic postgres-ssl \
  --from-file=server.crt=./postgresql.crt \
  --from-file=server.key=./postgresql.key




base64 -i ./postgresql.crt -o ./postgresql.crt.base64

### Setting up IAM Role based authentication for RDS

* create a db instance using the aws console
* modify the db instance for iam authentication
* create a user in the db:

CREATE USER flowuser WITH PASSWORD 'wolf123';
GRANT rds_iam TO flowuser;

* create following IAM policy:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowRDSConnect",
      "Effect": "Allow",
      "Action": "rds-db:connect",
      "Resource": "arn:aws:rds-db:ap-southeast-2:993786693637:dbuser:db-NLJVL7THKQJC7E6CVW5E3FAWUI/flowuser"
    }
  ]
}

```

* Create role with above policy
* create iam user flowuser and attach the policy directly 

```
aws rds generate-db-auth-token \
  --hostname database-1.ce9wstaass0m.ap-southeast-2.rds.amazonaws.com \
  --port 5432 \
  --region ap-southeast-2 \
  --username flowuser
```


psql "host=database-1.ce9wstaass0m.ap-southeast-2.rds.amazonaws.com port=5432 dbname=mydb user=flowuser password=database-1.ce9wstaass0m.ap-southeast-2.rds.amazonaws.com:5432/?Action=connect&DBUser=flowuser&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6OYSNRACVUXF4UAN%2F20250305%2Fap-southeast-2%2Frds-db%2Faws4_request&X-Amz-Date=20250305T033940Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=cf170fdf1d6b45bc090650eac5f258cd49af5bee9d89647b406519f2e7f997fe sslmode=require"
