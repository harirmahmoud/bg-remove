import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { file } = await req.json();

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY as string,
      },
      body: new URLSearchParams({
        image_file_b64: file.split(",")[1],
        size: "auto",
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }

    const buffer = await response.arrayBuffer();
    const base64Result = `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`;

    return NextResponse.json({ url: base64Result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
