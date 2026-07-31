import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = path.extname(file.name || "") || ".png";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return Response.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload failed", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
