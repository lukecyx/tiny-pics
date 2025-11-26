import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "./client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export interface UploadToS3Args {
  fileToUpload: File;
  sessionId?: string;
}

export async function uploadToS3({ fileToUpload, sessionId }: UploadToS3Args) {
  const fileBuffer = Buffer.from(await fileToUpload.arrayBuffer());

  const s3Client = getS3Client();
  const preSignedUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: process.env.AWS_UPLOADED_BUCKET_NAME!,
      Key: `${sessionId}/${fileToUpload.name}`,
      ContentType: "image/jpeg",
      Body: fileBuffer,
    }),
    { expiresIn: 60 },
  );

  // todo update dynamo db table

  await fetch(preSignedUrl, {
    method: "PUT",
    body: fileBuffer,
    headers: { "Content-Type": "application/json" },
  });

  return sessionId;
}

export interface UploadToS3BatchArgs {
  objectsToPut: {
    outFilename: string;
    buffer: Buffer;
  }[];
}

export async function uploadToS3Batch({ objectsToPut }: UploadToS3BatchArgs) {
  const s3Client = getS3Client();

  const putObjectPromises = objectsToPut.map(
    async ({ outFilename, buffer }) => {
      try {
        const preSignedPutUrl = await getSignedUrl(
          s3Client,
          new PutObjectCommand({
            Bucket: process.env.AWS_RESIZED_BUCKET_NAME,
            Key: outFilename,
            ContentType: "image/jpeg",
            Body: buffer,
          }),
          { expiresIn: 86400 },
        );

        const response = await fetch(preSignedPutUrl, {
          method: "PUT",
          body: new Blob([Uint8Array.from(buffer)], { type: "image/jpeg" }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`s3: uploaded failed: ${response.status}`);
        }

        return { outFilename, success: true };
      } catch (error) {
        return {
          outFilename,
          success: false,
          error,
        };
      }
    },
  );

  return await Promise.all(putObjectPromises);
}
