import { S3Client } from "@aws-sdk/client-s3";

export let client: S3Client | null;

export function getS3Client() {
  if (!client) {
    return new S3Client({});
  }

  return client;
}
