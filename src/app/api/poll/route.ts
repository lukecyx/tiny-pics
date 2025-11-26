import { NextRequest, NextResponse } from "next/server";
import { getFromDynamo } from "@/lib/dyanmo";
import { fetchImages, jsonError } from "../helpoers";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return jsonError("No sessionId provided", 400);
  }

  try {
    const result = await getFromDynamo({
      tableName: "Sessions",
      key: sessionId,
    });

    if (!result?.Item) {
      return jsonError("Session not found", 404);
    }

    const done = result.Item.Done?.BOOL === true;

    const keys =
      result.Item.ResizedKeys?.L?.map((key) => key.S).filter(
        (key): key is string => !!key,
      ) || [];

    if (!done || keys.length === 0) {
      return NextResponse.json({
        success: false,
        status: "processing",
        images: [],
      });
    }

    const images = await fetchImages(keys);

    return NextResponse.json({
      success: true,
      status: "done",
      images,
    });
  } catch (error) {
    console.error("Error in GET /api/images:", error);
    return jsonError("Internal server error", 500, error);
  }
}
