import { NextResponse } from "next/server";

export function jsonSuccess(data: Record<string, unknown>, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}
