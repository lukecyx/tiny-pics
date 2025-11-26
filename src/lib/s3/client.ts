import { S3Client } from "@aws-sdk/client-s3";

export let client: S3Client | null;

export function getS3Client() {
  if (!client) {
    return new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  return client;
}
