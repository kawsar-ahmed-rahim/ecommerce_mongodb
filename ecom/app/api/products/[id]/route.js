import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).lean();
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json(product);
  } catch (error) {
    console.error("Product fetch failed", error);
    return Response.json({ error: "Product fetch failed" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    Object.assign(product, {
      title:
        body.title !== undefined ? String(body.title).trim() : product.title,
      description:
        body.description !== undefined
          ? String(body.description).trim()
          : product.description,
      price: body.price !== undefined ? Number(body.price) : product.price,
      category:
        body.category !== undefined
          ? String(body.category).trim()
          : product.category,
      image:
        body.image !== undefined ? String(body.image).trim() : product.image,
      stock: body.stock !== undefined ? Number(body.stock) : product.stock,
      tags: body.tags !== undefined ? body.tags : product.tags,
      isFeatured:
        body.isFeatured !== undefined
          ? Boolean(body.isFeatured)
          : product.isFeatured,
    });

    await product.save();
    return Response.json({ product });
  } catch (error) {
    console.error("Product update failed", error);
    return Response.json({ error: "Product update failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const deleted = await Product.findByIdAndDelete(params.id);
    if (!deleted) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Product delete failed", error);
    return Response.json({ error: "Product delete failed" }, { status: 500 });
  }
}
