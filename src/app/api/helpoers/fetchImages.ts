import { GetObjectCommand } from "@aws-sdk/client-s3";

import { getS3Client } from "@/lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { extractImageDimensions } from "./extractImageDimensions";

export async function fetchImages(keys: string[]) {
  const s3Client = getS3Client();

  return Promise.all(
    keys.map(async (key) => {
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: "tiny-pics-resized",
          Key: key,
        }),
        { expiresIn: 3600 },
      );

      const filename = key.split("/")[1];
      const [height, width] = extractImageDimensions(key);

      return { key, url, filename, height, width };
    }),
  );
}
