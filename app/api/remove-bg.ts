import ImageKit from "imagekit";
import type { NextApiRequest, NextApiResponse } from "next";


const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { file } = req.body; // base64 or image URL

    const result = await imagekit.upload({
      file,
      fileName: "uploaded-image.jpg",
      extensions: [
        {
          name: "bg-removal",
        }as any,
      ],
    });

    res.status(200).json({ url: result.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
