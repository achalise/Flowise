### Setting up IAM Role based authentication for RDS

* create a db instance using the aws console
* modify the db instance for iam authentication
* ensure that public access is turned on
* ensure that a security group with proper inbound rules is used when creating the database, restrict incoming traffic to only your IP address
* create a new database
```
CREATE DATABASE my_db;

```
* create a user in the db:

```
CREATE DATABASE my_db;
CREATE USER flowuser WITH PASSWORD 'wolf123';
GRANT GRANT rds_iam TO flowuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, CREATE ON SCHEMA public TO flowuser;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO flowuser;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

* create following IAM policy:
Give a policy name, e.g., DbIamAUth, and ensure that that the arn below is in the following format, where DbClusterResourceId is the resource id that you can get from the db config in aws console.

`arn:aws:rds-db:region:account-id:dbuser:DbClusterResourceId/db-user-name`



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

```export AWS_PROFILE=pg-user```

```
aws --profile pg-user rds generate-db-auth-token \
  --hostname database-1.ce9wstaass0m.ap-southeast-2.rds.amazonaws.com \
  --port 5432 \
  --region ap-southeast-2 \
  --username flowuser
```


### Testing using psql

```
IAM_TOKEN=$(aws --profile pg-user rds generate-db-auth-token \
  --hostname database-1.ce9wstaass0m.ap-southeast-2.rds.amazonaws.com \
  --port 5432 \
  --region ap-southeast-2 \
  --username flowuser)
psql "host=database-1.ce9wstaass0m.ap-southeast-2.rds.amazonaws.com port=5432 dbname=my_db user=flowuser password=$IAM_TOKEN"
```
