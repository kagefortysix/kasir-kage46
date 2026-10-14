import { NextRequest, NextResponse } from "next/server";
import { getServerDatabase, saveServerDatabase, resetServerDatabase, loadDemoServerDatabase } from "@/lib/serverDb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sinceParam = searchParams.get("since");
    const forceParam = searchParams.get("force");

    const db = getServerDatabase();

    if (sinceParam && forceParam !== "true") {
      const since = Number(sinceParam);
      if (!isNaN(since) && db.lastModified <= since) {
        return NextResponse.json({
          hasUpdates: false,
          lastModified: db.lastModified,
          version: db.version,
          initialized: db.initialized,
        });
      }
    }

    return NextResponse.json({
      hasUpdates: true,
      lastModified: db.lastModified,
      version: db.version,
      initialized: db.initialized,
      data: db,
    });
  } catch (error: any) {
    console.error("[API /api/sync GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to read server database", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    // Handle dedicated database reset action
    if (body.action === "reset") {
      const updated = resetServerDatabase(body.keepOwnerUser);
      return NextResponse.json({
        success: true,
        action: "reset",
        lastModified: updated.lastModified,
        version: updated.version,
        initialized: updated.initialized,
        data: updated,
      });
    }

    // Handle reload demo data action
    if (body.action === "load_demo") {
      const updated = loadDemoServerDatabase();
      return NextResponse.json({
        success: true,
        action: "load_demo",
        lastModified: updated.lastModified,
        version: updated.version,
        initialized: updated.initialized,
        data: updated,
      });
    }

    if (!body.data) {
      return NextResponse.json(
        { error: "Invalid payload: 'data' or 'action' field is required" },
        { status: 400 }
      );
    }

    const markInitialized = body.markInitialized !== undefined ? Boolean(body.markInitialized) : true;
    const updated = saveServerDatabase(body.data, markInitialized);

    return NextResponse.json({
      success: true,
      lastModified: updated.lastModified,
      version: updated.version,
      initialized: updated.initialized,
      data: updated,
    });
  } catch (error: any) {
    console.error("[API /api/sync POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to save server database", details: error?.message },
      { status: 500 }
    );
  }
}

