import { Signer } from '@aws-sdk/rds-signer';

interface DBConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    region: string;
    profile?: string;
}

export async function getAuthToken(): Promise<string> {
    const config: DBConfig = {
        host: process.env.DATABASE_HOST!!, 
        port: 5432,
        database: process.env.DATABASE_NAME!!,
        user: process.env.DATABASE_USER!!,
        region: process.env.AWS_REGION!!,
    };

    const signer = new Signer({
        hostname: config.host,
        port: config.port,
        username: config.user,
        region: config.region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY!!,
            secretAccessKey: process.env.AWS_SECRET_KEY!!
        }
    });

    const token = await signer.getAuthToken();
    console.log('Auth token:', token);
    return token;
}
