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

export interface GetMutlipleObjectsFromS3 {
  bucketName: string;
  keys: string[];
}
export async function getMultipleFromS3({
  bucketName,
  keys,
}: GetMutlipleObjectsFromS3) {
  const s3Client = getS3Client();

  // TODO: This needs to not care what it's getting from s3
  // and the caller of the return should then do something with the image
  try {
    const presignedUrlPromises = keys.map(async (key) => {
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        }),
        { expiresIn: 3600 },
      );

      return { key, url };
    });

    const presignedUrls = await Promise.all(presignedUrlPromises);

    const images = Promise.all(
      presignedUrls.map(async ({ key, url }) => {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`failed to fetch image: ${url}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        const filename = key.split("/")[1];
        const dimensions = filename.split("_").at(-1);

        const [height, width] = dimensions ? dimensions.split("x") : [0, 0];

        return {
          src: Buffer.from(arrayBuffer).toString("base64"),
          height,
          width,
          filename,
        };
      }),
    );

    return images;
  } catch (error) {
    console.error(error);
  }
}
