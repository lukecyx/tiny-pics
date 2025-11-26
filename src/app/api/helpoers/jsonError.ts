import { NextResponse } from "next/server";

export function jsonError(message: string, status: number, err?: unknown) {
  return NextResponse.json(
    {
      success: false,
      message,
      error: err instanceof Error ? err.message : undefined,
    },
    { status },
  );
}
