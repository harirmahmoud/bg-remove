import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: { file: string } = await req.json(); // 👈 typed body
    const base64 = body.file;

    // Call remove.bg API
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_file_b64: base64.split(",")[1], // remove DataURL prefix
        size: "auto",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to Base64 URL
    const url = `data:image/png;base64,${buffer.toString("base64")}`;

    return NextResponse.json({ url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
