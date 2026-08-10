import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { getAuthenticatedUser } from "@/lib/auth";

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();
    const category = await Category.findById(params.id);
    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    Object.assign(category, {
      name: body.name !== undefined ? String(body.name).trim() : category.name,
      description:
        body.description !== undefined
          ? String(body.description).trim()
          : category.description,
      image:
        body.image !== undefined ? String(body.image).trim() : category.image,
      isActive:
        body.isActive !== undefined
          ? Boolean(body.isActive)
          : category.isActive,
    });

    await category.save();
    return Response.json({ category });
  } catch (error) {
    console.error("Category update failed", error);
    return Response.json({ error: "Category update failed" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const deleted = await Category.findByIdAndDelete(params.id);
    if (!deleted) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Category delete failed", error);
    return Response.json({ error: "Category delete failed" }, { status: 500 });
  }
}
