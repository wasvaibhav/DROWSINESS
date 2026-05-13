import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "Driver Alert AI",
    timestamp: new Date().toISOString(),
  });
}
