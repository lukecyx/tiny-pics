import { getS3Client } from "./client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface GetFromS3Args {
  bucketName: string;
  key: string;
}

export async function getFromS3({ bucketName, key }: GetFromS3Args) {
  const s3Client = getS3Client();

  try {
    const preSignedGetUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
      { expiresIn: 3600 },
    );

    const response = await fetch(preSignedGetUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`s3: failed to get object: ${response.status}`);
    }

    return { success: true, response };
  } catch (error) {
    return { success: false, bucketName, key, error };
  }
}
