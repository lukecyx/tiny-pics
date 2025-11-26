import { NextRequest } from "next/server";
import { uploadToS3 } from "@/lib/s3/upload";
import { createJsonResponse } from "@/utils";
import { writeSessionData } from "@/lib/dyanmo";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const sessionId = formData.get("sessionId") as string | null;

  if (!file || !sessionId) {
    return createJsonResponse({ body: { message: "missing request details" } });
  }

  try {
    await uploadToS3({ fileToUpload: file, sessionId });
    await writeSessionData({ uuid: sessionId });
  } catch (error) {
    console.error(error);

    return createJsonResponse({
      body: {
        message: "failed to upload with error",
        error: error,
      },
    });
  }

  return createJsonResponse({ body: { message: "upload complete" } });
}
