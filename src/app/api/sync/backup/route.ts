import { NextRequest, NextResponse } from "next/server";
import { getServerDatabase, restoreServerDatabase } from "@/lib/serverDb";

export async function GET() {
  try {
    const db = getServerDatabase();
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `kage46-pos-backup-${dateStr}.json`;

    return new NextResponse(JSON.stringify(db, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("[API /api/sync/backup GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to create backup", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid backup JSON payload" },
        { status: 400 }
      );
    }

    const restored = restoreServerDatabase(body);

    return NextResponse.json({
      success: true,
      message: "Database restored successfully",
      lastModified: restored.lastModified,
      version: restored.version,
      data: restored,
    });
  } catch (error: any) {
    console.error("[API /api/sync/backup POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to restore backup", details: error?.message },
      { status: 500 }
    );
  }
}
