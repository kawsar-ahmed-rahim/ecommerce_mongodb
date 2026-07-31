import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    return Response.json(categories);
  } catch (error) {
    console.error("Categories fetch failed", error);
    return Response.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description = "", image = "" } = body;

    if (!name) {
      return Response.json(
        { error: "Category name is required" },
        { status: 400 },
      );
    }

    await connectDB();
    const category = await Category.create({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description,
      image,
    });

    return Response.json({ category });
  } catch (error) {
    console.error("Category creation failed", error);
    return Response.json(
      { error: "Category creation failed" },
      { status: 500 },
    );
  }
}
