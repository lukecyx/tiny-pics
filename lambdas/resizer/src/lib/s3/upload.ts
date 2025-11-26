import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "./client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export interface UploadToS3Args {
  fileToUpload: File;
}

export async function uploadToS3({ fileToUpload }: UploadToS3Args) {
  const fileBuffer = Buffer.from(await fileToUpload.arrayBuffer());

  const s3Client = getS3Client();
  const preSignedUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: process.env.AWS_UPLOADED_BUCKET_NAME!,
      Key: fileToUpload.name,
      ContentType: "image/jpeg",
      Body: fileBuffer,
    }),
    { expiresIn: 60 },
  );

  await fetch(preSignedUrl, {
    method: "PUT",
    body: fileBuffer,
    headers: { "Content-Type": "application/json" },
  });
}

export interface UploadToS3BatchArgs {
  objectsToPut: {
    outFilename: string;
    buffer: Buffer;
  }[];
  sessionId: string;
}

export async function uploadToS3Batch({
  objectsToPut,
  sessionId,
}: UploadToS3BatchArgs) {
  const s3Client = getS3Client();

  console.log("upload to s3 batch called with", objectsToPut.length);

  const putObjectPromises = objectsToPut.map(
    async ({ outFilename, buffer }) => {
      const finalKey = `${sessionId}/${outFilename}`;
      try {
        const preSignedPutUrl = await getSignedUrl(
          s3Client,
          new PutObjectCommand({
            Bucket: process.env.AWS_RESIZED_BUCKET_NAME,
            Key: finalKey,
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
          console.log("error uploading resized", response.status);
          throw new Error(`s3: uploaded failed: ${response.status}`);
        }
        return { success: true, finalKey };
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
