import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return Response.json(products);
}

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title || !body.price) {
      return Response.json(
        { error: "Title and price are required" },
        { status: 400 },
      );
    }

    await connectDB();
    const product = await Product.create({
      title: body.title,
      description: body.description || "",
      price: Number(body.price),
      category: body.category || "General",
      image: body.image || "",
      stock: Number(body.stock || 0),
      tags: Array.isArray(body.tags) ? body.tags : [],
      isFeatured: Boolean(body.isFeatured),
    });

    return Response.json({ product });
  } catch (error) {
    console.error("Product creation failed", error);
    return Response.json({ error: "Product creation failed" }, { status: 500 });
  }
}
