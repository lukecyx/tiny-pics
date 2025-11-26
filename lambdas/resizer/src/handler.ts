import { S3Event } from "aws-lambda";
import { getFromS3, uploadToS3Batch } from "./lib/s3";
import { resizeImages } from "./resizeImages";
import { updateSession } from "./lib/dyanmo/update";

export const handler = async (event: S3Event) => {
  console.log(JSON.stringify(event));
  try {
    const uploadedObject = event.Records[0].s3.object;

    const fetchedFile = await getFromS3({
      bucketName: process.env.AWS_UPLOADED_BUCKET_NAME!,
      key: uploadedObject.key,
    });

    if (!fetchedFile.success) {
      console.error(`s3: failed to fetch file: ${fetchedFile.error}`);

      return;
    }

    const fileToResizeBuffer = await fetchedFile.response?.arrayBuffer();

    if (!fileToResizeBuffer) {
      console.error("resizer: failed to get array buffer");

      return;
    }

    const resizedImages = await resizeImages({ fileToResizeBuffer });

    const sessionId = uploadedObject.key.split("/")[0];

    const uploadedResults = await uploadToS3Batch({
      objectsToPut: resizedImages,
      sessionId: sessionId,
    });

    const successfulKeys = uploadedResults
      .filter((result) => result.success)
      .map((result) => result.finalKey);

    // TODO: Maybe save the failures to another FAILED table for separation of concerns
    // OR, have another key in the Session table with FailedUResizes or similar
    // THEN only try to resize the failed ones IF the user prsses a button

    await updateSession({ sessionId, fileKeys: successfulKeys });
  } catch (err) {
    console.error("Error resizing image:", err);
  }
};
